import { bufferToPrintableString, findEndOfJson, tcfParseByteArray, tcfParseJson, uint16ArrayToBuffer } from "./helper";
import TcfSocket from "./TcfSocket";
import Logger from "../../core/Logger";

export namespace TcfServices {
    type Jtag_getContext_Type = {
        ID: string,
        ParentID?: string,
        Name: string,
        isActive?: boolean
    }

    export const enum XsdbSlaveType {
        VIO = 33
    }

    type Xsdb_getContext_Type = {
        ID: string,
        ParentID: string,
        slave_index?: number,
        slave_type: XsdbSlaveType,
        uuid: number[],
    }

    export class Locator {
        static Hello(socket: TcfSocket): void {
            socket.sendEvent("Locator", "Hello", `["ZeroCopy"]`);
        }
    }

    export class Jtag {
        static async getChildren(socket: TcfSocket, boardName: string = ""): Promise<string[]> {
            const args = `"${boardName}"`;
            const result = await socket.sendCommand("Jtag", "getChildren", args);
            if (result.error) {
                Logger.info(
                    "HwClientHelper",
                    "The call 'Jtag.getChildren' returned with an error.\n" +
                    "Parameter: " + args + "\n" +
                    "Error: " + bufferToPrintableString(result.data) + "\n" +
                    "A default value will be returned instead."
                );
                return [];
            }
            return tcfParseJson(result.data.subarray(5,-1));
        }

        static async getContext(socket: TcfSocket, boardName: string): Promise<Jtag_getContext_Type | null> {
            const args = `"${boardName}"`;
            const result = await socket.sendCommand("Jtag", "getContext", args);
            if (result.error) {
                Logger.info(
                    "HwClientHelper",
                    "The call 'Jtag.getContext' returned with an error.\n" +
                    "Parameter: " + args + "\n" +
                    "Error: " + bufferToPrintableString(result.data) + "\n" +
                    "A default value will be returned instead."
                );
                return null;
            }
            return tcfParseJson(result.data.subarray(5,-1));
        }
    }

    export class Xsdb {
        /**
         * Returns the IDs of all XSDB connected to the JTAG interface.
         */
        static async getChildren(socket: TcfSocket, boardJtagId: string): Promise<string[]> {
            const args = `"${boardJtagId}"`;
            const result = await socket.sendCommand("xsdb", "getChildren", args);
            if (result.error) {
                Logger.info(
                    "HwClientHelper",
                    "The call 'xsdb.getChildren' returned with an error.\n" +
                    "Parameter: " + args + "\n" +
                    "Error: " + bufferToPrintableString(result.data) + "\n" +
                    "A default value will be returned instead."
                );
                return [];
            }
            return tcfParseJson(result.data.subarray(5,-1));
        }

        static async getContext(socket: TcfSocket, boardXsdbId: string): Promise<Xsdb_getContext_Type | null> {
            const args = `"${boardXsdbId}"`;
            const result = await socket.sendCommand("xsdb", "getContext", args);
            if (result.error) {
                Logger.info(
                    "HwClientHelper",
                    "The call 'xsdb.getContext' returned with an error.\n" +
                    "Parameter: " + args + "\n" +
                    "Error: " + bufferToPrintableString(result.data) + "\n" +
                    "A default value will be returned instead."
                );
                return null;
            }
            return tcfParseJson(result.data.subarray(5,-1));
        }

        static async readSequence(socket: TcfSocket, boardXsdbId: string, addr: number, continuous: boolean, size: number): Promise<Buffer | null> {
            const args = `"${boardXsdbId}"\0[["read",${addr},${continuous?1:0},${size}]]\0""`;
            const result = await socket.sendCommand("xsdb", "sequence", args);
            if (result.error) {
                Logger.info(
                    "HwClientHelper",
                    "The call 'xsdb.readSequence' returned with an error.\n" +
                    "Parameter: " + args + "\n" +
                    "Error: " + bufferToPrintableString(result.data) + "\n" +
                    "A default value will be returned instead."
                );
                return null;
            }
            return tcfParseByteArray(result.data.subarray(5,-1));
        }

