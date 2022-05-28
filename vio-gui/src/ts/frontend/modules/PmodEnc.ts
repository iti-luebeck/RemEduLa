import LayoutManager from "../LayoutManager/LayoutManager";
import KeyManager from "../KeyManager";
import Key from "../KeyManager.key";
import VioPort from "../VioPort";
import VioPin from "../VioPin";

export default class PmodEnc {
    public port: VioPort;
    private keyInc: Key;
    private keyDec: Key;

    private dom: JQuery<HTMLElement>;
    private domKnob: JQuery<HTMLElement>;
    private domText: JQuery<HTMLElement>;

    private seqIndex: number = 0;
    private sequence: number[] = [0b00, 0b01, 0b11, 0b10];
    private count: number = 15;

    constructor(x: number, y: number, port: VioPort, keyInc: Key, keyDec: Key) {
        this.port = port;
        this.port.filtered = true;

        this.keyInc = keyInc;
        this.keyDec = keyDec;

        this.dom = $(`<div id="pmodenc_${this.port.id}" class="module pmodenc"></div>`);
        this.dom.attr("port-name", port.name);
        this.dom.css({ top: y + "px", left: x + "px" });
        this.dom.append(`<div class="knob"></div>`);
        this.dom.append(`<div class="text">0</div>`);

        this.domKnob = this.dom.find(".knob");
        this.domText = this.dom.find(".text");

        LayoutManager.modulesComponent().append(this.dom);

    }

    public register() {
        this.port.registerNotify(() => (void 0));
        /*this.port.registerNotify((port, old, value) => {
            this.dom.text("" + value[0]);
        });*/

        KeyManager.register({}, this.keyInc, () => this.increment(), undefined, () => this.increment());
        KeyManager.register({}, this.keyDec, () => this.decrement(), undefined, () => this.decrement());
    }

    private increment() {
        const len = this.count * this.sequence.length;
        this.seqIndex++;
        if (this.seqIndex >= len)
            this.seqIndex = 0;

        const index = (this.seqIndex + len) % this.sequence.length;
        this.port.value = [this.sequence[index]];
        this.domText.text("" + this.seqIndex);
        this.domKnob.css("transform", `rotate(${this.seqIndex/len*360}deg)`);
    }
    
    private decrement() {
        const len = this.count * this.sequence.length;
        this.seqIndex--;
        if (this.seqIndex < 0)
            this.seqIndex = len - 1;

        const index = (this.seqIndex + len) % this.sequence.length;
        this.port.value = [this.sequence[index]];
        this.domText.text("" + this.seqIndex);
        this.domKnob.css("transform", `rotate(${this.seqIndex/len*360}deg)`);
    }

    public set x(value: number) { this.dom.css({ left: value + "px" }); }
    public set y(value: number) { this.dom.css({ top: value + "px" }); }
}
