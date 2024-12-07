"use client";

import { useState, useRef } from "react";
import { Book, Upload, Download, Mic, PlayCircle, PauseCircle, Plus, Edit3, Wand2, Save } from "lucide-react";
import { CreditDisplay } from "@/components/shared/credit-display";
import Link from "next/link";

interface Chapter {
  id: string;
  title: string;
  content: string;
  audioUrl?: string;
}

const voiceOptions = [
  { value: "alloy", label: "Alloy" },
  { value: "echo", label: "Echo" },
  { value: "fable", label: "Fable" },
  { value: "onyx", label: "Onyx" },
  { value: "nova", label: "Nova" },
  { value: "shimmer", label: "Shimmer" },
];

export default function AudiobookGenerator() {
  const [chapters, setChapters] = useState<Chapter[]>([{ id: "1", title: "Chapter 1", content: "" }]);
  const [selectedChapter, setSelectedChapter] = useState<Chapter>(chapters[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState("alloy");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/audiobook/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to transcribe file");

      const { text } = await response.json();
      setSelectedChapter({ ...selectedChapter, content: text });
      updateChapter({ ...selectedChapter, content: text });
    } catch (error) {
      console.error("Error transcribing file:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        const formData = new FormData();
        formData.append("audio", audioBlob);

        try {
          const response = await fetch("/api/audiobook/transcribe", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) throw new Error("Failed to transcribe audio");

          const { text } = await response.json();
          setSelectedChapter({ ...selectedChapter, content: text });
          updateChapter({ ...selectedChapter, content: text });
        } catch (error) {
          console.error("Error transcribing audio:", error);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const generateAudio = async () => {
    if (!selectedChapter.content) return;
    setIsProcessing(true);

    try {
      const response = await fetch("/api/audiobook/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: selectedChapter.content,
          voice: selectedVoice,
          chapterId: selectedChapter.id,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate audio");

      const { audioUrl } = await response.json();
      setSelectedChapter({ ...selectedChapter, audioUrl });
      updateChapter({ ...selectedChapter, audioUrl });
    } catch (error) {
      console.error("Error generating audio:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const updateChapter = (updatedChapter: Chapter) => {
    setChapters(chapters.map(ch => 
      ch.id === updatedChapter.id ? updatedChapter : ch
    ));
  };

  const addChapter = () => {
    const newChapter = {
      id: (chapters.length + 1).toString(),
      title: `Chapter ${chapters.length + 1}`,
      content: "",
    };
    setChapters([...chapters, newChapter]);
    setSelectedChapter(newChapter);
  };

  const handleAIAssist = async () => {
    if (!selectedChapter.content) return;
    setIsProcessing(true);

    try {
      const response = await fetch("/api/audiobook/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: selectedChapter.content }),
      });

      if (!response.ok) throw new Error("Failed to enhance content");

      const { enhancedContent } = await response.json();
      setSelectedChapter({ ...selectedChapter, content: enhancedContent });
      updateChapter({ ...selectedChapter, content: enhancedContent });
    } catch (error) {
      console.error("Error enhancing content:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      <div className="flex items-center justify-between mb-8">
        <Link href="/dashboard" className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition">
          <Book className="w-8 h-8" />
          <span className="text-xl font-semibold">CreativeAI Studio</span>
        </Link>
        <CreditDisplay cost={10} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Chapter List */}
        <div className="col-span-1 bg-gray-800/30 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Chapters</h3>
            <button
              onClick={addChapter}
              className="p-2 hover:bg-gray-700 rounded-lg transition"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-2">
            {chapters.map((chapter) => (
              <button
                key={chapter.id}
                onClick={() => setSelectedChapter(chapter)}
                className={`w-full text-left p-2 rounded-lg transition ${
                  selectedChapter.id === chapter.id
                    ? "bg-purple-600 text-white"
                    : "hover:bg-gray-700"
                }`}
              >
                {chapter.title}
              </button>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div className="col-span-3 space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <input
              type="text"
              value={selectedChapter.title}
              onChange={(e) => {
                const updated = { ...selectedChapter, title: e.target.value };
                setSelectedChapter(updated);
                updateChapter(updated);
              }}
              className="bg-gray-800/50 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="bg-gray-800/50 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {voiceOptions.map((voice) => (
                <option key={voice.value} value={voice.value}>
                  {voice.label}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-gray-800/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".txt,.doc,.docx,.pdf"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 hover:bg-gray-700 rounded-lg transition"
                title="Upload File"
              >
                <Upload className="w-5 h-5" />
              </button>
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-2 hover:bg-gray-700 rounded-lg transition ${
                  isRecording ? "text-red-500" : ""
                }`}
                title={isRecording ? "Stop Recording" : "Start Recording"}
              >
                <Mic className="w-5 h-5" />
              </button>
              <button
                onClick={handleAIAssist}
                className="p-2 hover:bg-gray-700 rounded-lg transition"
                title="AI Enhance"
              >
                <Wand2 className="w-5 h-5" />
              </button>
            </div>

            <textarea
              value={selectedChapter.content}
              onChange={(e) => {
                const updated = { ...selectedChapter, content: e.target.value };
                setSelectedChapter(updated);
                updateChapter(updated);
              }}
              className="w-full h-[400px] bg-gray-800/50 text-white rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your chapter content..."
            />

            <div className="flex justify-between mt-4">
              <div className="flex items-center gap-2">
                {selectedChapter.audioUrl && (
                  <button
                    onClick={() => {
                      if (audioRef.current) {
                        if (isPlaying) {
                          audioRef.current.pause();
                        } else {
                          audioRef.current.play();
                        }
                        setIsPlaying(!isPlaying);
                      }
                    }}
                    className="p-2 hover:bg-gray-700 rounded-lg transition"
                  >
                    {isPlaying ? (
                      <PauseCircle className="w-5 h-5" />
                    ) : (
                      <PlayCircle className="w-5 h-5" />
                    )}
                  </button>
                )}
                {selectedChapter.audioUrl && (
                  <audio ref={audioRef} src={selectedChapter.audioUrl} onEnded={() => setIsPlaying(false)} />
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={generateAudio}
                  disabled={isProcessing || !selectedChapter.content}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Mic className="w-4 h-4" />
                  Generate Audio
                </button>
                <button
                  onClick={() => {/* Implement save functionality */}}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  <Save className="w-4 h-4" />
                  Save Project
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
