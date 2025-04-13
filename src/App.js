import React, { useState, useEffect, useRef } from "react";
import { Download, Sun, Moon, Mic, Square } from "lucide-react";

const defaultVoices = ["Male - Deep", "Female - Soft", "British Accent", "American Accent"];
const sampleScript = [
  "Welcome to PodGenie, where we explore opposing viewpoints.",
  "Host: I believe technological innovation is primarily beneficial.",
  "Guest: But unchecked innovation can deepen inequality.",
  "Let’s dive into this critical discussion."
];

export default function AIDebatesUI() {
  const [prompt, setPrompt] = useState("");
  const [hostVoice, setHostVoice] = useState(defaultVoices[0]);
  const [guestVoice, setGuestVoice] = useState(defaultVoices[1]);
  const [hostRecording, setHostRecording] = useState(null);
  const [guestRecording, setGuestRecording] = useState(null);
  const [script, setScript] = useState(sampleScript);
  const [audioUrl, setAudioUrl] = useState("/sample.mp3");
  const [currentLine, setCurrentLine] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [isRecording, setIsRecording] = useState(null);
  const [recordingStartTime, setRecordingStartTime] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);

  useEffect(() => {
    let timer;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingDuration(Math.floor((Date.now() - recordingStartTime) / 1000));
      }, 500);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRecording, recordingStartTime]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleAudioTimeUpdate = (e) => {
    const currentTime = e.target.currentTime;
    const segmentDuration = 3;
    setCurrentLine(Math.floor(currentTime / segmentDuration));
  };

  const generatePodcast = () => {
    setScript(sampleScript);
    setAudioUrl("/sample.mp3");
    setCurrentLine(0);
  };

  const startRecording = (role) => {
    setIsRecording(role);
    setRecordingStartTime(Date.now());
    setRecordingDuration(0);
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const audioURL = URL.createObjectURL(blob);
        if (role === "host") setHostRecording(audioURL);
        if (role === "guest") setGuestRecording(audioURL);
        chunksRef.current = [];
      };
      mediaRecorderRef.current.start();
    });
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(null);
    setRecordingStartTime(null);
  };

  const renderVoiceSection = (role, label, selectedVoice, setSelectedVoice, recording, setRecording) => (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">{label}</h3>
      <select
        value={selectedVoice}
        onChange={(e) => setSelectedVoice(e.target.value)}
        className="w-full p-2 rounded text-black"
      >
        {defaultVoices.map((voice) => (
          <option key={voice}>{voice}</option>
        ))}
      </select>
      <div className="flex gap-2 items-center">
        {isRecording === role ? (
          <>
            <button
              onClick={stopRecording}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
            >
              <Square className="w-4 h-4" /> Stop Recording
            </button>
            <span className="text-red-500 font-medium animate-pulse">Recording... {recordingDuration}s</span>
          </>
        ) : (
          <button
            onClick={() => startRecording(role)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
          >
            <Mic className="w-4 h-4 animate-pulse text-white" /> Record Sample
          </button>
        )}
      </div>
      {recording && (
        <div className="mt-2">
          <label className="text-sm text-gray-600">Playback:</label>
          <audio controls src={recording} className="w-full mt-1" />
        </div>
      )}
    </div>
  );

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-b from-white via-blue-50 to-indigo-100 text-gray-900"} font-sans min-h-screen p-6 transition-all`}>
      <style>{`body { font-family: 'Inter', 'Segoe UI', sans-serif; }`}</style>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">PodGenie</h1>
          <button onClick={toggleDarkMode} className="p-2">
            {darkMode ? <Sun /> : <Moon />}
          </button>
        </div>

        <div className={`${darkMode ? "bg-gray-800" : "bg-blue-50"} shadow rounded p-6 space-y-6`}>
          <div>
            <h2 className="text-xl font-semibold mb-2">Enter your prompt</h2>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type your idea here..."
              className="w-full p-3 border border-gray-300 rounded min-h-[100px] text-black"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderVoiceSection("host", "Host Voice", hostVoice, setHostVoice, hostRecording, setHostRecording)}
            {renderVoiceSection("guest", "Guest Voice", guestVoice, setGuestVoice, guestRecording, setGuestRecording)}
          </div>

          <button onClick={generatePodcast} className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700">
            Generate Podcast
          </button>
        </div>

        <div className={`${darkMode ? "bg-gray-800" : "bg-white"} shadow rounded p-4 space-y-4`}>
          <h3 className="text-lg font-semibold">Generated Script</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {script.map((line, index) => (
              <p key={index} className={`transition-colors ${index === currentLine ? "bg-yellow-200 font-semibold" : ""}`}>
                {line}
              </p>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => document.getElementById('audio-player').play()} className="w-12 h-12 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6 4l10 6-10 6V4z" />
              </svg>
            </button>
            <audio id="audio-player" controls src={audioUrl} onTimeUpdate={handleAudioTimeUpdate} className="hidden"></audio>
            <a href={audioUrl} download>
              <button className="px-4 py-2 border rounded flex items-center gap-2">
                <Download className="w-4 h-4" /> Download
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
