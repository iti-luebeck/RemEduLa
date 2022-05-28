// Use ffmpeg to feed input streams:
//   ffmpeg -i <some input> -f mpegts http://{HOST}:{PORT}/{SECRET}/{streamId}
// stream will be available at
//   ws://{HOST}:{PORT}/{SECRET}/{streamId}

import * as WebSocket from 'ws';
import * as http from 'http';

let wsServer: WebSocket.Server;
let streamServer: http.Server;
let streams: string[] = [];

export function start(streamSecret: string, streamPort: number) {
    // the stream server is an http server that receives streaming data over http (MGEP-TS)
    streamServer = http.createServer((request, response) => {
        const remoteId = `${request.socket.remoteAddress}:${request.socket.remotePort}`;
        const params = request.url?.substring(1).split('/') ?? [];
        if (params[0] === "status") {
            // return the list of all registered stream IDs
            response.end(streams.join("\n"));
        } else if (params[0] === "stream") {
            // don't respond, conncetion will be upgraded to ws
        } else if (params[0] === streamSecret) {
            // register a new stream
            const streamId = params[1];
            streams.push(streamId);
            console.log(`[INFO] Stream Connected: ${remoteId} -> ${streamId}`);

            // don't timeout the connection
            response.connection?.setTimeout(0);

            // broadcast the recieved data to connected clients
            request.on('data', data => {
                for (const client of wsServer.clients) {
                    if ((client as any).selectedStream === streamId) {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(data, { binary: true })
                        }
                    }
                }
            });

            // unregister stream if the connection was closed
            request.on('close', () => {
                streams = streams.filter(id => id !== streamId);
            });
        } else {
            // unknown command
            response.writeHead(404);
            response.end("<h2>Unknown command!</h2>");
        }
    });

    // create a ws server without creating an underling http server
    wsServer = new WebSocket.Server({ noServer: true })
    // the other http server will provide the connections
    wsServer.on("connection", (socket, request) => {
        // register the client and save the stream ID it selected
        const params = request.url?.substr(1).split('/') ?? [""];
        (socket as any).selectedStream = params[1];
        // when the connection is closed, clean up
        socket.on("close", () => {
            (socket as any).selectedStream = "";
        });
    });
    // when a client connects to the server over ws it requests an upgrade
    streamServer.on('upgrade', (request, socket, head) => {
        const params = request.url?.substring(1).split('/') ?? []
        if (params[0] === 'stream') {
            // handle the upgrade and forward the connection to the ws server
            wsServer.handleUpgrade(request, socket as any, head, ws => {
                wsServer.emit('connection', ws, request);
            });
        } else {
            // otherwise close the connection
            socket.destroy();
        }
    });
    
    // Keep the socket open for streaming
    streamServer.headersTimeout = 0;
    // Start the server
    streamServer.listen(streamPort);
}

export function stop() {
    streamServer.close();
    wsServer.close();
}
