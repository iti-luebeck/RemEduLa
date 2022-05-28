import { TcfServices } from "./TcfServices";
import TcfSocket from "./TcfSocket";
import JtagDevice from "./JtagDevice";

export default class Device {
    private _socket: TcfSocket;
    private _name: string;

    private _active: boolean = false;
    private _jtagDevices: JtagDevice[] = [];
    private _jtagDevicesMap: Map<string, JtagDevice> = new Map();

    constructor(socket: TcfSocket, name: string) {
        this._socket = socket;
        this._name = name;
    }

    async init() {
        await this.refreshDeviceState();
    }

    public async deviceAdded() {
        await this.refreshDeviceState();
    }

    public async deviceRemoved() {
        await this.refreshDeviceState();
    }

    public async jtagAdded() {
        await this.refreshDeviceState();
    }

    public async jtagRemoved() {
        await this.refreshDeviceState();
    }

    private async refreshDeviceState() {
        const isActive = (await TcfServices.Jtag.getContext(this._socket, this._name))?.isActive ?? false;
        
        this._active = isActive;
        this._jtagDevices = [];
        this._jtagDevicesMap = new Map();
        
        if (!isActive) {
            return;
        }
        
        const jtagIds  = (await TcfServices.Jtag.getChildren(this._socket, this._name));
        for (let i = 0; i < jtagIds.length; i++) {
            const jtagId = jtagIds[i];

            const jtagDevice = new JtagDevice(this._socket, jtagId);
            await jtagDevice.init();

            if (jtagDevice.xsdbSlaves.length > 0) {
                this._jtagDevices[i] = jtagDevice;
                this._jtagDevicesMap.set(jtagId, jtagDevice);
            }
        }
    }

    public get socket(): TcfSocket { return this._socket; }

    public get name(): string { return this._name; }

    public get active(): boolean { return this._active; }

    public get jtagDevices(): readonly JtagDevice[] { return this._jtagDevices; }

    public get jtagDevicesMap(): ReadonlyMap<string, JtagDevice> { return this._jtagDevicesMap; }
}
