import Ascii from "./Ascii";
import Logger from "../../core/Logger";


export function findNull(data: Buffer, offset: number = 0): number {
    while (data[offset++] !== 0x00);
    return offset;
}

export function tcfEncodeLength(len: number): string {
    return String.fromCharCode(0x03, 0x03, ((len & 0x007F) | 0x0080) >>> 0, ((len & 0x7F80) | 0x0000) >>> 7);
}

export function tcfDecodeLength(data: Buffer, offset: number = 0): number {
    if (data[offset + 0] !== 0x03 || data[offset + 1] !== 0x03 || (data[offset + 2] & 0x80) === 0x00) return -1;
    return ((data[offset + 2] & 0x7F) | (data[offset + 3] << 7)) >>> 0;
}

export function tcfDecodeByteArray(data: Buffer, offset: number = 0) {
    const byteLength = tcfDecodeLength(data, offset);
    const byteArray = data.subarray(offset, offset + 4 + byteLength + 2);
    return byteArray;
}

export function tcfFindEndOfMessage(data: Buffer, offset: number = 0): number {
    while (!(
        data[offset + 0] !== 0x03 &&
        data[offset + 1] === 0x03 &&
        data[offset + 2] === 0x01
    )) {
        offset++;
        if (offset + 2 >= data.length)
            return -1;
    }
    return offset + 3;
}

export function findEndOfJson(data: Buffer): number {
    if (data[0] !== Ascii.SQ_BRACKET_L && data[0] !== Ascii.CU_BRACKET_L)
        return -1;
    let offset = 0;
    const stack: number[] = [];
    while (offset < data.length) {
        if (data[offset] === Ascii.SQ_BRACKET_L) stack.push(Ascii.SQ_BRACKET_L);
        if (data[offset] === Ascii.CU_BRACKET_L) stack.push(Ascii.CU_BRACKET_L);
        if (data[offset] === Ascii.SQ_BRACKET_R) if (stack.pop() !== Ascii.SQ_BRACKET_L) return -2;
        if (data[offset] === Ascii.CU_BRACKET_R) if (stack.pop() !== Ascii.CU_BRACKET_L) return -3;
        offset++;
        if (stack.length === 0)
            return offset;
    }
    return -4;
}

function tcfFindRawByteArrayInJson(data: Buffer): number {
    if (data[0] !== Ascii.SQ_BRACKET_L && data[0] !== Ascii.CU_BRACKET_L)
        return -1;
    let offset = 0;
    const stack: number[] = [];
    while (offset < data.length) {
        if (data[offset] === Ascii.SQ_BRACKET_L)  stack.push(Ascii.SQ_BRACKET_L);
        if (data[offset] === Ascii.CU_BRACKET_L)  stack.push(Ascii.CU_BRACKET_L);
        if (data[offset] === Ascii.QUOT_MARK) stack.push(Ascii.QUOT_MARK);
        if (data[offset] === Ascii.SQ_BRACKET_R)  if (stack.pop() !== Ascii.SQ_BRACKET_L) return -2;
        if (data[offset] === Ascii.CU_BRACKET_R)  if (stack.pop() !== Ascii.CU_BRACKET_L) return -2;
        if (data[offset] === Ascii.QUOT_MARK) if (stack.pop() !== Ascii.QUOT_MARK) return -2;
        // if opening parenthesis and not in string
        // then it must be a raw byte array
        if (data[offset] === Ascii.PAREN_L) if (stack.pop() !== 0x22) return offset;
        offset++;
        if (stack.length === 0)
            return -1;
    }
    return -1;
}

export function tcfParseJson(data: Buffer): any {
    while (data.length > 0) {
        const offset = tcfFindRawByteArrayInJson(data);
        if (offset !== -1) {
            const parts: Buffer[] = [];

            parts.push(data.subarray(0, offset));
            data = data.subarray(offset);
            const size = tcfParseByteArraySize(data);
            parts.push(Buffer.from(`${JSON.stringify([... tcfParseByteArray(data)])}`, "binary"));
            parts.push(data.subarray(Math.floor(Math.log10(size))+3+size));

            data = Buffer.concat(parts);
        } else {
            break;
        }
    }

    const end = findEndOfJson(data);
    if (end < 0)
        return null;

    data = data.subarray(0, end);
    return JSON.parse(data.toString("binary"));

}


function tcfParseByteArraySize(data: Buffer): number {
    let size = 0;
    let offset = 1;
    if (data[0] !== Ascii.PAREN_L) {
        Logger.info("tcfParseByteArraySize", `The buffer ${bufferToPrintableString(data)} does not contain a valid byte array.`)
        return -1;
    }

    while (data[offset] !== Ascii.PAREN_R) {
        size = size * 10 + data[offset] - 0x30;
        offset++;
    }
    return size;
}

export function tcfParseByteArray(data: Buffer): Buffer {
    const size = tcfParseByteArraySize(data);
    if (size === -1) return Buffer.of();
    data = data.subarray(Math.floor(Math.log10(size))+3);
    return data.subarray(0, size);
}


export function bufferToPrintableString(data: Buffer) {
    const byteMap = (i: number) => (i>=32&&i<127) ? 
        String.fromCharCode(i) : `\\x${i.toString(16).toUpperCase().padStart(2, "0")}`;
    return [... data].map(byteMap).join("");
}

export function uint16ArrayToBuffer(...values: number[]): Buffer {
    const buffer = Buffer.allocUnsafe(values.length >>> 1);
    for (let i = 0; i < values.length; i++)
        buffer.writeUInt16LE(values[i], i * 2);
    return buffer;
}

export function bufferToUint16Array(buffer: Buffer): number[] {
    const array : number[] = [];
    for (let i = 0; i < buffer.length; i+=2)
        array.push(buffer.readUInt16LE(i));
    return array;
}
