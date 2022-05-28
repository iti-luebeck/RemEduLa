
import { SerialPortInfo } from '../backend/serial';
import { DeviceInfo, PortSize } from '../backend/tcf';

export type ErrorablePromise<T> = Promise<
    (T & {error?: false | null | undefined}) |
    {error: true, message: string, default?: any}
>

export default interface VioGuiCommands {

    getDeviceInfos(args: {}): Promise<DeviceInfo[]>;

    getDeviceInfo(args: {deviceName: string}): ErrorablePromise<DeviceInfo>;

    getXsdbSlaveIndex(args: {deviceName: string, jtagIndex: number, vioIdentifier: string, vioIndex: number}): ErrorablePromise<number>;

    getPortSizes(args: {deviceName: string, jtagIndex: number, xsdbIndex: number}): ErrorablePromise<PortSize>;

    readInputState(args: {deviceName: string, jtagIndex: number, xsdbIndex: number}): ErrorablePromise<number[][]>;

    writeOutputState(args: {deviceName: string, jtagIndex: number, xsdbIndex: number, portIndex: number, values: number[]}): ErrorablePromise<boolean>;

    readOutputState(args: {deviceName: string, jtagIndex: number, xsdbIndex: number, portIndex: number}): ErrorablePromise<number[]>;


    getStreamUrl(args: {deviceName: string}): Promise<string>;

    getHwServerAddr(args: {}): Promise<string>;


    serialGetPortInfos(args: {}): Promise<SerialPortInfo[]>;

    serialOpen(args: {path: string}): Promise<boolean>;

    serialClose(args: {path: string}): Promise<boolean>;

    serialSend(args: {path: string, data: number[]}): Promise<boolean>;

    serialSetBreak(args: {path: string}): Promise<boolean>;
};
