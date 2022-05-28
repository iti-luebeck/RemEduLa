import LayoutManager from "../LayoutManager/LayoutManager";
import VioPort from "../VioPort";
import VioPin from "../VioPin";

export default class LED {
    public port: VioPort;
    private dom: JQuery<HTMLElement>;
    private color: string;

    constructor(x: number, y: number, port: VioPin, color: string = "#ff0000") {
        this.port = port;
        this.port.filtered = true;

        this.color = color;

        this.dom = $(`<div id="led_${this.port.id}" class="module led"></div>`);
        this.dom.attr("port-name", port.name);
        this.dom.css({ top: y + "px", left: x + "px" });
        LayoutManager.modulesComponent().append(this.dom);

    }

    public register() {
        this.port.registerNotify((port, old, value) => {
            if (value[0] > 0) {
                this.dom.addClass("led_on").css("background-color", this.color);
            } else {
                this.dom.removeClass("led_on").css("background-color", "");
            }
        });
    }

    public set x(value: number) { this.dom.css({ left: value + "px" }); }
    public set y(value: number) { this.dom.css({ top: value + "px" }); }
}
