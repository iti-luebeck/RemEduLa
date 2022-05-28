import * as Modules from './modules';
import VioPort from "./VioPort";
import VioPin from "./VioPin";
import Key from "./KeyManager.key";
import VioManager, { VioPortDef } from './VioManager';
import LayoutManager from './LayoutManager/LayoutManager';
import Logger from '../core/Logger';


async function insertDefaultLayoutBasys3() {
    const boardJtagIndex = 0;
    const boardXsdbIndex = await VioManager.xsdbIndexFromIdentifier(boardJtagIndex, "BASYS_3", 0);

    const inPortDef  = (portId: number): VioPortDef => ({jtagIndex: boardJtagIndex, xsdbIndex: boardXsdbIndex, portIndex: portId, type: 'INPUT'});
    const outPortDef = (portId: number): VioPortDef => ({jtagIndex: boardJtagIndex, xsdbIndex: boardXsdbIndex, portIndex: portId, type: 'OUTPUT'});

    const offsets = {
        ld: {x: 10, y: 230},
        sw: {x: 10, y: 300},
        bt: {x: 580, y: 30},
        ss: {x: 150, y: 60}
    }

    async function programBoard(bytes: number[]) {
        Logger.info("Uploader", "Start uploading hex-file...");
        bytes = (bytes ?? []).concat((new Array(64*1024)).fill(0)).slice(0, 64*1024);
        const str2raw = (s: string) => s.split("").map(a=>a.charCodeAt(0));
        const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        let port = "";
        const serialInfos = await VioManager.connection.serialGetPortInfos({});
        for (const serialInfo of serialInfos) {
            if (VioManager.devName.split("-")[2].startsWith(serialInfo.serialNumber!)) {
                port = serialInfo.path;
                break;
            }
        }
        if (port === "") {
            Logger.error("Uploader", "Could not found serial port!");
            return;
        }
        VioManager.serialPath = ""; 
        await VioManager.connection.serialOpen({path: port})
        await sleep(100)
        VioManager.serialPath = port; 
        await VioManager.connection.serialSetBreak({path: port})
        await sleep(100)
        await VioManager.connection.serialSend({path: port, data: str2raw("JQS4NDFY\n")})
        await sleep(200)
        await VioManager.connection.serialSend({path: port, data: str2raw("PROG\n")})
        await sleep(200)
        await VioManager.connection.serialSend({path: port, data: [0,0,0,0]})
        await sleep(200)
        await VioManager.connection.serialSend({path: port, data: [0,0,1,0]})
        await sleep(200)
        await VioManager.connection.serialSend({path: port, data: bytes})
        await sleep(8000)
        await VioManager.connection.serialSend({path: port, data: str2raw("EXIT\n")})
        await sleep(100)
    
        Logger.info("Uploader", "Upload done!");
    }
    const uploadButton = $(`<input id="hexFileUpload" type="file" accept='.hex'/>`);
    const uploadLabel = $(`<label for="hexFileUpload" class="module">Upload Hex-File</label>`);
    uploadButton.css({
        "display": "none"
    });
    uploadLabel.css({
        "top": 80 + "px",
        "left": 430 + "px",
        "height": "32px",
        "border-radius": "5px",
        "border": "1px solid black",
        "font-size": "16px",
        "padding": "3px 6px",
        "cursor": "pointer",
    });
    uploadButton.on("change", async function () {
        const files = [...(this as any).files];
        const fileContent = await new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsArrayBuffer(files[0]);
        });
        (this as any).value = null;
        const bytes = [...new Uint8Array(fileContent as ArrayBuffer)];
        await programBoard(bytes);
    });
    LayoutManager.modulesComponent().append(uploadButton);
    LayoutManager.modulesComponent().append(uploadLabel);


    const vioActive = new Modules.ToggleButton(30, 30, new VioPin(outPortDef(0), 0, "vioActive"));

    const leds: Modules.LED[] =[];
    const switches: Modules.ToggleButton[] = [];
    for (let i=0; i<16; i++) {
        const ld = new Modules.LED(offsets.ld.x+50*i, offsets.ld.y, new VioPin(inPortDef(2), 15-i, "LD"+(15-i)));
        const sw = new Modules.ToggleButton(offsets.sw.x+50*i, offsets.sw.y, new VioPin(outPortDef(1), 15-i, "SW"+(15-i)));
        leds.push(ld);
        switches.push(sw);
    }

    const seg1 = new Modules.SevenSegment(offsets.ss.x + 150, offsets.ss.y, new VioPort(inPortDef(3), "Seg1"));
    const seg2 = new Modules.SevenSegment(offsets.ss.x + 100, offsets.ss.y, new VioPort(inPortDef(4), "Seg2"));
    const seg3 = new Modules.SevenSegment(offsets.ss.x +  50, offsets.ss.y, new VioPort(inPortDef(5), "Seg3"));
    const seg4 = new Modules.SevenSegment(offsets.ss.x +   0, offsets.ss.y, new VioPort(inPortDef(6), "Seg4"));

    const btn0 = new Modules.Button(offsets.bt.x + 50, offsets.bt.y +   0, new VioPin(outPortDef(2), 0, "BTNU"), Key.ArrowUp);
    const btn1 = new Modules.Button(offsets.bt.x +100, offsets.bt.y +  50, new VioPin(outPortDef(2), 1, "BTNR"), Key.ArrowRight);
    const btn2 = new Modules.Button(offsets.bt.x + 50, offsets.bt.y + 100, new VioPin(outPortDef(2), 2, "BTND"), Key.ArrowDown);
    const btn3 = new Modules.Button(offsets.bt.x +  0, offsets.bt.y +  50, new VioPin(outPortDef(2), 3, "BTNL"), Key.ArrowLeft);
    const btn4 = new Modules.Button(offsets.bt.x + 50, offsets.bt.y +  50, new VioPin(outPortDef(2), 4, "BTNC"), Key.Space);

    return [
        vioActive, ...leds, ...switches,
        seg1, seg2, seg3, seg4,
        btn0, btn1, btn2, btn3, btn4
    ];
}

