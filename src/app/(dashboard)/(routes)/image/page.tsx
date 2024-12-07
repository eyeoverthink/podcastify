"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageIcon, Loader } from "lucide-react";
import Image from "next/image";
import { CreditDisplay } from "@/components/shared/credit-display";

export default function ImagePage() {
  const [imagePrompt, setImagePrompt] = useState("");
  const [image, setImage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  const generateImage = async () => {
    if (!imagePrompt.trim()) {
      return toast({
        title: "Please provide a prompt to generate an image",
        variant: "destructive",
      });
    }

    try {
      setIsGenerating(true);
      const response = await fetch("/api/image/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: imagePrompt,
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const data = await response.json();
      setImage(data.imageUrl);
      
      toast({
        title: "Image generated successfully",
        description: "Your image has been saved to your library",
      });
    } catch (error: any) {
      toast({
        title: "Error generating image",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">AI Image Generator</h1>
          <p className="text-gray-400">Transform your ideas into stunning images</p>
        </div>
        <CreditDisplay cost={1} />
      </div>

      <div className="bg-[#1a1b1e] rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <Label className="text-gray-300">Image Description</Label>
            <Textarea 
              placeholder="Describe the image you want to generate..."
              className="mt-2 bg-gray-900 border-gray-800 text-white placeholder:text-gray-400"
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              rows={5}
            />
          </div>

          <div className="flex justify-end">
            <Button
              onClick={generateImage}
              disabled={isGenerating || !imagePrompt.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isGenerating ? (
                <>
                  Generating
                  <Loader className="w-4 h-4 ml-2 animate-spin" />
                </>
              ) : (
                <>
                  Generate Image
                  <ImageIcon className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>

        {image && (
          <div className="mt-8">
            <div className="relative aspect-square max-w-2xl mx-auto rounded-lg overflow-hidden">
              <Image
                src={image}
                alt={imagePrompt}
                fill
                className="object-cover"
                priority
              />
            </div>
            <p className="mt-4 text-sm text-gray-400 text-center">
              {imagePrompt}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
