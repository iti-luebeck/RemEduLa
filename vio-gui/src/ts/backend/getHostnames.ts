import { networkInterfaces } from 'os';

export default function getHostnames() {
    const nets = networkInterfaces();
    const hostnames: string[] = [];
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]!) {
            if (net.family === 'IPv4' && !net.internal) {
                hostnames.push(net.address);
            }
        }
    }
    return hostnames;
}
