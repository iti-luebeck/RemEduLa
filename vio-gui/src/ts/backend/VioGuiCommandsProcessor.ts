import * as Serial from "./serial";
import * as TCF from "./tcf";

import VioGuiCommands from '../core/VioGuiCommands';

function error(message: string, defaultValue?: any) {
    const errorMsg = { error: true, message, default: defaultValue } as const
    return Promise.resolve(errorMsg);

}


export default function VioGuiCommandProcessor(): VioGuiCommands {
    return {
        async serialGetPortInfos() {
            return Serial.getPortInfos();
        },

        async serialOpen(args) {
            Serial.open(args.path);
            return true;
        },

        async serialClose(args) {
            return Serial.close(args.path);
        },

        async serialSend(args) {
            return Serial.send(args.path, args.data);
        },

        async serialSetBreak(args) {
            return Serial.setBreak(args.path);
        },

        async getStreamUrl(args) {
            return "ws://" +process.env.VIOGUI_STREAM_SERVER_HOST+ ":"+process.env.VIOGUI_STREAM_SERVER_PORT+"/stream/" + args.deviceName;
        },
        
        async getHwServerAddr(args) {
            return process.env.VIOGUI_HW_SERVER_HOST+ ":"+process.env.VIOGUI_HW_SERVER_PORT;
        },

        async getDeviceInfos(args) {
            return TCF.getDeviceInfos();
        },

        async getDeviceInfo(args) {
            if (!await TCF.isDeviceNameValid(args.deviceName)) 
                return error(`Could not find device with the name ${args.deviceName}` );

            return TCF.getDeviceInfo(args.deviceName);
        },
        
        async getXsdbSlaveIndex(args) {
            if (!await TCF.isDeviceNameValid(args.deviceName)) 
                return error(`Could not find device with the name ${args.deviceName}` );
            if (!await TCF.isJtagIndexValid(args.deviceName, args.jtagIndex)) 
                return error(`Could not find jtag interface with the name ${args.deviceName}:${args.jtagIndex}` );

            return TCF.getXsdbSlaveIndex(args.deviceName, args.jtagIndex, args.vioIdentifier, args.vioIndex);
        },

        async getPortSizes(args) {
            if (!await TCF.isDeviceNameValid(args.deviceName)) 
                return error(`Could not find device with the name ${args.deviceName}` );
            if (!await TCF.isJtagIndexValid(args.deviceName, args.jtagIndex)) 
                return error(`Could not find jtag interface with the name ${args.deviceName}:${args.jtagIndex}` );
            if (!await TCF.isXsdbIndexValid(args.deviceName, args.jtagIndex, args.xsdbIndex)) 
                return error(`Could not find xsdb interface with the name ${args.deviceName}:${args.jtagIndex}:${args.xsdbIndex}` );

            return TCF.getPortSizes(args.deviceName, args.jtagIndex, args.xsdbIndex);
        },

        async readInputState(args) {
            if (!await TCF.isDeviceNameValid(args.deviceName)) 
                return error(`Could not find device with the name ${args.deviceName}` );
            if (!await TCF.isJtagIndexValid(args.deviceName, args.jtagIndex)) 
                return error(`Could not find jtag interface with the name ${args.deviceName}:${args.jtagIndex}` );
            if (!await TCF.isXsdbIndexValid(args.deviceName, args.jtagIndex, args.xsdbIndex)) 
                return error(`Could not find xsdb interface with the name ${args.deviceName}:${args.jtagIndex}:${args.xsdbIndex}` );

            return TCF.readInputState(args.deviceName, args.jtagIndex, args.xsdbIndex);
        },

        async writeOutputState(args) {
            if (!await TCF.isDeviceNameValid(args.deviceName)) 
                return error(`Could not find device with the name ${args.deviceName}` );
            if (!await TCF.isJtagIndexValid(args.deviceName, args.jtagIndex)) 
                return error(`Could not find jtag interface with the name ${args.deviceName}:${args.jtagIndex}` );
            if (!await TCF.isXsdbIndexValid(args.deviceName, args.jtagIndex, args.xsdbIndex)) 
                return error(`Could not find xsdb interface with the name ${args.deviceName}:${args.jtagIndex}:${args.xsdbIndex}` );

            await TCF.writeOutputState(args.deviceName, args.jtagIndex, args.xsdbIndex, args.portIndex, args.values);
            return true;
        },

        async readOutputState(args) {
            if (!await TCF.isDeviceNameValid(args.deviceName)) 
                return error(`Could not find device with the name ${args.deviceName}` );
            if (!await TCF.isJtagIndexValid(args.deviceName, args.jtagIndex)) 
                return error(`Could not find jtag interface with the name ${args.deviceName}:${args.jtagIndex}` );
            if (!await TCF.isXsdbIndexValid(args.deviceName, args.jtagIndex, args.xsdbIndex)) 
                return error(`Could not find xsdb interface with the name ${args.deviceName}:${args.jtagIndex}:${args.xsdbIndex}` );
            
            return TCF.readOutputState(args.deviceName, args.jtagIndex, args.xsdbIndex, args.portIndex);
        },
    };
}
