cd C:\ffmpeg-4.4-full_build
while ($true){
    Measure-Command {
        Start-Process` 
            .\bin\ffmpeg -hwaccel cuda -y -f dshow -i video="USB3.0 HD Video Capture" `                -an `                -preset ultrafast `                -filter_complex `                "[0:v]split=16[s00][s01][s02][s03][s10][s11][s12][s13][s20][s21][s22][s23][s30][s31][s32][s33];`                [s00]crop=w=960:h=540:x=0:y=0 [v00];`                [s01]crop=w=960:h=540:x=960:y=0 [v01];`                [s02]crop=w=960:h=540:x=1920:y=0 [v02];`                [s03]crop=w=960:h=540:x=2880:y=0 [v03];`                [s10]crop=w=960:h=540:x=0:y=540 [v10];`                [s11]crop=w=960:h=540:x=960:y=540 [v11];`                [s12]crop=w=960:h=540:x=1920:y=540 [v12];`                [s13]crop=w=960:h=540:x=2880:y=540 [v13];`                [s20]crop=w=960:h=540:x=0:y=1080 [v20];`                [s21]crop=w=960:h=540:x=960:y=1080 [v21];`                [s22]crop=w=960:h=540:x=1920:y=1080 [v22];`                [s23]crop=w=960:h=540:x=2880:y=1080 [v23];`                [s30]crop=w=960:h=540:x=0:y=1620 [v30];`                [s31]crop=w=960:h=540:x=960:y=1620 [v31];`                [s32]crop=w=960:h=540:x=1920:y=1620 [v32];`                [s33]crop=w=960:h=540:x=2880:y=1620 [v33]" `
                -map '[v00]' -vcodec h264 -intra  -f mpegts http://141.83.158.230:8000/publish/PYNQ-Id00,`
                -map '[v01]' -vcodec h264 -intra  -f mpegts http://141.83.158.230:8000/publish/PYNQ-Id01,`
                -map '[v02]' -vcodec h264 -intra  -f mpegts http://141.83.158.230:8000/publish/PYNQ-Id02,`
                -map '[v03]' -vcodec h264 -intra  -f mpegts http://141.83.158.230:8000/publish/PYNQ-Id03,`
                -map '[v10]' -vcodec h264 -intra  -f mpegts http://141.83.158.230:8000/publish/PYNQ-Id10,`
                -map '[v11]' -vcodec h264 -intra  -f mpegts http://141.83.158.230:8000/publish/PYNQ-Id11,`
                -map '[v12]' -vcodec h264 -intra  -f mpegts http://141.83.158.230:8000/publish/PYNQ-Id12,`
                -map '[v13]' -vcodec h264 -intra  -f mpegts http://141.83.158.230:8000/publish/PYNQ-Id13,`
                -map '[v20]' -vcodec h264 -intra  -f mpegts http://141.83.158.230:8000/publish/PYNQ-Id20,`
                -map '[v21]' -vcodec h264 -intra  -f mpegts http://141.83.158.230:8000/publish/PYNQ-Id21,`
                -map '[v22]' -vcodec h264 -intra  -f mpegts http://141.83.158.230:8000/publish/PYNQ-Id22,`
                -map '[v23]' -vcodec h264 -intra  -f mpegts http://141.83.158.230:8000/publish/PYNQ-Id23,`
                -map '[v30]' -vcodec h264 -intra  -f mpegts http://141.83.158.230:8000/publish/PYNQ-Id30,`
                -map '[v31]' -vcodec h264 -intra  -f mpegts http://141.83.158.230:8000/publish/PYNQ-Id31,`
                -map '[v32]' -vcodec h264 -intra  -f mpegts http://141.83.158.230:8000/publish/PYNQ-Id32,`
                -map '[v33]' -vcodec h264 -intra  -f mpegts http://141.83.158.230:8000/publish/PYNQ-Id33  
    }
}