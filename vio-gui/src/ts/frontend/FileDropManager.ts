import Logger from "../core/Logger";

export type FileUploadedCallback = (files: File[]) => void;

export default class FileDropManager {

    public static onFileUploaded: FileUploadedCallback;

    public static init() {
        // Prevent default drag behaviors
        ["dragenter", "dragover", "dragleave", "drop", "dragstart"].forEach(eventName => {
            document.body.addEventListener(eventName, (e: Event) => e.preventDefault(), true);
        });

        // Highlight drop area when item is dragged over it
        ["dragenter", "dragover"].forEach(eventName => {
            document.body.addEventListener(eventName, () => document.body.classList.add("drop-highlight"), false);
        });

        ["dragleave", "drop"].forEach(eventName => {
            document.body.addEventListener(eventName, () => document.body.classList.remove("drop-highlight"), false);
        });

        // Handle dropped files
        document.body.addEventListener("drop", (e: DragEvent) => {
            const files: File[] = [];

            if (e.dataTransfer !== null) {
                // tslint:disable-next-line: prefer-for-of
                for (let i = 0; i < e.dataTransfer.files.length; i++) {
                    const file = e.dataTransfer.files[i];
                    if (file.name.length > 4 && (file.name.endsWith(".asm") || file.name.endsWith(".js") || file.name.endsWith(".bin"))) {
                        files.push(file);
                    }
                }
                // Logger.log("FileDropManager", e.dataTransfer.files, files);
            }

            if (this.onFileUploaded !== undefined) {
                this.onFileUploaded.call(null, files);
            } else {
                Logger.warn("FileDropManager", "Files where uploaded without defining onFileUploaded callback!");
            }
        }, false);
    }

    public static readAsText(file: File, onDone: (content: string) => void) {
        const reader = new FileReader();
        reader.onload = () => onDone(reader.result as string);
        reader.readAsText(file);
    }

    public static loadFiles(files: File[], onDone: (contents: string[]) => void) {
        let filesDone = 0;
        const contents: string[] = [];
        files = [...files];
        for (const file of files) {
            FileDropManager.readAsText(file, content => {
                contents.push(content);
                if (++filesDone === files.length)
                    onDone(contents);
            });
        }
    }
}
