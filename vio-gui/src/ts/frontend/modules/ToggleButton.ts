import LayoutManager from "../LayoutManager/LayoutManager";
import KeyManager from "../KeyManager";
import Key from "../KeyManager.key";
import VioPort from "../VioPort";
import VioPin from "../VioPin";

export default class ToggleButton {
    public port: VioPort;
    private dom: JQuery<HTMLElement>;
    private toggleState: boolean = false;
    private color: string;
    private key: Key;

    constructor(x: number, y: number, port: VioPin, key: Key = Key.Unknown, color: string = "#ff0000") {
        this.port = port;
        this.port.filtered = true;

        this.color = color;
        this.key = key;

        this.dom = $(`<button id="button_${this.port.id}" class="module button"></button>`);
        this.dom.attr("port-name", port.name);
        this.dom.css({ top: y + "px", left: x + "px" });
        this.dom.html(Key.mapKey(key));

        LayoutManager.modulesComponent().append(this.dom);

        this.dom.on("mousedown", () => this.mousedownCallback());
    }

    public register() {
        this.port.registerNotify((port, old, value) => {
            this.toggleState = value[0] !== 0;
            if (this.toggleState) {
                this.dom.addClass("active_button").css("background-color", this.color);
            } else {
                this.dom.removeClass("active_button").css("background-color", "");
            }
        });

        KeyManager.register(this.port, this.key, () => this.mousedownCallback());
    }
    
    private mousedownCallback() {
        this.toggleState = !this.toggleState;
        this.port.value = this.toggleState ? [1] : [0];
        if (this.toggleState) {
            this.dom.addClass("active_button").css("background-color", this.color);
        } else {
            this.dom.removeClass("active_button").css("background-color", "");
        }
    };

    public set x(value: number) { this.dom.css({ left: value + "px" }); }
    public set y(value: number) { this.dom.css({ top: value + "px" }); }
}
