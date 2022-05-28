import { EventEmitter } from "events";
import RequestQueue from "../core/helper/RequestQueue";

class Frontend<Commands, Events> extends EventEmitter {
    private ws: WebSocket;
    private requestQueue: RequestQueue<any>;
    private eventProcessor?: Events;

    constructor(eventProcessor?: Events) {
        super();
        this.eventProcessor = eventProcessor;

        this.on("open",  function () { console.log("open", arguments) });
        this.on("error", function () { console.log("error", arguments) });
        this.on("close", function () { console.log("close", arguments) });
        this.on("event", function () { console.log("event", arguments) });

        this.requestQueue = new RequestQueue();
    }

    start() {
        this.ws = new WebSocket(`ws://${window.location.host}/ws`)
        this.ws.onopen = () => this.emit("open");
        this.ws.onerror = a => this.emit("error", a);
        this.ws.onclose = a => this.emit("close", a);
        this.ws.onmessage = event => this.onReceive(event);
    }

    sendRequest(request: keyof Commands, args: any) {
        const token = this.requestQueue.generateToken();
        this.ws.send(JSON.stringify({token, action: request, ...args}));
        return this.requestQueue.create(token);
    }

    private onReceive(event: MessageEvent) {
        const obj = JSON.parse(event.data as string) as 
            { action: "response", token: string, data: any } | 
            { action: "event", event: keyof Events, args: any };

        if (obj.action === "response") {
            this.requestQueue.resolve(obj.token, obj.data);
        } else if (obj.action === "event") {
            this.emit("event", obj.event, obj.args);
            (this.eventProcessor?.[obj.event] as any)(obj.args);
        }
    }
}



import VioGuiCommands from "../core/VioGuiCommands";
import VioGuiEvents from "../core/VioGuiEvents";

export interface VioGuiFrontendType extends VioGuiCommands {
    // tslint:disable: unified-signatures
    emit(event: string, ...args: any[]): boolean;
    emit(event: "open"): boolean;
    emit(event: "error", reason: string): boolean;
    emit(event: "close", reason: string): boolean;
    emit(event: "event", type: string, args: any): boolean;

    on(event: string, listener: (...args: any[]) => void): this;
    on(event: "open", listener: () => void): this;
    on(event: "error", listener: (reason: string) => void): this;
    on(event: "close", listener: (reason: string) => void): this;
    on(event: "event", listener: (type: string, args: any) => void): this;

    start(): void;
    // tslint:enable: unified-signatures
}

export default function VioGuiFrontend(eventProcessor?: VioGuiEvents): VioGuiFrontendType {
    const frontend = new Frontend<VioGuiCommands, VioGuiEvents>(eventProcessor);
    return {
        emit:               frontend.emit.bind(frontend) as any,
        on:                 frontend.on.bind(frontend) as any,
        start:              frontend.start.bind(frontend) as any,

        getDeviceInfos:     (args) => frontend.sendRequest("getDeviceInfos", args),
        getDeviceInfo:      (args) => frontend.sendRequest("getDeviceInfo", args),
        getXsdbSlaveIndex:  (args) => frontend.sendRequest("getXsdbSlaveIndex", args),
        getPortSizes:       (args) => frontend.sendRequest("getPortSizes", args),
        readInputState:     (args) => frontend.sendRequest("readInputState", args),
        writeOutputState:   (args) => frontend.sendRequest("writeOutputState", args),
        readOutputState:    (args) => frontend.sendRequest("readOutputState", args),
        
        getStreamUrl:       (args) => frontend.sendRequest("getStreamUrl", args),
        getHwServerAddr:    (args) => frontend.sendRequest("getHwServerAddr", args),

        serialGetPortInfos: (args) => frontend.sendRequest("serialGetPortInfos", args),        
        serialOpen:         (args) => frontend.sendRequest("serialOpen", args),        
        serialClose:        (args) => frontend.sendRequest("serialClose", args),        
        serialSend:         (args) => frontend.sendRequest("serialSend", args),        
        serialSetBreak:     (args) => frontend.sendRequest("serialSetBreak", args),    
    }
}