async function insertDefaultLayoutZedboard() {
    const boardJtagIndex = 1;
    const boardXsdbIndex = await VioManager.xsdbIndexFromIdentifier(boardJtagIndex, "ZED_BOARD", 0);

    const inPortDef  = (portId: number): VioPortDef => ({jtagIndex: boardJtagIndex, xsdbIndex: boardXsdbIndex, portIndex: portId, type: 'INPUT'});
    const outPortDef = (portId: number): VioPortDef => ({jtagIndex: boardJtagIndex, xsdbIndex: boardXsdbIndex, portIndex: portId, type: 'OUTPUT'});

    const offsets = {
        ld: { x: 30, y: 230 },
        sw: { x: 30, y: 300 },
        bt: { x: 300, y: 30 },
        ss: { x: 150, y: 60 }
    };

    // tslint:disable: no-unused-expression
    const vioActive = new Modules.ToggleButton(30, 30, new VioPin(outPortDef(0), 0, "vioActive"), Key.Unknown);
    
    const leds: Modules.LED[] =[];
    const switches: Modules.ToggleButton[] = [];
    for (let i = 0; i < 8; i++) {
        const ld = new Modules.LED(offsets.ld.x + 50 * i, offsets.ld.y, new VioPin(inPortDef(2), 7 - i, "LD" + (7 - i)));
        const sw = new Modules.ToggleButton(offsets.sw.x + 50 * i, offsets.sw.y, new VioPin(outPortDef(1), 7 - i, "SW" + (7 - i)), Key.Unknown);
        leds.push(ld);
        switches.push(sw);
    }

    //                                  x,                  y,                     port defintion, bit,  name,   keyMapping
    const btn0 = new Modules.Button(offsets.bt.x +  50, offsets.bt.y +   0, new VioPin(outPortDef(2), 0, "BTNU"), Key.ArrowUp);
    const btn1 = new Modules.Button(offsets.bt.x + 100, offsets.bt.y +  50, new VioPin(outPortDef(2), 1, "BTNR"), Key.ArrowRight);
    const btn2 = new Modules.Button(offsets.bt.x +  50, offsets.bt.y + 100, new VioPin(outPortDef(2), 2, "BTND"), Key.ArrowDown);
    const btn3 = new Modules.Button(offsets.bt.x +   0, offsets.bt.y +  50, new VioPin(outPortDef(2), 3, "BTNL"), Key.ArrowLeft);
    const btn4 = new Modules.Button(offsets.bt.x +  50, offsets.bt.y +  50, new VioPin(outPortDef(2), 4, "BTNC"), Key.Space);
    // tslint:enable: no-unused-expression
    
    return [
        vioActive, ...leds, ...switches,
        btn0, btn1, btn2, btn3, btn4
    ];
}

export default async function insertDefaultLayout(boardName: string) {
    if (boardName.toLocaleLowerCase().startsWith("jsn-basys3-")) {
        return insertDefaultLayoutBasys3();
    }
    if (boardName.toLocaleLowerCase().startsWith("jsn-zed-")) {
        return insertDefaultLayoutZedboard();
    }
    return [];
}