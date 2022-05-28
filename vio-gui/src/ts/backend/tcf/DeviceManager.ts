import { EventEmitter } from "events";
import { TcfServices } from "./TcfServices";
import TcfSocket from "./TcfSocket";
import Device from "./Device";
import Logger from "../../core/Logger";
import { bufferToPrintableString, tcfParseJson } from "./helper";
import PromiseHelper from "../../core/helper/PromiseHelper";

declare interface DeviceManager {
    // tslint:disable: unified-signatures
    emit(event: string, ...args: any[]): boolean;
    emit(event: "connected"): boolean;
    emit(event: "disconnected"): boolean;
    emit(event: "deviceAdded", socket: TcfSocket, device: Device): boolean;
    emit(event: "deviceRemoved", socket: TcfSocket, device: Device): boolean;
    emit(event: "jtagAdded", socket: TcfSocket, device: Device): boolean;
    emit(event: "jtagRemoved", socket: TcfSocket, device: Device): boolean;

    on(event: string, listener: (...args: any[]) => void): this;
    on(event: "connected", listener: () => void): this;
    on(event: "disconnected", listener: () => void): this;
    on(event: "deviceAdded", listener: (socket: TcfSocket, device: Device) => void): this;
    on(event: "deviceRemoved", listener: (socket: TcfSocket, device: Device) => void): this;
    on(event: "jtagAdded", listener: (socket: TcfSocket, device: Device) => void): this;
    on(event: "jtagRemoved", listener: (socket: TcfSocket, device: Device) => void): this;
    // tslint:enable: unified-signatures
}

class DeviceManager extends EventEmitter {
    private _socket: TcfSocket;

    private _devices: Device[] = [];
    private _devicesMap: Map<string, Device> = new Map();

    private _readyPromise: PromiseHelper<void> = new PromiseHelper();

    constructor(host: string, port: number, index: number) {
        super();
        this._socket = new TcfSocket(host, port, index);
        this._socket.on("connected", () => this.connected());
        this._socket.on("disconnected", () => this.disconnected());

        this._socket.addTcfEventListener("JtagCable", "contextRemoved", data => {
            Logger.trace("DeviceManager", "JtagCable", "contextRemoved", bufferToPrintableString(data));
            const deviceName = tcfParseJson(data)?.[0] ?? "";
            if (deviceName === "") return;
            const device = this._devicesMap.get(deviceName);
            if (device === undefined) return;
            device.deviceRemoved();
            this.emit("deviceRemoved", this, device)
        });
        this._socket.addTcfEventListener("JtagCable", "contextAdded", data => {
            Logger.trace("DeviceManager", "JtagCable", "contextAdded", bufferToPrintableString(data));
            const deviceName = tcfParseJson(data)?.[0]?.ID ?? "";
            if (deviceName === "") return;
            this.addDevice(deviceName);
            const device = this._devicesMap.get(deviceName);
            if (device === undefined) return;
            device.deviceAdded();
            this.emit("deviceAdded", this, device)
        });
        this._socket.addTcfEventListener("Jtag", "contextRemoved", data => {
            Logger.trace("DeviceManager", "Jtag", "contextRemoved", bufferToPrintableString(data));
            const deviceName = ((tcfParseJson(data)?.[0] ?? "") as string).split("-").slice(0, 3).join("-");
            if (deviceName === "") return;
            const device = this._devicesMap.get(deviceName);
            if (device === undefined) return;
            device.jtagRemoved();
            this.emit("jtagRemoved", this, device)
        });
        this._socket.addTcfEventListener("Jtag", "contextAdded", data => {
            const parsedData = tcfParseJson(data)?.[0];
            if (parsedData?.Name !== "bscan-switch") return;
            Logger.trace("DeviceManager", "Jtag", "contextAdded", bufferToPrintableString(data));
            const deviceName = ((parsedData?.ID ?? "") as string).split("-").slice(0, 3).join("-");
            if (deviceName === "") return;
            const device = this._devicesMap.get(deviceName);
            if (device === undefined) return;
            device.jtagAdded();
            this.emit("jtagAdded", this, device)
        });
    }

    private async connected() {
        const deviceNames = await TcfServices.Jtag.getChildren(this._socket);
        for (const deviceName of deviceNames) {
            await this.addDevice(deviceName);
        }
        this._readyPromise.resolve();
        this.emit("connected");
    }

    private async addDevice(deviceName: string) {
        if (!this._devicesMap.has(deviceName)) {
            const device = new Device(this._socket, deviceName);

            await device.init();

            this._devices.push(device);
            this._devicesMap.set(deviceName, device);
        }
    }

    private disconnected() {
        this.emit("disconnected");
        this._socket.removeAllTcfEventListeners();
        this._devices = [];
        this._devicesMap = new Map();
    }

    public get ready(): Promise<void> { return this._readyPromise.promise; }

    public get socket(): TcfSocket { return this._socket; }

    public get devices(): readonly Device[] { return this._devices; }

    public get devicesMap(): ReadonlyMap<string, Device> { return this._devicesMap; }
}

export default DeviceManager;
