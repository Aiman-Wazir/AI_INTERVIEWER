'use client';

import { useState, useRef } from 'react';

export default function AudioRecorder({ onRecordingComplete }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        if (onRecordingComplete) {
          onRecordingComplete(blob);
        }
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        clearInterval(timerRef.current);
        setRecordingTime(0);
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Please allow microphone access to record audio.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        🎤 Audio Recorder
      </h3>

      <div className="flex items-center space-x-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="flex items-center space-x-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <span className="text-xl">●</span>
            <span>Start Recording</span>
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex items-center space-x-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors animate-pulse"
          >
            <span className="text-xl">■</span>
            <span>Stop Recording</span>
          </button>
        )}

        {isRecording && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
            <span className="text-sm font-medium text-gray-700">
              {formatTime(recordingTime)}
            </span>
          </div>
        )}
      </div>

      {audioURL && (
        <div className="mt-4">
          <audio controls src={audioURL} className="w-full" />
          <button
            onClick={() => {
              setAudioURL(null);
              if (onRecordingComplete) {
                onRecordingComplete(null);
              }
            }}
            className="mt-2 text-sm text-red-500 hover:text-red-700"
          >
            Remove Recording
          </button>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        <p>💡 Record your answer and get AI-powered feedback</p>
      </div>
    </div>
  );
}