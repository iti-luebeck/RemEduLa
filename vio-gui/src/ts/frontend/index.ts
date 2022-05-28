import Logger, { LogLevel } from "../core/Logger";

import FileDropManager from "./FileDropManager";
import LayoutManager from "./LayoutManager/LayoutManager";
import KeyManager from "./KeyManager";
import VioManager from "./VioManager";

import insertDefaultLayout from "./BoardLayouts";
import { showConnectionErrorDialog, showConnectionClosedDialog, showConnectedDialog } from "./dialogBoxes";

window.onload = function () {
    main();
};

let connection;

/** @ignore */
async function main() {
    Logger.setLogLevel(LogLevel.DEBUG);
    Logger.setCallback((loglevel, tag, message?, ...optionalParams) => {
        const text = `[${tag}] ` + message + optionalParams.join(" ");
        switch (loglevel) {
            case LogLevel.TRACE:
            case LogLevel.DEBUG:
            case LogLevel.INFO:
                LayoutManager.consoleComponent().log(text);
                break;
            case LogLevel.WARN:
                LayoutManager.consoleComponent().warn(text);
                break;
            case LogLevel.ERROR:
            case LogLevel.FATAL:
                LayoutManager.consoleComponent().error(text);
                break;
            case LogLevel.ANY:
                LayoutManager.consoleComponent().append(message);
                break;
        }
    });

    FileDropManager.init();
    LayoutManager.init();
    VioManager.init();
    KeyManager.init();

    connection = VioManager.connection;
    connection.on("error", reason => {
        showConnectionErrorDialog()
        console.log(reason);
    });
    connection.on("close", reason => {
        showConnectionClosedDialog();
        console.log(reason);
    });
    connection.on("open", async () => {
        const hwServerAddr = await connection.getHwServerAddr(); 
        Logger.info("Main", "HW-Server selected: " + hwServerAddr);
        showConnectedDialog(async (dialog) => {
            const rootDom = $('<p style="padding-left: 20px"></p>');
            dialog.find('.bootbox-body').html(rootDom);
            const devices = await VioManager.getDevices();
            for (const device of devices) {
                $(`<button deviceName="${device.deviceName}" style="margin: 10px 0; background: none; border: none">
                    <pre style="margin: 0">${device.deviceName}${device.active ? "" : " (inactive)"} </pre>
                </button><br/>`)
                .appendTo(rootDom)
                .on('click', async function () {
                    console.log("test");
                    
                    const deviceName = $(this).attr("deviceName") ?? "";
                    dialog.modal('hide');
                    Logger.info("Main", "Board selected: " + deviceName + "\n");
                    await VioManager.connectToDevice(deviceName);
                    const modules = await insertDefaultLayout(deviceName);
                    LayoutManager.modulesComponent().setModules(modules);
                    VioManager.requestOutputState();
                    VioManager.startRequestInputState();
                })
            }
        });
    });
    connection.start();

    FileDropManager.onFileUploaded = async (files: File[]): Promise<void> => {
        const fileList = await new Promise<([string, string])[]>((resolve, reject) => {
            FileDropManager.loadFiles(files, contents => {
                resolve([...files].map((file, i) => [file.name, contents[i]]));
            });
        });

        VioManager.unregisterAll();
        KeyManager.clear();
        LayoutManager.reset();
        await LayoutManager.modulesComponent().evaluateLayout(fileList[0][1]);
        LayoutManager.update();
        VioManager.requestOutputState();
    };

    Logger.info("Main", "Initialize complete! Build Time: " + (new Date(BUILD_TIME).toString()) + "\n");
}
