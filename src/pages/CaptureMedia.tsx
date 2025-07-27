import React, { useState, useRef, useEffect } from 'react';
import { Camera, Video, Mic, SwitchCamera, Circle, Send, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CaptureMedia = () => {
    const navigate = useNavigate();
    const [mediaType, setMediaType] = useState(null); // 'image', 'video', or 'audio'
    const [stream, setStream] = useState(null);
    // In CaptureMedia component
    const [capturedMedia, setCapturedMedia] = useState(null); // Will hold the Blob URL for preview
    const [capturedBlob, setCapturedBlob] = useState(null); // WILL HOLD THE ACTUAL BLOB FOR UPLOADING
    const [isRecording, setIsRecording] = useState(false);
    const [facingMode, setFacingMode] = useState('user'); // 'user' for front, 'environment' for back camera

    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const recordedChunksRef = useRef([]);

    // Cleanup function to stop media tracks when component unmounts or stream changes
    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    // Request media permissions and start stream
    const startStream = async (type) => {
        // Stop any existing stream before starting a new one
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }

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
            console.error("Error accessing media devices.", err);
            alert("Could not access camera or microphone. Please check permissions.");
        }
    };

    // Switch between front and back camera
    const handleSwitchCamera = () => {
        setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
        // Restart the stream with the new facing mode
        startStream(mediaType);
    };

    // Capture a still image
    // In CaptureMedia component
    const handleCaptureImage = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            canvas.getContext('2d').drawImage(videoRef.current, 0, 0);

            // Use canvas.toBlob() to get the actual file object
            canvas.toBlob((blob) => {
                setCapturedBlob(blob); // Store the raw Blob
                setCapturedMedia(URL.createObjectURL(blob)); // Create a URL just for preview
                stream.getTracks().forEach(track => track.stop());
                setStream(null);
            }, 'image/png');
        }
    };

    // Start recording video or audio
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

            // In CaptureMedia component, inside handleStartRecording
            mediaRecorderRef.current.onstop = () => {
                const mimeType = mediaType === 'video' ? 'video/webm' : 'audio/webm';
                const blob = new Blob(recordedChunksRef.current, { type: mimeType });

                setCapturedBlob(blob); // Store the raw Blob
                setCapturedMedia(URL.createObjectURL(blob)); // Create a URL just for preview

                stream.getTracks().forEach(track => track.stop());
                setStream(null);
            };

            mediaRecorderRef.current.start();
        }
    };

    // Stop recording
    const handleStopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    // Reset state to capture again
    const handleRetake = () => {
        setCapturedMedia(null);
        setMediaType(null);
    };

    // Placeholder for sending media to Gemini
    // In CaptureMedia component
    const handleSendToGemini = () => {
        if (capturedBlob) {
            // Pass the actual Blob object, NOT the capturedMedia string
            navigate('/gemini-loader', { state: { mediaFile: capturedBlob } });
            handleRetake();
        }
    };

    // Renders the initial buttons to select media type
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
        </div>
    );

    // Renders the preview/capture interface
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
                {mediaType === 'video' || mediaType === 'audio' ? (
                    isRecording ?
                        <button onClick={handleStopRecording} className="p-4 bg-red-500 rounded-full"><Circle size={40} className="text-white" fill="white" /></button> :
                        <button onClick={handleStartRecording} className="p-4 bg-white rounded-full"><Circle size={40} className="text-red-500" /></button>
                ) : null}
                {mediaType === 'image' || mediaType === 'video' ? (
                    <button onClick={handleSwitchCamera} className="absolute right-5 p-3 bg-gray-700 bg-opacity-50 rounded-full text-white">
                        <SwitchCamera size={24} />
                    </button>
                ) : null}
            </div>
        </div>
    );

    // Renders the captured media for review
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