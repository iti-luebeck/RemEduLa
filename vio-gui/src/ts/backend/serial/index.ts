import * as SerialPort from 'serialport'
import PromiseHelper from '../../core/helper/PromiseHelper';

export type SerialCallbacks = {
    open: (path: string) => void,
    error: (path: string, error: string) => void,
    close: (path: string) => void,
    data: (path: string, data: number[]) => void,
}

const callbacks: SerialCallbacks = {
    open: path => (void 0),
    error: (path, error?) => (void 0),
    close: path => (void 0),
    data: (path, data: number[]) => (void 0),
}

const openPorts = new Map<string, SerialPort>();

export async function setCallbacks(_callbacks: SerialCallbacks) {
    callbacks.open  = _callbacks.open;
    callbacks.error = _callbacks.error;
    callbacks.close = _callbacks.close;
    callbacks.data  = _callbacks.data;
}

export type SerialPortInfo = SerialPort.PortInfo;
export async function getPortInfos(): Promise<SerialPortInfo[]> {
    return await SerialPort.list()
}

export function open(path: string) {
    const port = new SerialPort(
        path, 
        { 
            autoOpen: true,        // {boolean} Automatically opens the port on `nextTick`.
            baudRate: 115200,      // {number}  The baud rate of the port to be opened. This should match one of the commonly available baud rates, such as 110, 300, 1200, 2400, 4800, 9600, 14400, 19200, 38400, 57600, or 115200. Custom rates are supported best effort per platform. The device connected to the serial port is not guaranteed to support the requested baud rate, even if the port itself supports that baud rate.
            dataBits: 8,           // {number}  Must be one of these: 8, 7, 6, or 5.
            highWaterMark: 65536,  // {number}  The size of the read and write buffers defaults to 64k.
            lock: true,            // {boolean} Prevent other processes from opening the port. Windows does not currently support `false`.
            stopBits: 2,           // {number}  Must be one of these: 1 or 2.
            parity: 'none',        // {string}  Must be one of these: 'none', 'even', 'mark', 'odd', 'space'.
    
        }, 
        (error?) => { if (error) callbacks.error(path, ""+error) }
    )
    port.on('open',  () => {
        openPorts.set(path, port);
        callbacks.open(path);
    });
    port.on('close', () => {
        openPorts.delete(path);
        callbacks.close(path);
    });
    port.on('data',  (data: Buffer) => callbacks.data(path, [... data]));
}

export function close(path: string): boolean {
    const port = openPorts.get(path);
    if (port) {
        port.close((error?) => { if (error) callbacks.error(path, "" + error) });
        return true;
    }
    return false;
}

export async function send(path: string, data: number[]): Promise<boolean> {
    const port = openPorts.get(path);
    if (port) {
        const pW = new PromiseHelper<void>();
        const pD = new PromiseHelper<void>();

        const resW = port.write(data, (error?) => { 
            if (error) {
                callbacks.error(path, "" + error)
            } else {
                pW.resolve();
            } 
        });
        if (!resW) return false;
        port.drain( (error?) => { 
            if (error) {
                callbacks.error(path, "" + error)
            } else {
                pD.resolve();
            } 
        });
        return Promise.all([pW.promise, pD.promise]).then(() => true);
    }
    return false;
}


export async function setBreak(path: string): Promise<boolean> {
    const port = openPorts.get(path);
    if (port) {
        const p = new PromiseHelper<boolean>();
        port.set({brk: true}, function() {
            setTimeout(function(){
                port.set({brk: false}, function() {
                    p.resolve(true);
                });
            }, 500);
        });
        return p.promise;
    }
    return false;
}
