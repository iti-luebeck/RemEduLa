﻿clear
cd C:\ffmpeg

.\bin\ffmpeg -hwaccel cuvid -hwaccel_output_format cuda -y -f dshow -rtbufsize 1024M -pix_fmt bgr0 -i video="Cam Link Pro HDMI-4" -an `
-map [v00] -vcodec h264_nvenc -r 30 -preset fast -f mpegts http://141.83.158.230:8000/publish/PYNQ-Id00