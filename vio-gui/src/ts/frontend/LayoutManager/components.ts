import Images from "../Images";
import Logger from "../../core/Logger";

declare class JSMpeg {
    // tslint:disable-next-line: variable-name
    static Player: any;
}

export abstract class BaseComponent {
    constructor() {
        // no implementation
    }

    public init(container: GoldenLayout.Container): void {
        // no implementation
    }

    public reset(): void {
        // no implementation
    }

    public update(): void {
        // no implementation
    }
}

export class ModulesComponent extends BaseComponent {
    private container: JQuery<HTMLElement>;
    private modules: any[] = [];

    public init(container: GoldenLayout.Container): void {
        this.container = $('<div class="modulesContainer"></div>');
        container.getElement().append(this.container);
    }

    public reset(): void {
        this.container.html("");
    }

    public append(element: HTMLElement | JQuery<HTMLElement>) {
        this.container.append(element);
    }

    public setModules(modules: any[]): void {
        this.modules = modules;
        for (const module of modules)
            module.register();
    }

    public async evaluateLayout(layout: string): Promise<void> {
        try {
            Logger.debug("ModulesComponent", "Evaluating layout file... ")
            // tslint:disable-next-line: no-eval
            this.setModules(await Promise.resolve(eval(layout)));
            Logger.debug("ModulesComponent", "success!")
        } catch (e) {
            Logger.error("ModulesComponent", e.name + ": " + e.message);
        }
    }
}


export class ConsoleComponent extends BaseComponent {
    private container: JQuery<HTMLElement>;

    public init(container: GoldenLayout.Container): void {
        const root = container.getElement();

        this.container = $('<div class="consoleContainer"></div>').appendTo(root);

        container.on("tab", () => {
            const tabElem = $(`<div class='lm_custom_icon'><img src='${Images.TRASH_ICON}'></div>`)
                .attr("title", "Clear Console")
                .on("click", () => void this.container.html(""));

            container.tab.titleElement.after(tabElem);
        })
    }

    public reset(): void {
        // this.container.html("");
    }

    public append(text: string): void {
        this.container.append(`${text.replace("\n", "<br/>")}`);
        this.container.scrollTop(this.container[0].scrollHeight);
    }

    public log(text: string): void {
        this.container.append(`${text.replace("\n", "<br/>")}<br/>`);
        this.container.scrollTop(this.container[0].scrollHeight);
    }

    public warn(text: string): void {
        this.container.append(`<font color="#880">${text.replace("\n", "<br/>")}</font> <br/>`);
        this.container.scrollTop(this.container[0].scrollHeight);
    }

    public error(text: string): void {
        this.container.append(`<font color="red">${text.replace("\n", "<br/>")}</font> <br/>`);
        this.container.scrollTop(this.container[0].scrollHeight);
    }
}

export class CameraComponent extends BaseComponent {
    private container: JQuery<HTMLElement>;
    private player: any;

    public init(container: GoldenLayout.Container): void {
        this.container = $('<div class="cameraContainer"><canvas></canvas></div>');
        container.getElement().append(this.container);
    }

    public connectTo(streamUrl: string) {
        this.player = new JSMpeg.Player(streamUrl, {
            audio: false,
            canvas: this.container.find("canvas")[0]
        })
    }

    public reset(): void {
        // this.container.html("");
    }
}
