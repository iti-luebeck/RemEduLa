import Key from "./KeyManager.key";

export type KeyManagerCallback = (obj: any, key: Key) => void;

export default class KeyManager {

    private static objList: Map<string, Set<any>>;

    public static init() {
        this.objList = new Map();
        for (const key in Key) {
            if (Key.hasOwnProperty(key)) {
                this.objList.set(key, new Set());
            }
        }

        window.addEventListener("keydown", e => this._keyboard_listener.call(KeyManager, e), false);
        window.addEventListener("keyup", e => this._keyboard_listener.call(KeyManager, e), false);

        // Prevent Ctrl+S to trigger the save window
        window.addEventListener("keydown", e => {
            e = e ?? (window.event as KeyboardEvent);
            if (e.ctrlKey && (e.which ?? e.keyCode) === 83) {
                e.preventDefault();
                e.stopPropagation();
            }
        }, false);
    }

    private static _keyboard_listener(event: KeyboardEvent) {
        const down = event.type === "keydown" ? 1 : 0;
        const key = event.code as Key;
        if (this.objList.has(key)) {
            for (const obj of (this.objList.get(key) as Set<any>)) {
                if (down && !event.repeat)
                    (obj.userAttribute.keymanager.keydown as KeyManagerCallback)(obj, key);
                else if (down && event.repeat)
                    (obj.userAttribute.keymanager.keyrepeat as KeyManagerCallback)(obj, key);
                else
                    (obj.userAttribute.keymanager.keyup as KeyManagerCallback)(obj, key);
            }
        }
    }

    public static register(obj: any, key: Key, keydown: KeyManagerCallback, keyup?: KeyManagerCallback, keyrepeat?: KeyManagerCallback) {
        obj.userAttribute = obj.userAttribute ?? {};
        obj.userAttribute.keymanager = obj.userAttribute.keymanager ?? {};
        obj.userAttribute.keymanager.keydown   = keydown;
        obj.userAttribute.keymanager.keyup     = keyup ?? (() => void 0);
        obj.userAttribute.keymanager.keyrepeat = keyrepeat ?? (() => void 0);

        (this.objList.get(key) as Set<any>).add(obj);
    }

    public static unregister(obj: any) {
        for (const [key, list] of this.objList) {
            if (list.has(obj)) {
                list.delete(obj);
            }
        }
    }

    public static clear() {
        for (const [key, list] of this.objList) {
            list.clear();
        }
    }
}
