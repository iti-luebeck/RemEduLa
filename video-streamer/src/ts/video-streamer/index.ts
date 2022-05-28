import {start as startVideoStreamServer} from './video_streamer';
import {start as startFfmpegInstances} from './start_ffmpeg'

const STREAM_SECRET = process.env.STREAM_SECRET  || "SECRET";
const STREAM_PORT   = parseInt(process.env.STREAM_PORT!) || 8081;
const STREAM_BASE_URL =  `http://localhost:${STREAM_PORT}/${STREAM_SECRET}/`

startVideoStreamServer(STREAM_SECRET, STREAM_PORT);
startFfmpegInstances(STREAM_BASE_URL);