        static async writeSequence(socket: TcfSocket, boardXsdbId: string, addr: number, continuous: boolean, size: number, values: number[]): Promise<void> {
            const byteArray = String.fromCharCode(...values.map(a => (a>>>0) & 0xff));
            const args = `"${boardXsdbId}"\0[["write",${addr},${continuous?1:0},${size}]]\0(${size*2})${byteArray}`;
            const result = await socket.sendCommand("xsdb", "sequence", args);
            if (result.error) {
                Logger.info(
                    "HwClientHelper",
                    "The call 'xsdb.writeSequence' returned with an error.\n" +
                    "Parameter: " + args + "\n" +
                    "Error: " + bufferToPrintableString(result.data)
                );
            }
        }
    }

    /**
     * This class is a pseudo service that provides easier
     * access to the xsdb service for the special case
     * that the current xsdb slave is an VIO instance.
     * It was build on top of the information provided in
     *  ./Xilinx/Vivado/2019.1/data/xicom/vio_slave.csv
     * and observation made with Wireshark
     */
    export class XsdbVio {
        private static NUM_PROBE_IN    = {addr: 0x000, start: 0, end: 15, mask: 0xFF, mode:  "r"};
        private static NUM_PROBE_OUT   = {addr: 0x001, start: 0, end: 15, mask: 0xFF, mode:  "r"};
        private static CONTROL         = {addr: 0x002, start: 0, end: 15, mask: 0xFF, mode: "rw"};
        private static COMMIT          = {addr: 0x002, start: 0, end:  0, mask: 0x01, mode: "rw"};
        private static RESET           = {addr: 0x002, start: 1, end:  1, mask: 0x02, mode: "rw"};
        private static INT_CNT_RST     = {addr: 0x002, start: 2, end:  2, mask: 0x04, mode: "rw"};
        private static HOLD_PROBE_IN   = {addr: 0x002, start: 3, end:  3, mask: 0x08, mode: "rw"};
        private static ACTIVITY_EN     = {addr: 0x003, start: 0, end:  0, mask: 0x01, mode:  "r"};
        private static MODIFIED        = {addr: 0x004, start: 0, end: 15, mask: 0xFF, mode: "rw"};
        private static PROBE_IN_WIDTH  = {addr: 0x005, start: 0, end: 15, mask: 0xFF, mode:  "r"};
        private static PROBE_OUT_WIDTH = {addr: 0x006, start: 0, end: 15, mask: 0xFF, mode:  "r"};
        private static PROBE_IN        = {addr: 0x007, start: 0, end: 15, mask: 0xFF, mode:  "r"};
        private static PROBE_OUT0      = {addr: 0x100, start: 0, end: 15, mask: 0xFF, mode: "rw"};


        static async readNumProbeIn(socket: TcfSocket, boardXsdbId: string): Promise<number> {
            return (await Xsdb.readSequence(socket, boardXsdbId, this.NUM_PROBE_IN.addr, false, 1))?.readUInt16LE(0) ?? -1;
        }

        static async readNumProbeOut(socket: TcfSocket, boardXsdbId: string): Promise<number> {
            return (await Xsdb.readSequence(socket, boardXsdbId, this.NUM_PROBE_OUT.addr, false, 1))?.readUInt16LE(0) ?? -1;
        }

        static async readControl(socket: TcfSocket, boardXsdbId: string): Promise<number> {
            return (await Xsdb.readSequence(socket, boardXsdbId, this.CONTROL.addr, false, 1))?.readUInt16LE(0) ?? -1;
        }

        static async clearControl(socket: TcfSocket, boardXsdbId: string): Promise<void> {
            await Xsdb.writeSequence(socket, boardXsdbId, this.CONTROL.addr, false, 1, [0, 0]);
        }

        static async setControlCommit(socket: TcfSocket, boardXsdbId: string): Promise<void> {
            await Xsdb.writeSequence(socket, boardXsdbId, this.CONTROL.addr, false, 1, [this.COMMIT.mask, 0]);
        }

        static async setControlReset(socket: TcfSocket, boardXsdbId: string): Promise<void> {
            await Xsdb.writeSequence(socket, boardXsdbId, this.CONTROL.addr, false, 1, [this.RESET.mask, 0]);
        }

        static async setControlInternalCountReset(socket: TcfSocket, boardXsdbId: string): Promise<void> {
            await Xsdb.writeSequence(socket, boardXsdbId, this.CONTROL.addr, false, 1, [this.INT_CNT_RST.mask, 0]);
        }

        static async setControlHoldProbeIn(socket: TcfSocket, boardXsdbId: string): Promise<void> {
            await Xsdb.writeSequence(socket, boardXsdbId, this.CONTROL.addr, false, 1, [this.HOLD_PROBE_IN.mask, 0]);
        }


