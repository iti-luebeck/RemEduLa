﻿cd C:\ffmpeg-4.4-full_build
while ($true){
    Measure-Command {
        Start-Process` 
            .\bin\ffmpeg -hwaccel cuda -y -f dshow -i video="USB3.0 HD Video Capture" `
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