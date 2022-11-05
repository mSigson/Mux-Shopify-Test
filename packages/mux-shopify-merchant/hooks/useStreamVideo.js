import {useState, useRef, useCallback} from 'react';

const CAMERA_CONSTRAINTS = {
  audio: true,
  video: {width: 960, height: 540},
};

export const useStreamVideo = ({ socket, onStartStream, onStopStream }) => {
  const [connected, setConnected] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [streaming, setStreaming] = useState(false);

  const inputStreamRef = useRef();
  const videoRef = useRef();
  const mediaRecorderRef = useRef();
  const requestAnimationRef = useRef();

  const enableCamera = async () => {
    inputStreamRef.current = await navigator.mediaDevices.getUserMedia(
      CAMERA_CONSTRAINTS,
    );

    videoRef.current.srcObject = inputStreamRef.current;
    await videoRef.current.play();

    requestAnimationRef.current = requestAnimationFrame(updateCanvas);
    setCameraEnabled(true);
  };

  const updateCanvas = () => {
    if (videoRef.current.ended || videoRef.current.paused) {
      return;
    }

    requestAnimationRef.current = requestAnimationFrame(updateCanvas);
  };

  const stopStreaming = useCallback(async() => {
    // mediaRecorderRef.current.stop();
    setStreaming(false);
    await onStopStream();
  }, [setStreaming, onStopStream]);

  const startStreaming = useCallback(async () => {
    setStreaming(true);

    const videoOutputStream = videoRef.current.captureStream(30); // 30 FPS

    // Let's do some extra work to get audio to join the party.
    // https://hacks.mozilla.org/2016/04/record-almost-everything-in-the-browser-with-mediarecorder/
    const audioStream = new MediaStream();
    const audioTracks = inputStreamRef.current.getAudioTracks();
    audioTracks.forEach(function (track) {
      audioStream.addTrack(track);
    });

    const outputStream = new MediaStream();
    [audioStream, videoOutputStream].forEach(function (s) {
      s.getTracks().forEach(function (t) {
        outputStream.addTrack(t);
      });
    });

    mediaRecorderRef.current = new MediaRecorder(outputStream, {
      mimeType: 'video/webm',
      videoBitsPerSecond: 3000000,
    });

    mediaRecorderRef.current.addEventListener('dataavailable', (e) => {
      socket.send(e.data);
    });

    mediaRecorderRef.current.addEventListener('stop', () => {
      stopStreaming();
      socket.close();
    });

    mediaRecorderRef.current.start(1000);

    await onStartStream();
  }, [socket, onStartStream, stopStreaming]);

  return {
    connected,
    cameraEnabled,
    streaming,
    videoRef,
    setConnected,
    enableCamera,
    startStreaming,
    stopStreaming,
  }
}