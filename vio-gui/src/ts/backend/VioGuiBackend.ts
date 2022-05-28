import {Server as HTTPServer} from 'http';
import * as WebSocket from 'ws';

class Backend<Commands, Events> {
    private commandProcessor: Commands;
    private wss: WebSocket.Server;
    
    constructor(server: HTTPServer, commandProcessor: Commands) {
        this.commandProcessor = commandProcessor;
        
        this.wss = new WebSocket.Server({ server, path: "/ws" });
        this.wss.on('connection', socket => {
            socket.on('message', message => {
                this.handleMessage(socket, message as string)
            })
        });
    }
    
    private async handleMessage(socket: WebSocket, message: string) {
        const sendError = (token, message) => socket.send(JSON.stringify({action: "response", token, data: {error: true, message}}))
        try {
            const request = JSON.parse(message);
            const token = request.token ?? "";

            if (!("action" in request)) {
                sendError(token, "No action defined!");
                return;
            }
            if (!(request.action !in this.commandProcessor)) {
                sendError(token, "Unknown action!");
                return;
            }
            const data = await this.commandProcessor[request.action](request as any);
            socket.send(JSON.stringify({action: "response", token, data}));
                
        } catch (e) {
            sendError(-1, "Could not parse request! " + e);
            return;
        }
    }

    sendEvent(event: keyof Events, args: any) {
        for (const ws of this.wss.clients) {
            ws.send(JSON.stringify({action: "event", event, args}));
        }
    }
}



import VioGuiCommands from "../core/VioGuiCommands";
import VioGuiEvents from "../core/VioGuiEvents";

export default function VioGuiBackend(http: HTTPServer, commandProcessor: VioGuiCommands): VioGuiEvents {
    const backend = new Backend<VioGuiCommands, VioGuiEvents>(http, commandProcessor);
    
    return {
        deviceRemoved: args => backend.sendEvent("deviceRemoved", args),
        deviceAdded:   args => backend.sendEvent("deviceAdded", args),
        jtagRemoved:   args => backend.sendEvent("jtagRemoved", args),
        jtagAdded:     args => backend.sendEvent("jtagAdded", args),
    
        serialOpen:    args => backend.sendEvent("serialOpen", args),
        serialError:   args => backend.sendEvent("serialError", args),
        serialClose:   args => backend.sendEvent("serialClose", args),
        serialData:    args => backend.sendEvent("serialData", args),
    }
}
