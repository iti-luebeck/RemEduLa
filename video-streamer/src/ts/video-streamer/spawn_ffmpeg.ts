import { spawn } from 'child_process';

let procs : any[] = [];
let restart_procs = true;

export default function spawn_ffmpeg(...args: string[]) {
    spawn_process("ffmpeg", [
        "-hide_banner",
        "-loglevel", "error",
        "-rtsp_flags", "prefer_tcp",
        ...args
    ]);
}


function spawn_process(command: string, args: string[]) {
    console.log("spawn command", args[6])
    const proc = spawn(command, args, {stdio: 'inherit'});
    procs.push(proc);
    proc.on('exit', (code, signal) => {
        console.log("exit command", code, signal)
        const index = procs.indexOf(proc);
        if (index !== -1) {
            procs.splice(index, 1);
        }
        if (restart_procs === true) {
            spawn_process(command, args);
        }
    })
}

function kill_all_processes() {
    restart_procs = false;
    for (const proc of procs) {
        proc.kill("SIGINT");
    }
    procs = [];
}

// cleanup on exit
[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
    process.on(eventType, () => {
        kill_all_processes();
        // have to do this otherwise the application won't exit
        if (eventType !== "exit") {
            process.exit();
        }
    });
});
