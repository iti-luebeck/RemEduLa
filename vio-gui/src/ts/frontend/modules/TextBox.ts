import LayoutManager from "../LayoutManager/LayoutManager";

export default class TextBox {
    private dom: JQuery<HTMLElement>;

    constructor(x: number, y: number, content: string, css?: ({[index:string]: string})) {
        this.dom = $(`<div id="text_${Date.now()}" class="module text"></div>`);
        this.dom.css({...css, top: y + "px", left: x + "px" });
        this.dom.html(content);
        LayoutManager.modulesComponent().append(this.dom);
    }

    public register() {
        //
    }

    public set x(value: number) { this.dom.css({ left: value + "px" }); }
    public set y(value: number) { this.dom.css({ top: value + "px" }); }
}
