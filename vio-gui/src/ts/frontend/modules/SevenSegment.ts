import LayoutManager from "../LayoutManager/LayoutManager";
import VioPort from "../VioPort";
import VioPin from "../VioPin";

export default class SevenSegment {
    public port: VioPort;
    private dom: JQuery<HTMLElement>;

    constructor(x: number, y: number, port: VioPort) {
        this.port = port;
        this.port.filtered = true;

        this.dom = $(`<div id="7seg_${this.port.id}" class="module ssegbody"></div>`);
        this.dom.append(`<div class="sseg sseg-gray"></div>`);
        this.dom.append(`<div class="sseg sseg0"></div>`);
        this.dom.append(`<div class="sseg sseg1"></div>`);
        this.dom.append(`<div class="sseg sseg2"></div>`);
        this.dom.append(`<div class="sseg sseg3"></div>`);
        this.dom.append(`<div class="sseg sseg4"></div>`);
        this.dom.append(`<div class="sseg sseg5"></div>`);
        this.dom.append(`<div class="sseg sseg6"></div>`);
        this.dom.append(`<div class="sseg sseg7"></div>`);
        this.dom.attr("port-name", port.name);
        this.dom.css({ top: y + "px", left: x + "px" });

        LayoutManager.modulesComponent().append(this.dom);
    }

    public register() {
        this.port.registerNotify((port, old, value) => {
            for (let i = 0; i < 8; i++) {
                if ((value[0] & (1 << i)) !== 0)
                    this.dom.addClass(`s${i}`);
                else
                    this.dom.removeClass(`s${i}`);
            }
        });
    }

    public set x(value: number) { this.dom.css({ left: value + "px" }); }
    public set y(value: number) { this.dom.css({ top: value + "px" }); }
}
