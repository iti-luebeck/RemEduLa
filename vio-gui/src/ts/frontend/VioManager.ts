
import Logger from "../core/Logger";
import VioGuiFrontend, { VioGuiFrontendType } from "./VioGuiFrontend";
import VioGuiEvents from "../core/VioGuiEvents";
import LayoutManager from "./LayoutManager/LayoutManager";
import { DeviceInfo as TcfDeviceInfo, PortSize as TcfPortSize } from "../backend/tcf";
import { sleep } from "../core/helper/sleep";
import VioPort from "./VioPort";

export interface VioPortDef {
    type: 'INPUT' | 'OUTPUT',
    jtagIndex: number,
    xsdbIndex: number,
    portIndex: number,
    _id?: string
};

export default class VioManager {
    private static vioPortNotifyList: Map<number, VioPort> = new Map();

    public static connection: VioGuiFrontendType;

    public static devName: string = "";
    public static devInfo?: TcfDeviceInfo;
    public static portSizes?: TcfPortSize[][];
    public static serialPath: string = "";

    public static async init(): Promise<void> {
        const processor: VioGuiEvents = {
            deviceRemoved: (args) => {
                if (this.devName !== args.deviceName)
                    return;
                this.stopRequestInputState();
                this.devInfo = undefined;
                this.portSizes = undefined;
                Logger.info("VioManager", "Board was disconnected");
            },

            deviceAdded: (args) => {
                if (this.devName !== args.deviceName)
                    return;
                Logger.info("VioManager", "Board was connected");
                Logger.info("VioManager", "JTAG Interface is not available");
            },
        
            jtagRemoved: (args) => {
                if (this.devName !== args.deviceName)
                    return;
                this.stopRequestInputState();
                this.devInfo = undefined;
                this.portSizes = undefined;
                Logger.info("VioManager", "JTAG Interface is not available");
            },
        
            jtagAdded: async (args) => {
                if (this.devName !== args.deviceName)
                    return;
                await sleep(500);
                await this.connectToDevice(this.devName);
                this.requestOutputState();
                this.startRequestInputState();
                Logger.info("VioManager", "JTAG Interface detected");
            },

            serialOpen: (args) => {
                if (this.serialPath !== args.path) 
                    return;
                Logger.info("Serial", `Serial Port ${args.path} opened!`);
            },

            serialError: (args) => {
                if (this.serialPath !== args.path)
                    return;
                Logger.error("Serial", `${args.error}`);
            },

            serialClose: (args) => {
                if (this.serialPath !== args.path) 
                    return;
                Logger.info("Serial", `Serial Port ${args.path} closed!`);
            },

            serialData: (args) => {
                if (this.serialPath !== args.path) 
                    return;
                Logger.print(String.fromCharCode(... args.data));
            },
        };
        
        this.connection = VioGuiFrontend(processor);

    }

    
    public static getDevices() {
        return this.connection.getDeviceInfos({});
    }

    public static async connectToDevice(deviceName: string) {
        this.devName = deviceName;

        // this.connection.startCamera({deviceName});
        const steamUrl = await this.connection.getStreamUrl({deviceName});
        LayoutManager.cameraComponent().connectTo(steamUrl)

        const devInfo = await this.connection.getDeviceInfo({deviceName});

        if (devInfo.error) {
            Logger.warn("VioManager", "Failed to connect to device.", devInfo.message);
            return;
        }

        if (!devInfo.active) {
            Logger.warn("VioManager", "Device is not connected");
            return;
        }

        if (devInfo.jtagDevices.length === 0) {
            Logger.warn("VioManager", "JTAG Interface is not available");
            return;
        }

        this.devInfo = devInfo;

        this.portSizes = [];
        for (const jtagDevice of devInfo.jtagDevices) {
            if (jtagDevice === null)
                continue;
            const jtagIndex = jtagDevice.index;
            this.portSizes[jtagIndex] = [];
            for (const xsdbSlave of jtagDevice.xsdbSlaves) {
                const xsdbIndex = xsdbSlave.index;

                const portSize = await this.connection.getPortSizes({deviceName, jtagIndex, xsdbIndex});

                if (portSize.error) {
                    this.devInfo = undefined;
                    this.portSizes = undefined;
                    Logger.warn("VioManager", "Could not retrieve port sizes");
                    return;
                }

                this.portSizes[jtagIndex][xsdbIndex] = portSize;
            }
        }
    }

    // tslint:disable-next-line: variable-name
    private static _requestInputState_intervalId = -1;
    public static startRequestInputState(interval: number = 100) {
        if (this._requestInputState_intervalId !== -1)
            this.stopRequestInputState();
            this._requestInputState_intervalId = window.setInterval(() => this.requestInputState(), interval);
    }
    public static stopRequestInputState() {
        if (this._requestInputState_intervalId === -1)
            return;
        clearInterval(this._requestInputState_intervalId);
        this._requestInputState_intervalId = -1;
    }

