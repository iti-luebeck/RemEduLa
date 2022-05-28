import { TcfServices } from "./TcfServices";
import TcfSocket from "./TcfSocket";
import Logger from "../../core/Logger";

export default class XsdbVioSlave {
    private _socket: TcfSocket;
    private _xsdbId: string;
    private _available: boolean;
    private _slaveIndex: number;

    private numProbeIn: number;
    private numProbeOut: number;
    private probeInWidth: number[];
    private probeOutWidth: number[];

    private activityEnabled: boolean;

    constructor(socket: TcfSocket, xsdbId: string) {
        this._socket = socket;
        this._xsdbId = xsdbId;
    }

    async init() {
        const context = await TcfServices.Xsdb.getContext(this._socket, this._xsdbId);
        this._slaveIndex = context ? (context.slave_index ?? 0) : -1;

        this.numProbeIn = await TcfServices.XsdbVio.readNumProbeIn(this._socket, this._xsdbId);
        this.numProbeOut = await TcfServices.XsdbVio.readNumProbeOut(this._socket, this._xsdbId);

        // check if xsdb interface is available
        if (this.numProbeIn === -1) {
            this._available = false;
            return;
        } 

        this.probeInWidth = await TcfServices.XsdbVio.readProbeInWidth(this._socket, this._xsdbId, this.numProbeIn);
        this.probeOutWidth = await TcfServices.XsdbVio.readProbeOutWidth(this._socket, this._xsdbId, this.numProbeOut);

        this.activityEnabled = await TcfServices.XsdbVio.readActivityEnabled(this._socket, this._xsdbId);

        this._available = true;
    }

    public getProbeWidths() {
        return {
            inputs: this.probeInWidth,
            inputBytes: this.probeInWidth.map(i => Math.ceil(i/8)),
            outputs: this.probeOutWidth,
            outputBytes: this.probeOutWidth.map(i => Math.ceil(i/8))
        }
    }

    public async readProbeInState(): Promise<number[][]> {
        await TcfServices.XsdbVio.setControlHoldProbeIn(this._socket, this._xsdbId);
        const result = await TcfServices.XsdbVio.readProbeIn(this._socket, this._xsdbId, this.probeInWidth, this.activityEnabled);
        await TcfServices.XsdbVio.clearControl(this._socket, this._xsdbId);
        return result;
    }

    public async readProbeOutState(probeIndex: number): Promise<number[]> {
        if (probeIndex >= this.numProbeOut) {
            Logger.warn("XsdbVioSlave",
                "Probe Out Index out of range!\n" +
                "\tExpected: 0 <= index < " + this.numProbeOut + "  Got: " + probeIndex + " \n" +
                "The default value [] will be returned!"
            );
            return [];
        }
        return await TcfServices.XsdbVio.readProbeOut(this._socket, this._xsdbId, probeIndex, this.probeOutWidth[probeIndex]);
    }

    public async writeOutputState(probeIndex: number, values: number[]) {
        if (probeIndex >= this.numProbeOut) {
            Logger.warn("XsdbVioSlave",
                "Probe Out Index out of range!\n" +
                "\tExpected: 0 <= index < " + this.numProbeOut + "  Got: " + probeIndex
            );
            return;
        }
        await TcfServices.XsdbVio.writeProbeOut(this._socket, this._xsdbId, probeIndex, this.probeOutWidth[probeIndex], values);
        await TcfServices.XsdbVio.setControlCommit(this._socket, this._xsdbId);
        await TcfServices.XsdbVio.clearControl(this._socket, this._xsdbId);
    }

    public get socket(): TcfSocket { return this._socket; }

    public get xsdbId(): string { return this._xsdbId; }

    public get available(): boolean { return this._available; };

    public get slaveIndex(): number { return this._slaveIndex; };
}
