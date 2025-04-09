import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
  const [margraetLeaning, setMargraetLeaning] = useState([50]);
  const [jemmaLeaning, setJemmaLeaning] = useState([50]);
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
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"} min-h-screen p-6 transition-all`}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">AI Debates</h1>
          <Button variant="ghost" onClick={toggleDarkMode}>
            {darkMode ? <Sun /> : <Moon />}
          </Button>
        </div>

        <Card>
          <CardContent className="space-y-4 p-4">
            <h2 className="text-xl font-semibold">Enter your prompt</h2>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type your idea here..."
              className="min-h-[100px]"
            />

            <div className="space-y-2">
              <label className="block font-medium">Margraet Voice</label>
              <select
                value={hostVoice}
                onChange={(e) => setHostVoice(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                {voices.map((voice) => (
                  <option key={voice} value={voice}>{voice}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block font-medium">Jemma  Voice</label>
              <select
                value={guestVoice}
                onChange={(e) => setGuestVoice(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                {voices.map((voice) => (
                  <option key={voice} value={voice}>{voice}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block font-medium">Margraet Political Leaning</label>
              <Slider
                min={0}
                max={100}
                value={margraetLeaning}
                onValueChange={setMargraetLeaning}
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>Extreme Left</span>
                <span>Center</span>
                <span>Extreme Right</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-medium">Jemma Political Leaning</label>
              <Slider
                min={0}
                max={100}
                value={jemmaLeaning}
                onValueChange={setJemmaLeaning}
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>Extreme Left</span>
                <span>Center</span>
                <span>Extreme Right</span>
              </div>
            </div>

            <Button onClick={generatePodcast} className="w-full">
              Generate Podcast
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="text-lg font-semibold">Generated Script</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {script.map((line, index) => (
                <p key={index} className={`transition-colors ${index === currentLine ? "bg-yellow-200 font-semibold" : ""}`}>
                  {line}
                </p>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={() => document.getElementById('audio-player').play()} className="w-12 h-12 rounded-full bg-green-600 hover:bg-green-700 flex items-center justify-center shadow-lg">
  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
    <path d="M6 4l10 6-10 6V4z" />
  </svg>
</Button>
<audio id="audio-player" controls src={audioUrl} onTimeUpdate={handleAudioTimeUpdate} className="hidden"></audio>
              <a href={audioUrl} download>
                <Button variant="outline"><Download className="mr-2" />Download</Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