    public static async requestOutputState(): Promise<void> {
        if (this.devInfo === undefined) return;
        if (this.portSizes === undefined) return;

        const deviceName = this.devName;

        for (const jtagDevice of this.devInfo.jtagDevices) {
            if (jtagDevice === null)
                continue;
            const jtagIndex = jtagDevice.index;
            for (const xsdbSlave of jtagDevice.xsdbSlaves) {
                const xsdbIndex = xsdbSlave.index;
                const numOutputPorts = this.portSizes[jtagIndex][xsdbIndex].outputs.length;

                for (let i = 0; i < numOutputPorts; i++) {
                    const portIndex = i;
                    const state = await this.connection.readOutputState({deviceName, jtagIndex, xsdbIndex, portIndex});
                    if (state.error) 
                        continue;
                    this.stateChangedCallback({type: 'OUTPUT', jtagIndex, xsdbIndex, portIndex}, state as number[]);
                }

            }
        }
    }

    public static async requestInputState() {
        if (this.devInfo === undefined) return;
        if (this.portSizes === undefined) return;

        const deviceName = this.devName;

        for (const jtagDevice of this.devInfo.jtagDevices) {
            if (jtagDevice === null)
                continue;
            const jtagIndex = jtagDevice.index;
            for (const xsdbSlave of jtagDevice.xsdbSlaves) {
                const xsdbIndex = xsdbSlave.index;
                const inputs = this.portSizes[jtagIndex][xsdbIndex].inputs;
                const numInputPorts = inputs.length;

                if (numInputPorts === 0 || (numInputPorts === 2 && inputs[0] === 80 && inputs[1] === 8))
                    continue;

                const state = await this.connection.readInputState({deviceName, jtagIndex, xsdbIndex});
                if (state.error) 
                    continue;

                for (let i = 0; i < state.length; i++) {
                    const portIndex = i;
                    this.stateChangedCallback({type: 'INPUT', jtagIndex, xsdbIndex, portIndex}, state[i] as number[]);
                }
            }
        }
    }

    public static stateChangedCallback(port: VioPortDef, value: number[]) {
        for (const vioPort of this.vioPortNotifyList.values())
            vioPort.onStateChanged(port, value);
    }

    public static async writeOutputValue(port: VioPortDef, value: number[]) {
        if (this.devInfo === undefined || this.portSizes === undefined) {
            Logger.warn("VioManager", `JTAG Interface not available. Could not set the state of port ${port.jtagIndex}:${port.xsdbIndex}:${port.portIndex} to ${value}.`)
            return;
        }

        const deviceName = this.devName;
        const jtagIndex = port.jtagIndex;
        const xsdbIndex = port.xsdbIndex;
        const portIndex = port.portIndex;

        const numBits = this.portSizes?.[port.jtagIndex][port.xsdbIndex].outputs[port.portIndex];
        const numBytes = this.portSizes?.[port.jtagIndex][port.xsdbIndex].outputBytes[port.portIndex];
        
        for (let i = 0; i < value.length; i++) {
            value[i] = ((value[i] ?? 0) & 0xFF) >>> 0;
        }
    
        if (value.length !== numBytes)
            Logger.warn("VioManager", `The given value ${value} was greater than the size [${numBits}] of the port ${port.jtagIndex}:${port.xsdbIndex}:${port.portIndex}. The value will be truncated.`)
        const values = value.slice(0, numBits);
        const result = await this.connection.writeOutputState({deviceName, jtagIndex, xsdbIndex, portIndex, values});
        if (result.error) return;
        this.stateChangedCallback(port, values);
    }

    public static async xsdbIndexFromIdentifier(jtagIndex: number, vioIdentifier: string, vioIndex: number) {
        if (this.devInfo === undefined || this.portSizes === undefined) {
            Logger.warn("VioManager", `JTAG Interface not available. Could not fetch port definition of ${vioIdentifier}[${vioIndex}].`)
            return -1;
        }

        const deviceName = this.devName;

        const slaveIndex = await this.connection.getXsdbSlaveIndex({ deviceName, jtagIndex, vioIdentifier, vioIndex})
        if (slaveIndex.error) {
            Logger.warn("VioManager", `JTAG Interface not available. Could not fetch port definition of ${vioIdentifier}[${vioIndex}].\nMessage: ${slaveIndex.message}`)
            return -1;
        }
        if (slaveIndex === -1) {
            Logger.warn("VioManager", `Could not find VIO with port definition of ${vioIdentifier}[${vioIndex}].`)
            return -1;
        }

        return slaveIndex as number;
    }

    public static registerNotify(vioPort: VioPort): void {
        this.vioPortNotifyList.set(vioPort.id, vioPort);
    }

    public static unregisterNotify(vioPort: VioPort): void {
        this.vioPortNotifyList.delete(vioPort.id);
    }

    public static unregisterAll() {
        for (const vioPort of this.vioPortNotifyList.values())
            vioPort.unregisterNotify();
    }
}
