import spawn_ffmpeg from "./spawn_ffmpeg";
import { single_instance_param } from "./ffmpeg_param";
import { split3x2_instance_param } from "./ffmpeg_param";

export function start(streamBaseUrl: string) {

    spawn_ffmpeg(...single_instance_param( 
        "rtsp://ip-camera:1337/ID_CAM_ID_1", 
        streamBaseUrl + "jsn-Basys3-XXXXXXXXXXXXA"
    ));
    
    spawn_ffmpeg(...split3x2_instance_param(
        "rtsp://ip-camera:1337/ID_CAM_ID_2", [
            streamBaseUrl + "jsn-Basys3-XXXXXXXXXX0A",
            streamBaseUrl + "jsn-Basys3-XXXXXXXXXX1A",
            streamBaseUrl + "jsn-Basys3-XXXXXXXXXX2A",
            streamBaseUrl + "jsn-Basys3-XXXXXXXXXX3A",
            streamBaseUrl + "jsn-Basys3-XXXXXXXXXX4A",
            streamBaseUrl + "jsn-Basys3-XXXXXXXXXX5A"
        ]
    ));
}
