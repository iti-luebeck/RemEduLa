import LayoutManager from "../LayoutManager/LayoutManager";
import KeyManager from "../KeyManager";
import Key from "../KeyManager.key";
import VioPort from "../VioPort";
import VioPin from "../VioPin";

export default class Button {
    public port: VioPort;
    private dom: JQuery<HTMLElement>;
    private color: string;

    private key: Key;

    constructor(x: number, y: number, port: VioPin, key: Key, color: string = "#ff0000") {
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
        this.dom.on("mouseup", () => this.mouseupCallback());
    }

    public register() {
        this.port.registerNotify((port, old, value) => (void 0));
        KeyManager.register(
            this.port, 
            this.key, 
            () => this.mousedownCallback(), 
            () => this.mouseupCallback()
        );
    }

    private mousedownCallback() {
        this.port.value = [1];
        this.dom.addClass("active_button").css("background-color", this.color);
    };

    private mouseupCallback() {
        this.port.value = [0];
        this.dom.removeClass("active_button").css("background-color", "");
    };

    public set x(value: number) { this.dom.css({ left: value + "px" }); }
    public set y(value: number) { this.dom.css({ top: value + "px" }); }
}
