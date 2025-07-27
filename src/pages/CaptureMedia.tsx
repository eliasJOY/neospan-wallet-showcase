import React, { useState, useRef, useEffect } from 'react';
import { Camera, Video, Mic, SwitchCamera, Circle, Send, RefreshCw, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CaptureMedia = () => {
  const navigate = useNavigate();
  const [mediaType, setMediaType] = useState(null); // 'image', 'video', or 'audio'
  const [stream, setStream] = useState(null);
  const [capturedMedia, setCapturedMedia] = useState(null); // Blob URL for preview
  const [capturedBlob, setCapturedBlob] = useState(null); // Actual Blob for upload
  const [isRecording, setIsRecording] = useState(false);
  const [facingMode, setFacingMode] = useState('user'); // front/back camera

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [stream]);

  const startStream = async (type) => {
    if (stream) stream.getTracks().forEach(track => track.stop());

    setMediaType(type);
    setCapturedMedia(null);
    recordedChunksRef.current = [];

    const constraints = {
      video: type === 'image' || type === 'video' ? { facingMode } : false,
      audio: type === 'video' || type === 'audio',
    };

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current && (type === 'image' || type === 'video')) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Media device error:", err);
      alert("Could not access media devices.");
    }
  };

  const handleSwitchCamera = () => {
    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
    startStream(mediaType);
  };

  const handleCaptureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0);

      canvas.toBlob((blob) => {
        setCapturedBlob(blob);
        setCapturedMedia(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }, 'image/png');
    }
  };

  const handleStartRecording = () => {
    if (stream) {
      setIsRecording(true);
      recordedChunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const mimeType = mediaType === 'video' ? 'video/webm' : 'audio/webm';
        const blob = new Blob(recordedChunksRef.current, { type: mimeType });
        setCapturedBlob(blob);
        setCapturedMedia(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      };

      mediaRecorderRef.current.start();
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleRetake = () => {
    setCapturedMedia(null);
    setMediaType(null);
  };

  const handleSendToGemini = () => {
    if (capturedBlob) {
      navigate('/gemini-loader', { state: { mediaFile: capturedBlob } });
      handleRetake();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith('image')
        ? 'image'
        : file.type.startsWith('video')
        ? 'video'
        : file.type.startsWith('audio')
        ? 'audio'
        : null;

      if (!type) {
        alert("Unsupported file type");
        return;
      }

      setCapturedBlob(file);
      setCapturedMedia(url);
      setMediaType(type);
    }
  };

  const renderSelection = () => (
    <div className="flex flex-col items-center justify-center gap-6 p-4">
      <h2 className="text-xl font-semibold text-white">Select Media Type</h2>
      <button onClick={() => startStream('image')} className="flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-lg text-white font-bold">
        <Camera /> Capture Image
      </button>
      <button onClick={() => startStream('video')} className="flex items-center gap-2 px-6 py-3 bg-green-600 rounded-lg text-white font-bold">
        <Video /> Record Video
      </button>
      <button onClick={() => startStream('audio')} className="flex items-center gap-2 px-6 py-3 bg-red-600 rounded-lg text-white font-bold">
        <Mic /> Record Audio
      </button>
      <label className="flex items-center gap-2 px-6 py-3 bg-yellow-600 rounded-lg text-white font-bold cursor-pointer">
        <Upload /> Select File
        <input
          type="file"
          accept="image/*,video/*,audio/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>
    </div>
  );

  const renderCapture = () => (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-black">
      {mediaType !== 'audio' && <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />}
      {mediaType === 'audio' && (
        <div className="flex flex-col items-center justify-center h-full text-white">
          <Mic size={128} className={isRecording ? 'text-red-500 animate-pulse' : ''} />
          <p className="mt-4 text-lg">{isRecording ? "Recording..." : "Ready to record audio"}</p>
        </div>
      )}
      <div className="absolute bottom-5 flex w-full items-center justify-around">
        {mediaType === 'image' && <button onClick={handleCaptureImage} className="p-4 bg-white rounded-full"><Circle className="text-gray-700" size={40} /></button>}
        {(mediaType === 'video' || mediaType === 'audio') && (
          isRecording
            ? <button onClick={handleStopRecording} className="p-4 bg-red-500 rounded-full"><Circle size={40} className="text-white" fill="white" /></button>
            : <button onClick={handleStartRecording} className="p-4 bg-white rounded-full"><Circle size={40} className="text-red-500" /></button>
        )}
        {(mediaType === 'image' || mediaType === 'video') && (
          <button onClick={handleSwitchCamera} className="absolute right-5 p-3 bg-gray-700 bg-opacity-50 rounded-full text-white">
            <SwitchCamera size={24} />
          </button>
        )}
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black p-4">
      {mediaType === 'image' && <img src={capturedMedia} alt="Captured" className="max-w-full max-h-[70vh] object-contain" />}
      {mediaType === 'video' && <video src={capturedMedia} controls autoPlay className="max-w-full max-h-[70vh]" />}
      {mediaType === 'audio' && <audio src={capturedMedia} controls autoPlay className="w-full" />}
      <div className="flex gap-4 mt-6">
        <button onClick={handleRetake} className="flex items-center gap-2 px-6 py-3 bg-gray-600 rounded-lg text-white font-bold">
          <RefreshCw /> Retake
        </button>
        <button onClick={handleSendToGemini} className="flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-lg text-white font-bold">
          <Send /> Use Media
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-screen h-screen bg-gray-800 flex items-center justify-center">
      {!mediaType && renderSelection()}
      {mediaType && !capturedMedia && renderCapture()}
      {capturedMedia && renderPreview()}
    </div>
  );
};

export default CaptureMedia;
