import { Server } from 'Socket.IO';
import child_process from "child_process";

export default function handler(req, res) {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on('connection', socket => {    
      const rtmpUrl = `rtmps://global-live.mux.com:443/app/${process.env.MUX_STREAM_KEY}`;
    
      const ffmpeg = child_process.spawn('ffmpeg', [
        '-i',
        '-',
    
        // video codec config: low latency, adaptive bitrate
        '-c:v',
        'libx264',
        '-preset',
        'veryfast',
        '-tune',
        'zerolatency',
    
        // audio codec config: sampling frequency (11025, 22050, 44100), bitrate 64 kbits
        '-c:a',
        'aac',
        '-strict',
        '-2',
        '-ar',
        '44100',
        '-b:a',
        '64k',
    
        //force to overwrite
        '-y',
    
        // used for audio sync
        '-use_wallclock_as_timestamps',
        '1',
        '-async',
        '1',
    
        //'-filter_complex', 'aresample=44100', // resample audio to 44100Hz, needed if input is not 44100
        //'-strict', 'experimental',
        '-bufsize',
        '1000',
        '-f',
        'flv',
    
        rtmpUrl,
      ]);
    
      // Kill the WebSocket connection if ffmpeg dies.
      ffmpeg.on('close', (code, signal) => {
        console.log(
          'FFmpeg child process closed, code ' + code + ', signal ' + signal,
        );
        // socket.terminate();
      });
    
      // Handle STDIN pipe errors by logging to the console.
      // These errors most commonly occur when FFmpeg closes and there is still
      // data to write.f If left unhandled, the server will crash.
      ffmpeg.stdin.on('error', (e) => {
        console.log('FFmpeg STDIN Error', e);
      });
    
      // FFmpeg outputs all of its messages to STDERR. Let's log them to the console.
      ffmpeg.stderr.on('data', (data) => {
        socket.send('ffmpeg got some data');
        console.log('FFmpeg STDERR:', data.toString());
      });
    
      socket.on('message', (msg) => {
        if (Buffer.isBuffer(msg)) {
          console.log('this is some video data');
          ffmpeg.stdin.write(msg);
        } else {
          console.log(msg);
        }
      });
    
      socket.on('close', () => {
        console.log('socket closed');
        ffmpeg.kill('SIGINT');
      });
    });
  }

  res.end()
}
