import "dotenv/config";

import * as Serial from "./serial";
import * as TCF from "./tcf";

import Logger, { LogLevel } from '../core/Logger';

import createStaticServer from './createStaticServer';
import VioGuiCommandProcessor from './VioGuiCommandsProcessor';
import VioGuiBackend from './VioGuiBackend';

Logger.setLogLevel(LogLevel.WARN);

const http = createStaticServer();
const processor = VioGuiCommandProcessor();
const backend = VioGuiBackend(http, processor);
http.listen(parseInt(process.env.VIOGUI_HTTP_PORT ?? "80"));

TCF.setCallbacks({
    deviceAdded:   (deviceName) => backend.deviceAdded({deviceName}),
    deviceRemoved: (deviceName) => backend.deviceRemoved({deviceName}),
    jtagAdded:     (deviceName) => backend.jtagAdded({deviceName}),
    jtagRemoved:   (deviceName) => backend.jtagRemoved({deviceName})
});

Serial.setCallbacks({
    open:  (path)         => backend.serialOpen({path}),
    error: (path, error?) => backend.serialError({path, error}),
    close: (path)         => backend.serialClose({path}),
    data:  (path, data)   => backend.serialData({path, data}),
});
