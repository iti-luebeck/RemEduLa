export const enum LogLevel {
    ANY,
    TRACE,
    DEBUG,
    INFO,
    WARN,
    ERROR,
    FATAL
}

type LoggerCallback = (logLevel: LogLevel, tag: string, message?: any, ...optionalParams: any[]) => void;

class Logger {
    private static logToConsole: boolean = true;
    private static logLevel: LogLevel = LogLevel.WARN;
    private static callback: LoggerCallback = () => void 0;

    private static formatParam(message?: any, ...optionalParams: any[]): string {
        return message + optionalParams.join(" ") ?? "";
    }

    public static setLogLevel(level: LogLevel) {
        Logger.logLevel = level;
    }

    public static setLogToConsole(logToConsole: boolean) {
        Logger.logToConsole = logToConsole;
    }

    public static setCallback(callback: LoggerCallback) {
        Logger.callback = callback;
    }

    public static print(message: string): void {
        if (Logger.logToConsole) {
            console.log(message);
        }
        this.callback(LogLevel.ANY, "", message);
    }

    public static trace(tag: string, message?: any, ...optionalParams: any[]): void {
        if (Logger.logLevel <= LogLevel.TRACE) {
            if (Logger.logToConsole) {
                console.log(`[TRACE] ${tag}:`, message, ...optionalParams);
            }
            this.callback(LogLevel.TRACE, tag, message, ...optionalParams);
        }
    }

    public static debug(tag: string, message?: any, ...optionalParams: any[]): void {
        if (Logger.logLevel <= LogLevel.DEBUG) {
            if (Logger.logToConsole) {
                console.log(`[DEBUG] ${tag}:`, message, ...optionalParams);
            }
            this.callback(LogLevel.DEBUG, tag, message, ...optionalParams);
        }
    }

    public static info(tag: string, message?: any, ...optionalParams: any[]): void {
        if (Logger.logLevel <= LogLevel.INFO) {
            if (Logger.logToConsole) {
                console.log(`[INFO]  ${tag}:`, message, ...optionalParams);
            }
            this.callback(LogLevel.INFO, tag, message, ...optionalParams);
        }
    }

    public static warn(tag: string, message?: any, ...optionalParams: any[]): void {
        if (Logger.logLevel <= LogLevel.WARN) {
            if (Logger.logToConsole) {
                console.warn(`[WARN]  ${tag}:`, message, ...optionalParams);
            }
            this.callback(LogLevel.WARN, tag, message, ...optionalParams);
        }
    }

    public static error(tag: string, message?: any, ...optionalParams: any[]): void {
        if (Logger.logLevel <= LogLevel.ERROR) {
            if (Logger.logToConsole) {
                console.error(`[ERROR] ${tag}:`, message, ...optionalParams);
            }
            this.callback(LogLevel.ERROR, tag, message, ...optionalParams);
        }
    }

    public static fatal(tag: string, message?: any, ...optionalParams: any[]): Error {
        if (Logger.logToConsole) {
            console.error(`[FATAL] ${tag}:`, message, ...optionalParams);
        }
        this.callback(LogLevel.FATAL, tag, message, ...optionalParams);
        return new Error(`[FATAL] ${tag}: ${Logger.formatParam(message, ...optionalParams)}`);
    }
}

export default Logger;
