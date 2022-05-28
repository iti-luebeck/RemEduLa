import VioManager, { VioPortDef } from './VioManager';
import Logger from '../core/Logger';
import VioPort from './VioPort';


export default class VioPin extends VioPort {
    private _pin: number;

    constructor(port: VioPortDef, pin: number, name?: string) {
        super({...port, _id: "_" + pin}, name);
        this._pin = pin;
        this._value = [];
    }

    public onStateChanged(port: VioPortDef, value: number[]) {
        if (
            this._port.jtagIndex === port.jtagIndex &&
            this._port.xsdbIndex === port.xsdbIndex &&
            this._port.portIndex === port.portIndex &&
            this._port.type === port.type
        ) {
            const old = this.getBitValue(this._value);
            const val = this.getBitValue(value);
            this._value = [... value];
            if (
                this._callback !== undefined &&
                (!this._filtered || (old !== val))
            ) {
                this._callback.call(this._thisContext, port, [old], [val]);
            }
        }
    }

    private getBitValue(value: number[]): number {
        const byteIndex = this._pin >>> 3;
        const bitIndex = (this._pin & 0x07) >>> 0;
        const v = value[byteIndex] ?? 0;
        return (v >>> bitIndex) & 1;
    }
    
    private setBitValue(): number[] {
        const byteIndex = this._pin >>> 3;
        const bitIndex = (this._pin & 0x07) >>> 0;
        const value = [... this._value];
        const v = value[byteIndex] ?? 0;
        value[byteIndex] = v | ( (1 << bitIndex) >>> 0);
        return value;
    }

    private clearBitValue(): number[] {
        const byteIndex = this._pin >>> 3;
        const bitIndex = (this._pin & 0x07) >>> 0;
        const value = [... this._value];
        const v = value[byteIndex] ?? 0;
        value[byteIndex] = v & (~(1 << bitIndex) >>> 0);
        return value;
    }
    
    public  setValue(value: number[]) {
        if (this._port.type === 'OUTPUT') {
            // Don't update value here!
            // VioManager will call onStateChanged
            // to apply the new value.
            value = (value[0] === 0) ?
                this.clearBitValue():
                this.setBitValue();
            return VioManager.writeOutputValue(this._port, value);
        } else {
            throw Logger.fatal("VioPort", "Cannot set the value of an input port!\n");
        }
    }

    get value(): number[] {
        return [this.getBitValue(this._value)];
    }

    set value(value: number[]) {
        this.setValue(value);
    }

}