        static async readActivityEnabled(socket: TcfSocket, boardXsdbId: string): Promise<boolean> {
            const num = await Xsdb.readSequence(socket, boardXsdbId, this.ACTIVITY_EN.addr, false, 1);
            return (num?.readUInt16LE(0) ?? 0) === 1;
        }

        static async readModifiedRegister(socket: TcfSocket, boardXsdbId: string): Promise<number> {
            const num = await Xsdb.readSequence(socket, boardXsdbId, this.MODIFIED.addr, false, 1);
            return (num?.readUInt16LE(0) ?? -1);
        }

        static async writeModifiedRegister(socket: TcfSocket, boardXsdbId: string, value: number): Promise<void> {
            await Xsdb.writeSequence(socket, boardXsdbId, this.MODIFIED.addr, false, 1, [... uint16ArrayToBuffer(value)]);
        }


        static async readProbeInWidth(socket: TcfSocket, boardXsdbId: string, numProbeIn: number): Promise<number[]> {
            if (numProbeIn === 0) return [];
            const numUint16 = (numProbeIn + 1) >>> 1;
            const widths = (await Xsdb.readSequence(socket, boardXsdbId, this.PROBE_IN_WIDTH.addr, false, numUint16));
            if (widths === null) return [];
            return [... widths.subarray(0, numProbeIn)].map(i => i + 1);
        }

        static async readProbeOutWidth(socket: TcfSocket, boardXsdbId: string, numProbeOut: number): Promise<number[]> {
            if (numProbeOut === 0) return [];
            const numUint16 = (numProbeOut + 1) >>> 1;
            const widths = await Xsdb.readSequence(socket, boardXsdbId, this.PROBE_OUT_WIDTH.addr, false, numUint16);
            if (widths === null) return [];
            return [... widths.subarray(0, numProbeOut)].map(i => i + 1);
        }


        static async readProbeIn(socket: TcfSocket, boardXsdbId: string, probeInWidth: number[], activityEnabled: boolean): Promise<number[][]> {
            if (probeInWidth === []) 
                return [];

            const numBytes =  probeInWidth.map(i => Math.ceil(i/8));
            const numBytesSum = numBytes.reduce((v,a) => v+a, 0);

            const numUint16 = (numBytesSum * (activityEnabled ? 3 : 1) + 1) >>> 1;
            const result = await Xsdb.readSequence(socket, boardXsdbId, this.PROBE_IN.addr, false, numUint16);

            if (result === null)
                return [];

            // read w0 w1 w2 w3 -> w = b0 b1
            const bytes = result;
            const values: number[][] = [];
            let j = 0;
            for (const size of numBytes) {
                const value : number[] = [];
                for (let i = 0; i < size; i++)
                    value.push(bytes[j++]);
                values.push(value);
            }

            return values;
        }

        static async readProbeOut(socket: TcfSocket, boardXsdbId: string, probeIndex: number, probeWidth: number): Promise<number[]> {
            if (probeWidth === 0) 
                return [];

            const numBytes = Math.ceil(probeWidth / 8);
            const numUint16 = (numBytes + 1) >>> 1;
            const result = await Xsdb.readSequence(socket, boardXsdbId, this.PROBE_OUT0.addr + probeIndex, false, numUint16);
            if (result === null) return [];
            return [... result.subarray(0, numBytes)];
        }

        static async writeProbeOut(socket: TcfSocket, boardXsdbId: string, probeIndex: number, probeWidth: number, value: number[]): Promise<void> {
            if (probeWidth === 0) 
                return;

            const numBytes = Math.ceil(probeWidth / 8);
            const numUint16 = (numBytes + 1) >>> 1;
            if (value.length !== numBytes) {
                Logger.info("XsdbVioService",
                    "For a probe width of " + probeWidth + " bits this function expected " + numBytes + " bytes\n" +
                    "but " + value.length + " bytes where provided. The latter bytes will be truncated!\n" +
                    "XSDB-ID: " + boardXsdbId + "\n" + 
                    "Probe Index: " + probeIndex
                );
                value = value.slice(0, numBytes);
            }
            // FIXME Check if this is really correct
            value = value.reverse();
            if ((value.length & 1) !== 0)
                value.unshift(0);
            const state = Buffer.from(value);
            state.swap16();
            await Xsdb.writeSequence(socket, boardXsdbId, this.PROBE_OUT0.addr + probeIndex, false, numUint16, [... state]);
        }

    }
}
