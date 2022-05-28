import { BaseComponent, CameraComponent, ConsoleComponent, ModulesComponent } from "./components";
import { configGoldenLayout } from "./config";

export default class LayoutManager {
    private static _layout: GoldenLayout;
    private static _components: BaseComponent[];

    private static _modulesComponent: ModulesComponent;
    private static _consoleComponent: ConsoleComponent;
    private static _cameraComponent: CameraComponent;

    // callback used by the layouts to get notified when the layout is destroyed
    public static layoutResetCallback: () => void = () => (void 0);

    public static init() {
        this._components = [];

        this._layout = new GoldenLayout(configGoldenLayout, "#layoutContainer");
        window.addEventListener("resize", () => this._layout.updateSize());

        this._layout.on("stateChanged", function stateChanged() {
            // const state = JSON.stringify(this._layout.toConfig()
        });

        this._modulesComponent = this.addComponent(ModulesComponent);
        this._consoleComponent = this.addComponent(ConsoleComponent);
        this._cameraComponent = this.addComponent(CameraComponent);

        this._layout.init();
    }

    public static addComponent<T extends BaseComponent>(ctor: (new (...args: any) => T), ...args: any): T {
        const component = new ctor(...args);
        this._components.push(component);
        this._layout.registerComponent(ctor.name, function(container, state) {
            component.init(container);
        });
        return component;
    }

    public static layout() {
        return this._layout;
    }

    public static update() {
        this._components.forEach(value => void value.update());
    }

    public static reset() {

        const saveComponents = ["ModulesComponent", "CameraComponent", "ConsoleComponent"];
        this._layout.root.getItemsByType("component")
            .filter(a => !saveComponents.includes((a.config as any).componentName))
            .forEach(a => a.remove());
        const componentNames = Object.keys((LayoutManager._layout as any)._components)
            .filter(a => !["lm-react-component", ...saveComponents].includes(a));
        for (const componentName of componentNames) {
            delete (LayoutManager._layout as any)._components[componentName];
        }
        this.layoutResetCallback();
        this.layoutResetCallback = () => (void 0);

        this._components.forEach(value => void value.reset());
    }

    public static modulesComponent() {
        return this._modulesComponent;
    }

    public static consoleComponent() {
        return this._consoleComponent;
    }

    public static cameraComponent() {
        return this._cameraComponent;
    }
}
