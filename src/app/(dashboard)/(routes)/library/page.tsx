"use client";

import { useEffect, useState } from "react";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { CreditDisplay } from "@/components/shared/credit-display";

interface SavedImage {
  id: string;
  url: string;
  prompt: string;
  createdAt: string;
}

const ImageLibrary = () => {
  const [images, setImages] = useState<SavedImage[]>([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchImages = async () => {
      if (!user?.id) return;
      try {
        const response = await fetch(`/api/images?userId=${user.id}`);
        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, [user?.id]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Image Library</h1>
          <p className="text-gray-400">Your collection of AI-generated images</p>
        </div>
        <CreditDisplay />
      </div>

      {images.length === 0 ? (
        <div className="bg-[#1a1b1e] rounded-lg p-20 text-center">
          <ImageIcon className="w-12 h-12 text-purple-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No images yet</h3>
          <p className="text-gray-400 mb-4">Generate your first image to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div key={image.id} className="bg-[#1a1b1e] rounded-lg overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  src={image.url}
                  alt={image.prompt}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <p className="text-gray-300 text-sm line-clamp-2">{image.prompt}</p>
                <p className="text-gray-500 text-xs mt-2">
                  {new Date(image.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageLibrary;
