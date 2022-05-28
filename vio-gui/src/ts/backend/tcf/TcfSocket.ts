import { Socket } from "net";
import { bufferToPrintableString, tcfFindEndOfMessage, findNull, findEndOfJson, tcfParseJson, tcfEncodeLength, tcfDecodeLength, tcfDecodeByteArray } from "./helper";
import RequestQueue from "../../core/helper/RequestQueue";
import Logger from "../../core/Logger";
import { EventEmitter } from "events";
import { TcfServices } from "./TcfServices";
import TcfDataStream from "./TcfDataStream";

type PromiseElement = {error: boolean, data: Buffer};

declare interface TcfSocket {
    // tslint:disable: unified-signatures
    emit(event: string, ...args: any[]): boolean;
    emit(event: "connected"): boolean;
    emit(event: "disconnected"): boolean;

    on(event: string, listener: (...args: any[]) => void): this;
    on(event: "connected", listener: () => void): this;
    on(event: "disconnected", listener: () => void): this;
    // tslint:enable: unified-signatures
}

class TcfSocket extends EventEmitter {
    private socket: Socket;
    private queue: RequestQueue<PromiseElement>;
    private eventListener: Map<string, {id: number, callback: (data: Buffer) => void}[]>
    private eventListenerId: number = 0;

    private _index: number;
    private _connected: boolean = false;

    public constructor(host: string, port: number, index: number) {
        super();

        this._index = index;

        this.queue = new RequestQueue();
        this.eventListener = new Map();

        this.socket = new Socket();
        this.socket.connect(port, host);
        this.socket.on('connect', () => {
            Logger.info(`TcfSocket[${this._index}]`, `Connected at ${host}:${port}`);
            TcfServices.Locator.Hello(this);
            this._connected = true;
            this.emit("connected");
        });
        this.socket.on('error', err => {
            this._connected = false;
            Logger.info(`TcfSocket[${this._index}]`, `Connection closed at ${host}:${port} with the error:\n\t${err.message}`);
        });
        this.socket.on('close', () => {
            if (this._connected) {
                this.emit("disconnected");
            }
            this._connected = false;
            Logger.info(`TcfSocket[${this._index}]`, `Connection closed at ${host}:${port}`);
            setTimeout(() => {
                Logger.info(`TcfSocket[${this._index}]`, `Trying to reconnect to ${host}:${port}...`);
                this.socket.connect(port, host);
            }, 5000);
        });

        this.setupDataStream();
    }

    public get connected(): boolean { return this._connected; }

    public get index(): number { return this._index; }

    public addTcfEventListener(service: string, event: string, listener: (data: Buffer) => void): number {
        if (!this.eventListener.has(service + " " + event)) {
            this.eventListener.set(service + " " + event, []);
        }
        const id = this.eventListenerId++;
        this.eventListener.get(service + " " + event)?.push({id, callback: listener});
        return id;
    }

    public removeTcfEventListener(listenerId: number): boolean {
        for (const value of this.eventListener.values()) {
            for (let i = 0; i < value.length; i++) {
                if (value[i].id === listenerId) {
                    value.splice(i, 1);
                    return true;
                }
            }
        }
        return false;
    }

    public removeAllTcfEventListeners() {
        this.eventListener.clear();
    }



    public sendEvent(service: string, command: string, args: string): void {
        args = `\x00${args}${args === "" ? "" : "\0"}`;
        const length = tcfEncodeLength(args.length);
        const event = `E\x00${service}\x00${command}${length}${args}\x03\x01`;
        this.sendToSocket(event);
    }

    public sendCommand(service: string, command: string, args: string): Promise<PromiseElement> {
        const token = this.queue.generateToken(i => `${i%1000}`);
        args = `\x00${args}${args === "" ? "" : "\0"}`;
        const length = tcfEncodeLength(args.length);
        const com = `C\x00X${token}\x00${service}\x00${command}${length}${args}\x03\x01`;
        this.sendToSocket(com);
        return this.queue.create(`X${token}`);
    }

    private sendToSocket(message: string) {
        Logger.trace(`TcfSocket[${this._index}]`, "--> " + bufferToPrintableString(Buffer.from(message)));
        this.socket.write(message, "binary");
    }


    private dataStream: TcfDataStream;
    
    private setupDataStream() {
        this.dataStream = new TcfDataStream(this._index);

        this.socket.on('data', data => this.dataStream.appendData(data));

        this.dataStream.on("event", (service, event, data) => this.emitEvent(service, event, data));
        this.dataStream.on("response", (token, data, error) => this.emitResponse(token, data, error));
        this.dataStream.on("progress", (token, data) => this.emitProgress(token, data));
        this.dataStream.on("flow", level => this.emitFlowControl(level));
        this.dataStream.on("eos", data => Logger.trace(`TcfSocket[${this._index}]`, "--> EOS", bufferToPrintableString(data)));
    }

    private emitEvent(service: string, event: string, data: Buffer) {
        if (this.eventListener.has(service + " " + event)) {
            Logger.trace(`TcfSocket[${this._index}]`, "<-- E", service, event, bufferToPrintableString(data));
            for (const listener of this.eventListener.get(service + " " + event) ?? []) {
                try {
                    listener.callback(data);
                } catch (e) {
                    Logger.error(`TcfSocket[${this._index}]`, "Callback emitted an exception.", e);
                }
            }
        }
    }

    private emitResponse(token: string, data: Buffer, error: boolean) {
        if (error) {
            Logger.trace(`TcfSocket[${this._index}]`, "<-- N", token);
        } else {
            Logger.trace(`TcfSocket[${this._index}]`, "<-- R", token, bufferToPrintableString(data as Buffer));
            Logger.trace(`TcfSocket[${this._index}]`, " ^---", token, tcfDecodeLength(data as Buffer)) 
            // , bufferToPrintableString((data as Buffer).subarray(4, 4+tcfDecodeLength(data as Buffer))));
            if (tcfParseJson(data)?.Code === 1) {
                error = true;
            }
        }
        this.queue.resolve(token, {error, data: data.subarray(0, -2)});
    }

    private emitProgress(token: string, data: Buffer) {
        // trat bisher noch nicht mit vivado's hw_server auf 
        // daher keine implementierung
        Logger.warn(`TcfSocket[${this._index}]`, "<-- P", token, bufferToPrintableString(data));
    }

    private emitFlowControl(level: number) {
        // trat bisher noch nicht mit vivado's hw_server auf 
        // daher keine implementierung
        Logger.warn(`TcfSocket[${this._index}]`, "<-- F", level);
    }
}

export default TcfSocket;
