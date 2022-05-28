import DeviceManager from './DeviceManager';


export type DeviceInfo = {
    deviceName: string,
    jtagDevices: ({
        index: number,
        jtagId: string,
        xsdbSlaves: {
            index: number,
            xsdbId: string
        }[]
    } | null)[],
    active: boolean
}

export type PortSize = {
    inputs: number[],
    inputBytes: number[],
    outputs: number[],
    outputBytes: number[]
}

export type TcfCallbacks = {
    deviceAdded:   (deviceName: string) => void; 
    deviceRemoved: (deviceName: string) => void; 
    jtagAdded:     (deviceName: string) => void; 
    jtagRemoved:   (deviceName: string) => void; 
}

let dm: DeviceManager;
const callbacks: TcfCallbacks = {
    deviceAdded:   () => (void 0),
    deviceRemoved: () => (void 0),
    jtagAdded:     () => (void 0),
    jtagRemoved:   () => (void 0),
};

/* init */
(() => {
    dm = new DeviceManager(
        process.env.VIOGUI_HW_SERVER_HOST ?? "localhost", 
        parseInt(process.env.VIOGUI_HW_SERVER_PORT ?? "3121"), 
        0
    );
    dm.on("deviceAdded",   (_, device) => callbacks.deviceAdded(device.name));
    dm.on("deviceRemoved", (_, device) => callbacks.deviceRemoved(device.name));
    dm.on("jtagAdded",     (_, device) => callbacks.jtagAdded(device.name));
    dm.on("jtagRemoved",   (_, device) => callbacks.jtagRemoved(device.name));
})();

export function setCallbacks(cb: TcfCallbacks) {
    callbacks.deviceAdded   = cb.deviceAdded;
    callbacks.deviceRemoved = cb.deviceRemoved;
    callbacks.jtagAdded     = cb.jtagAdded;
    callbacks.jtagRemoved   = cb.jtagRemoved;
}

export async function isDeviceNameValid(deviceName: string): Promise<boolean> {
    await dm.ready;
    const device = dm?.devicesMap.get(deviceName);
    return (device !== undefined);
}

export async function isJtagIndexValid(deviceName: string, jtagIndex: number): Promise<boolean> {
    await dm.ready;
    const jtagDevice = dm?.devicesMap.get(deviceName)?.jtagDevices[jtagIndex];
    return (jtagDevice !== undefined);
}

export async function isXsdbIndexValid(deviceName: string, jtagIndex: number, xsdbIndex: number): Promise<boolean> {
    await dm.ready;
    const xsdbSlave = dm?.devicesMap.get(deviceName)?.jtagDevices[jtagIndex]?.xsdbSlaves[xsdbIndex];
    return (xsdbSlave !== undefined);
}

export async function getDeviceInfos(): Promise<DeviceInfo[]> {
    await dm.ready;
    return dm.devices.map(device => ({
        deviceName: device.name,
        active: device.active,
        jtagDevices: device.jtagDevices.map((jtagDevice, index) => ({
            index,
            jtagId: jtagDevice.jtagId,
            xsdbSlaves: jtagDevice.xsdbSlaves.map(xsdbSlave => ({
                index: xsdbSlave.slaveIndex,
                xsdbId: xsdbSlave.xsdbId
            }))
        }))
    }));
}

export async function getDeviceInfo(deviceName: string): Promise<DeviceInfo> {
    await dm.ready;
    const device = dm.devicesMap.get(deviceName)!;
    return {
        deviceName: device.name,
        active: device.active,
        jtagDevices: device.jtagDevices.map((jtagDevice, index) => ({
            index,
            jtagId: jtagDevice.jtagId,
            xsdbSlaves: jtagDevice.xsdbSlaves.map(xsdbSlave => ({
                index: xsdbSlave.slaveIndex,
                xsdbId: xsdbSlave.xsdbId
            }))
        }))
    };
}

export async function getXsdbSlaveIndex(deviceName: string, jtagIndex: number, vioIdentifier: string, vioIndex: number): Promise<number> {
    await dm.ready;
    const jtagDevice = dm.devicesMap.get(deviceName)?.jtagDevices[jtagIndex]!;
    for (const xsdbSlave of jtagDevice.xsdbSlaves) {
        if (!xsdbSlave.available)
            continue;
        const probeWidths = xsdbSlave.getProbeWidths();
        if (probeWidths.inputs[0] === 80 && probeWidths.inputs[1] === 8) {
            const state = await xsdbSlave.readProbeInState();
            const id  = String.fromCharCode(...(state[0] ?? []).reverse()).replace(/\0/gi, "");
            const idx = state[1]?.[0] ?? -1;
            if (vioIdentifier === id && vioIndex === idx) {
                return xsdbSlave.slaveIndex;
            }
        }
    }
    return -1;
}

export async function getPortSizes(deviceName: string, jtagIndex: number, xsdbIndex: number): Promise<PortSize> {
    await dm.ready;
    const xsdbSlave = dm.devicesMap.get(deviceName)?.jtagDevices[jtagIndex]?.xsdbSlaves[xsdbIndex]!;
    return xsdbSlave.getProbeWidths();
}

export async function readInputState(deviceName: string, jtagIndex: number, xsdbIndex: number): Promise<number[][]> {
    await dm.ready;
    const xsdbSlave = dm.devicesMap.get(deviceName)?.jtagDevices[jtagIndex]?.xsdbSlaves[xsdbIndex]!;
    return xsdbSlave.readProbeInState();
}

export async function writeOutputState(deviceName: string, jtagIndex: number, xsdbIndex: number, portIndex: number, values: number[]): Promise<void> {
    await dm.ready;
    const xsdbSlave = dm.devicesMap.get(deviceName)?.jtagDevices[jtagIndex]?.xsdbSlaves[xsdbIndex]!;
    await xsdbSlave.writeOutputState(portIndex, values);
}

export async function readOutputState(deviceName: string, jtagIndex: number, xsdbIndex: number, portIndex: number): Promise<number[]> {
    await dm.ready;
    const xsdbSlave = dm.devicesMap.get(deviceName)?.jtagDevices[jtagIndex]?.xsdbSlaves[xsdbIndex]!; 
    return await xsdbSlave.readProbeOutState(portIndex);
}
