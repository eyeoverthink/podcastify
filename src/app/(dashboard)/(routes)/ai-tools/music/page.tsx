"use client";

import { Music } from "lucide-react";
import { MusicStudio } from "./components/music-studio";

export default function MusicPage() {
  return (
    <div className="h-full p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="p-2 w-fit rounded-md bg-emerald-500/10">
            <Music className="w-10 h-10 text-emerald-500" />
          </div>
          <div className="ml-4">
            <h2 className="text-2xl font-bold">AI Music Generation</h2>
            <p className="text-sm text-muted-foreground">
              Turn your ideas into music using AI
            </p>
          </div>
        </div>
      </div>
      <div className="px-4 lg:px-8">
        <MusicStudio />
      </div>
    </div>
  );
}
