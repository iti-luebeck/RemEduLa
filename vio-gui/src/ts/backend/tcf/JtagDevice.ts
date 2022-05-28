import { TcfServices } from "./TcfServices";
import TcfSocket from "./TcfSocket";
import XsdbVioSlave from "./XsdbVioSlave";

export default class JtagDevice {
    private _socket: TcfSocket;
    private _jtagId: string;

    private _xsdbSlaves: XsdbVioSlave[] = [];
    private _xsdbSlavesMap: Map<string, XsdbVioSlave> = new Map();

    constructor(socket: TcfSocket, jtagId: string) {
        this._socket = socket;
        this._jtagId = jtagId;
    }

    async init() {
        const xsdbIds = await TcfServices.Xsdb.getChildren(this._socket, this._jtagId);

        this._xsdbSlaves = [];
        this._xsdbSlavesMap = new Map();

        for (const xsdbId of xsdbIds) {
            const xsdbSlave = new XsdbVioSlave(this._socket, xsdbId);
            await xsdbSlave.init();

            if (xsdbSlave.available) {
                this._xsdbSlaves.push(xsdbSlave);
                this._xsdbSlavesMap.set(xsdbId, xsdbSlave);
            }
        }

        this._xsdbSlaves.sort((a, b) => a.slaveIndex - b.slaveIndex);
    }

    public get socket(): TcfSocket { return this._socket; }

    public get jtagId(): string { return this._jtagId; }

    public get xsdbSlaves(): readonly XsdbVioSlave[] { return this._xsdbSlaves; }

    public get xsdbSlavesMap(): ReadonlyMap<string, XsdbVioSlave> { return this._xsdbSlavesMap; }

}
