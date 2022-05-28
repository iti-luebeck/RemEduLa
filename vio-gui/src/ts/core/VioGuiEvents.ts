

export default interface VioGuiEvents {
    deviceRemoved(args: {deviceName: string}): void;

    deviceAdded(args: {deviceName: string}): void;

    jtagRemoved(args: {deviceName: string}): void;

    jtagAdded(args: {deviceName: string}): void;


    serialOpen(args: {path: string}): void;

    serialError(args: {path: string, error: string}): void;

    serialClose(args: {path: string}): void;

    serialData(args: {path: string, data: number[]}): void;
};
