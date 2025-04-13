import React, { useState, useEffect } from "react";
import { Download, Sun, Moon } from "lucide-react";

const voices = ["Male - Deep", "Female - Soft", "British Accent", "American Accent"];
const sampleScript = [
  "Welcome to AI Debates, where we explore opposing viewpoints.",
  "Margraet: I believe technological innovation is primarily beneficial.",
  "Jemma: But unchecked innovation can deepen inequality.",
  "Let’s dive into this critical discussion."
];

export default function AIDebatesUI() {
  const [prompt, setPrompt] = useState("");
  const [hostVoice, setHostVoice] = useState(voices[0]);
  const [guestVoice, setGuestVoice] = useState(voices[1]);
  const [margraetLeaning, setMargraetLeaning] = useState(50);
  const [jemmaLeaning, setJemmaLeaning] = useState(50);
  const [script, setScript] = useState(sampleScript);
  const [audioUrl, setAudioUrl] = useState("/sample.mp3");
  const [darkMode, setDarkMode] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);

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

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-b from-white via-blue-50 to-indigo-100 text-gray-900"} font-sans min-h-screen p-6 transition-all`}>
      <style>{`body { font-family: 'Inter', 'Segoe UI', sans-serif; }`}</style>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">AI Debates</h1>
          <button onClick={toggleDarkMode} className="p-2">
            {darkMode ? <Sun /> : <Moon />}
          </button>
        </div>

        <div className="bg-blue-50 dark:bg-gray-800 shadow rounded p-4 space-y-4">
          <h2 className="text-xl font-semibold">Enter your prompt</h2>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your idea here..."
            className="w-full p-3 border border-gray-300 rounded min-h-[100px] text-black"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Margraet Voice</label>
              <select
                value={hostVoice}
                onChange={(e) => setHostVoice(e.target.value)}
                className="w-full p-2 rounded text-black"
              >
                {voices.map((voice) => (
                  <option key={voice}>{voice}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium">Jemma Voice</label>
              <select
                value={guestVoice}
                onChange={(e) => setGuestVoice(e.target.value)}
                className="w-full p-2 rounded text-black"
              >
                {voices.map((voice) => (
                  <option key={voice}>{voice}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium">Margraet Political Leaning</label>
            <input
              type="range"
              min="0"
              max="100"
              value={margraetLeaning}
              onChange={(e) => setMargraetLeaning(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Extreme Left</span><span>Center</span><span>Extreme Right</span>
            </div>
          </div>

          <div>
            <label className="block font-medium">Jemma Political Leaning</label>
            <input
              type="range"
              min="0"
              max="100"
              value={jemmaLeaning}
              onChange={(e) => setJemmaLeaning(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Extreme Left</span><span>Center</span><span>Extreme Right</span>
            </div>
          </div>

          <button onClick={generatePodcast} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Generate Podcast
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded p-4 space-y-4">
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
