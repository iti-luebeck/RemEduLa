import { bufferToPrintableString, tcfFindEndOfMessage, findNull, findEndOfJson, tcfParseJson, tcfEncodeLength, tcfDecodeLength, tcfDecodeByteArray } from "./helper";
import Logger from "../../core/Logger";
import { EventEmitter } from "events";
import Ascii from "./Ascii";

declare interface TcfDataStream {
    // tslint:disable: unified-signatures
    emit(event: string, ...args: any[]): boolean;
    emit(event: "event", service: string, eventName: string, data: Buffer): this;
    emit(event: "response", token: string, data: Buffer, error: boolean): this;
    emit(event: "progress", token: string, data: Buffer): this;
    emit(event: "flow", level: number): this;
    emit(event: "eos", data: Buffer): this;

    on(event: string, listener: (...args: any[]) => void): this;
    on(event: "event", listener: (service: string, eventName: string, data: Buffer) => void): this;
    on(event: "response", listener: (token: string, data: Buffer, error: boolean) => void): this;
    on(event: "progress", listener: (token: string, data: Buffer) => void): this;
    on(event: "flow", listener: (level: number) => void): this;
    on(event: "eos", listener: (data: Buffer) => void): this;
    // tslint:enable: unified-signatures
}

class TcfDataStream extends EventEmitter {
    
    private index: number;
    private data: Buffer = Buffer.of();

    public constructor(index: number) {
        super();
        this.index = index;
    }

    public appendData(data: Buffer): void {
        this.data = Buffer.concat([this.data, data], this.data.length + data.length);
        this.processMessages();
    }

    private processMessages(): void {
        while (true) {
            let offset = tcfFindEndOfMessage(this.data);
            if (offset === -1) {
                break;
            }
            offset = this.processMessage(this.data);
            Logger.info(`TcfDataStream[${this.index}]`, "Processed:", bufferToPrintableString(this.data.subarray(0, offset)));
            this.data = this.data.subarray(offset);
        }
    }

    private processMessage(data: Buffer): number {
        switch(data[0]) {
            case Ascii.CAPITAL_E:
                return this.processE(data);
            case Ascii.CAPITAL_R:
                return this.processR(data);
            case Ascii.CAPITAL_P:
                return this.processP(data);
            case Ascii.CAPITAL_N:
                return this.processN(data);
            case Ascii.CAPITAL_F:
                return this.processF(data);
            case 0x03:
                if (data[1] === 0x02) {
                    return this.processEOS(data);
                }
            default:
                Logger.error(`TcfDataStream[${this.index}]`, "Received unknown message.", bufferToPrintableString(data), data.length);
                return 1;
        }
    }

    
    private processE(data: Buffer): number {
        /* E\0<service>\0<event>\0<json or string><byteArray>\3\1 */
        let offset = 2;
        let end = 0;

        end = findNull(data, offset);
        const service = data.subarray(offset, end-1).toString();
        offset = end;

        end = findNull(data, offset);
        const event = data.subarray(offset, end-1).toString();
        offset = end;

        end = tcfFindEndOfMessage(data, offset);
        const byteArray = data.subarray(offset, end);
        offset = end;
        // const byteArray = tcfDecodeByteArray(data, offset);
        // offset += byteArray.length;

        // offset += 2;
        this.emit("event", service, event, byteArray);
        return offset;
    }

    private processR(data: Buffer): number {
        /* R\0<token>\0<byteArray>\3\1 */
        let offset = 2;
        let end = 0;

        end = findNull(data, offset);
        const token = data.subarray(offset, end-1).toString();
        offset = end;

        // end = tcfFindEndOfMessage(data, offset);
        // const byteArray = data.subarray(offset, end);
        // offset = end;
        const byteArray = tcfDecodeByteArray(data, offset);
        offset += byteArray.length;

        // offset += 2;
        this.emit("response", token, byteArray, false);
        return offset;
    }

    private processN(data: Buffer): number {
        /* N\0<token>\0\3\1 */
        let offset = 2;
        let end = 0;

        end = findNull(data, offset);
        const token = data.subarray(offset, end-1).toString();
        offset = end;

        // offset += 2;
        this.emit("response", token, Buffer.alloc(0), true);
        return offset;
    }

    private processP(data: Buffer): number {
        /* P\0<token>\0<byteArray>\3\1 */
        let offset = 2;
        let end = 0;

        end = findNull(data, offset);
        const token = data.subarray(offset, end-1).toString();
        offset = end;

        // end = tcfFindEndOfMessage(data, offset);
        // const byteArray = data.subarray(offset, end);
        // offset = end;
        const byteArray = tcfDecodeByteArray(data, offset);
        offset += byteArray.length;

        // offset += 2;
        this.emit("progress", token, byteArray);
        return offset;
    }

    private processF(data: Buffer): number {
        /* F\0< -100to100 : trafficCongestionLevel> (\0)?\3\1 */
        let offset = 2;
        let end = 0;

        end = findNull(data, offset);
        const trafficCongestionLevel = parseInt(data.subarray(offset, end-1).toString(), 10);
        offset = end;

        // offset += 2;
        this.emit("flow", trafficCongestionLevel);
        return offset;
    }

    private processEOS(data: Buffer): number {
        /* \3\2<json>\3\1 */
        let offset = 2;
        let end = 0;

        end = tcfFindEndOfMessage(data, offset);
        const byteArray = data.subarray(offset, end);
        offset = end;
        
        this.emit("eos", byteArray);
        return offset;
    }
}

export default TcfDataStream;
