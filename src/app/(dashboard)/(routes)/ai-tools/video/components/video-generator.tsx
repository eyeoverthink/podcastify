"use client";

import { useState } from "react";
import { WandSparkles } from "lucide-react";
import { CreditDisplay } from "@/components/shared/credit-display";

const durations = [
  { value: "15", label: "15 seconds" },
  { value: "30", label: "30 seconds" },
  { value: "60", label: "60 seconds" },
];

const styles = [
  { value: "realistic", label: "Realistic" },
  { value: "animated", label: "Animated" },
  { value: "artistic", label: "Artistic" },
  { value: "cinematic", label: "Cinematic" },
];

export default function VideoGenerator() {
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState("15");
  const [style, setStyle] = useState("realistic");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // TODO: Implement video generation logic
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error("Error generating video:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <CreditDisplay cost={10} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Prompt</label>
          <textarea
            placeholder="Describe your video (e.g., A cinematic scene of a sunset over a mountain range)"
            className="w-full h-32 bg-gray-800 text-white rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Duration (seconds)</label>
            <select
              className="w-full bg-gray-800 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            >
              {durations.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Style</label>
            <select
              className="w-full bg-gray-800 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
            >
              {styles.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !prompt}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-4 font-medium hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <div className="flex items-center justify-center gap-2">
            <WandSparkles className="w-5 h-5" />
            Generate Video
          </div>
        </button>
      </form>
    </div>
  );
}
