
export const single_instance_param = (inUrl: string, outUrl: string) : string[] => [
    "-i", inUrl,
    "-an", 
    "-codec:v", "mpeg1video", 
    "-r", "20", 
    "-f", "mpegts", 
    outUrl
];

export const split3x2_instance_param = (inUrl: string, outUrls: string[]) : string[] => [
    "-i", inUrl,

    "-filter_complex",
    "[0:v]split=6[s0][s1][s2][s3][s4][s5]; "+
    "[s0]crop=w=640:h=360:x=150:y=0   [v0]; "+
    "[s1]crop=w=640:h=360:x=150:y=360 [v1]; "+
    "[s2]crop=w=640:h=360:x=150:y=720 [v2]; "+
    "[s3]crop=w=640:h=360:x=1130:y=0  [v3]; "+
    "[s4]crop=w=640:h=360:x=1130:y=360[v4]; "+
    "[s5]crop=w=640:h=360:x=1130:y=720[v5]",

    ...outUrls.flatMap((_, i) => [
        "-map", `[v${i}]`, 
        "-an", 
        "-codec:v", "mpeg1video", 
        "-r", "20", 
        "-f", "mpegts", 
        outUrls[i],
    ]),
];
