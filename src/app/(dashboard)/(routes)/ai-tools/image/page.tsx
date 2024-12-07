import { Metadata } from "next";
import ImageStudio from "./components/image-studio";
import { CreditDisplay } from "@/components/shared/credit-display";

export const metadata: Metadata = {
  title: "AI Image Generation - CreativeAI Studio",
  description: "Create stunning images with AI",
};

export default function ImagePage() {
  return (
    <div className="h-full bg-gray-900 text-white">
      <div className="h-full">
        <div className="px-4 lg:px-8">
          <div className="mb-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold">AI Image Generation</h1>
                <p className="text-gray-400 text-lg">
                  Create stunning images with AI
                </p>
              </div>
              <CreditDisplay />
            </div>
          </div>
          <ImageStudio />
        </div>
      </div>
    </div>
  );
}
