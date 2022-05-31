clear
cd C:\ffmpeg
while ($true){
    Measure-Command { 
            .\bin\ffmpeg -hwaccel cuvid -hwaccel_output_format cuda -y -f dshow -rtbufsize 1024M -pix_fmt bgr0 -i video="Cam Link Pro HDMI-4" -an `                -filter_complex `                "[0:v]copy[buffer];`                [buffer]split=16[s00][s01][s02][s03][s10][s11][s12][s13][s20][s21][s22][s23][s30][s31][s32][s33];`                [s00]crop=in_w/4:in_h/4:(in_w/4)*0:(in_h/4)*0[v00];`                [s01]crop=in_w/4:in_h/4:(in_w/4)*1:(in_h/4)*0[v01];`                [s02]crop=in_w/4:in_h/4:(in_w/4)*2:(in_h/4)*0[v02];`                [s03]crop=in_w/4:in_h/4:(in_w/4)*3:(in_h/4)*0[v03];`                [s10]crop=in_w/4:in_h/4:(in_w/4)*0:(in_h/4)*1[v10];`                [s11]crop=in_w/4:in_h/4:(in_w/4)*1:(in_h/4)*1[v11];`                [s12]crop=in_w/4:in_h/4:(in_w/4)*2:(in_h/4)*1[v12];`                [s13]crop=in_w/4:in_h/4:(in_w/4)*3:(in_h/4)*1[v13];`                [s20]crop=in_w/4:in_h/4:(in_w/4)*0:(in_h/4)*2[v20];`                [s21]crop=in_w/4:in_h/4:(in_w/4)*1:(in_h/4)*2[v21];`                [s22]crop=in_w/4:in_h/4:(in_w/4)*2:(in_h/4)*2[v22];`                [s23]crop=in_w/4:in_h/4:(in_w/4)*3:(in_h/4)*2[v23];`                [s30]crop=in_w/4:in_h/4:(in_w/4)*0:(in_h/4)*3[v30];`                [s31]crop=in_w/4:in_h/4:(in_w/4)*1:(in_h/4)*3[v31];`                [s32]crop=in_w/4:in_h/4:(in_w/4)*2:(in_h/4)*3[v32];`                [s33]crop=in_w/4:in_h/4:(in_w/4)*3:(in_h/4)*3[v33]" `
                -map '[v00]' -vcodec h264_nvenc -preset fast -pix_fmt yuv420p -r 30 -f mpegts http://141.83.158.230:8000/publish/PYNQ-Id00 `
                -map '[v01]' -vcodec h264_nvenc -preset fast -pix_fmt yuv420p -r 30 -f mpegts http://141.83.158.230:8000/publish/PYNQ-Id01 `
                -map '[v02]' -vcodec h264_nvenc -preset fast -pix_fmt yuv420p -r 30 -f mpegts http://141.83.158.230:8000/publish/PYNQ-Id02 `
                -map '[v03]' -vcodec h264_nvenc -preset fast -pix_fmt yuv420p -r 30 -f mpegts http://141.83.158.230:8000/publish/PYNQ-Id03 `
                -map '[v10]' -vcodec h264_nvenc -preset fast -pix_fmt yuv420p -r 30 -f mpegts http://141.83.158.230:8000/publish/PYNQ-Id10 `
                -map '[v11]' -vcodec h264_nvenc -preset fast -pix_fmt yuv420p -r 30 -f mpegts http://141.83.158.230:8000/publish/PYNQ-Id11 `
                -map '[v12]' -vcodec h264_nvenc -preset fast -pix_fmt yuv420p -r 30 -f mpegts http://141.83.158.230:8000/publish/PYNQ-Id12 `
                -map '[v13]' -vcodec h264_nvenc -preset fast -pix_fmt yuv420p -r 30 -f mpegts http://141.83.158.230:8000/publish/PYNQ-Id13 `
                -map '[v20]' -vcodec h264_nvenc -preset fast -pix_fmt yuv420p -r 30 -f mpegts http://141.83.158.230:8000/publish/PYNQ-Id20 `
                -map '[v21]' -vcodec h264_nvenc -preset fast -pix_fmt yuv420p -r 30 -f mpegts http://141.83.158.230:8000/publish/PYNQ-Id21 `
                -map '[v22]' -vcodec h264_nvenc -preset fast -pix_fmt yuv420p -r 30 -f mpegts http://141.83.158.230:8000/publish/PYNQ-Id22 `
                -map '[v23]' -vcodec h264_nvenc -preset fast -pix_fmt yuv420p -r 30 -f mpegts http://141.83.158.230:8000/publish/PYNQ-Id23 `
                -map '[v30]' -vcodec h264_nvenc -preset fast -pix_fmt yuv420p -r 30 -f mpegts http://141.83.158.230:8000/publish/PYNQ-Id30 `
                -map '[v31]' -vcodec h264_nvenc -preset fast -pix_fmt yuv420p -r 30 -f mpegts http://141.83.158.230:8000/publish/PYNQ-Id31 `
                -map '[v32]' -vcodec h264_nvenc -preset fast -pix_fmt yuv420p -r 30 -f mpegts http://141.83.158.230:8000/publish/PYNQ-Id32 `
                -map '[v33]' -vcodec h264_nvenc -preset fast -pix_fmt yuv420p -r 30 -f mpegts http://141.83.158.230:8000/publish/PYNQ-Id33  
    }
}