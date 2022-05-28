import VioManager, { VioPortDef } from './VioManager';
import Logger from '../core/Logger';

let _idCounter = 0;
function _getNextId() {
    return _idCounter++;
}

export type HookCallbackFunction = (port: VioPortDef, old: readonly number[], value: readonly number[]) => void;

export default class VioPort {
    protected _id: number = _getNextId();

    protected _name: string;
    protected _value: number[];
    protected _port: VioPortDef;
    protected _filtered: boolean;

    protected _thisContext: object | undefined = undefined;
    protected _callback: HookCallbackFunction | undefined = undefined;

    public userAttribute: any = {};

    constructor(port: VioPortDef, name?: string) {
        this._name = name ?? `vio_${this._id}@${port.type}_${port.jtagIndex}:${port.xsdbIndex}:${port.portIndex}${port._id ?? ""}`;
        this._port = port;
        this._filtered = false;
        this._value = [];
    }

    public registerNotify(callback: HookCallbackFunction, thisContext?: any): void {
        if (this._callback === undefined) {
            this._callback = callback;
            this._thisContext = thisContext;

            VioManager.registerNotify(this);
        } else {
            throw Logger.fatal("VioPort", "Unregister before register!\n");
        }
    }

    public unregisterNotify() {
        if (!this._callback !== undefined) {
            this._callback = undefined;
            this._thisContext = undefined;

            VioManager.unregisterNotify(this);
        } else {
            throw Logger.fatal("VioPort", "Register before unregister!\n");
        }
    }

    public onStateChanged(port: VioPortDef, newValue: number[]) {
        if (
            this._port.jtagIndex === port.jtagIndex &&
            this._port.xsdbIndex === port.xsdbIndex &&
            this._port.portIndex === port.portIndex &&
            this._port.type === port.type
        ) {
            const equal = (this._value.length === newValue.length) && (this._value.every(v => newValue.includes(v)))
            const oldVal = [... this._value];
            this._value = [... newValue];
            if (!this._filtered || !equal) {
                this._callback?.call(this._thisContext, port, oldVal, this.value);
            }
        }
    }
    
    public setValue(value: number[]) {
        if (this._port.type === 'OUTPUT') {
            // Don't update value here!
            // VioManager will call onStateChanged
            // to apply the new value.
            return VioManager.writeOutputValue(this._port, value);
        } else {
            throw Logger.fatal("VioPort", "Cannot set the value of an input port!\n");
        }
    }

    get id(): number {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get value(): number[] {
        return this._value;
    }

    set value(value: number[]) {
        this.setValue(value);
    }

    get filtered(): boolean {
        return this._filtered;
    }

    set filtered(value: boolean) {
        this._filtered = value;
    }

    get port(): VioPortDef {
        return this._port;
    }
}
