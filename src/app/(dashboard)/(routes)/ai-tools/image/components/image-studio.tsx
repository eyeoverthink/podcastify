"use client";

import { useState, useRef } from "react";
import { 
  Image as ImageIcon, 
  Upload, 
  Download, 
  Wand2, 
  Save, 
  Link as LinkIcon,
  Layers,
  Palette,
  Scissors,
  Eraser,
  Move,
  RotateCw,
  ZoomIn,
  Settings,
  Plus,
  Trash
} from "lucide-react";
import { CreditDisplay } from "@/components/shared/credit-display";
import Link from "next/link";

interface Layer {
  id: string;
  name: string;
  type: "image" | "ai" | "effect";
  content: string;
  visible: boolean;
  opacity: number;
}

interface Tool {
  id: string;
  name: string;
  icon: React.ReactNode;
  action: () => void;
}

export default function ImageStudio() {
  const [prompt, setPrompt] = useState("");
  const [layers, setLayers] = useState<Layer[]>([]);
  const [selectedLayer, setSelectedLayer] = useState<Layer | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<"generate" | "edit" | "download">("generate");
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const tools: Tool[] = [
    { id: "move", name: "Move", icon: <Move className="w-5 h-5" />, action: () => setSelectedTool("move") },
    { id: "crop", name: "Crop", icon: <Scissors className="w-5 h-5" />, action: () => setSelectedTool("crop") },
    { id: "erase", name: "Erase", icon: <Eraser className="w-5 h-5" />, action: () => setSelectedTool("erase") },
    { id: "rotate", name: "Rotate", icon: <RotateCw className="w-5 h-5" />, action: () => setSelectedTool("rotate") },
    { id: "zoom", name: "Zoom", icon: <ZoomIn className="w-5 h-5" />, action: () => setSelectedTool("zoom") },
    { id: "settings", name: "Adjust", icon: <Settings className="w-5 h-5" />, action: () => setSelectedTool("settings") },
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const newLayer: Layer = {
        id: Date.now().toString(),
        name: file.name,
        type: "image",
        content: e.target?.result as string,
        visible: true,
        opacity: 100,
      };
      setLayers([...layers, newLayer]);
      setSelectedLayer(newLayer);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlDownload = async (url: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/image/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) throw new Error("Failed to download image");

      const data = await response.json();
      const newLayer: Layer = {
        id: Date.now().toString(),
        name: "Downloaded Image",
        type: "image",
        content: data.imageUrl,
        visible: true,
        opacity: 100,
      };
      setLayers([...layers, newLayer]);
      setSelectedLayer(newLayer);
    } catch (error) {
      console.error("Error downloading image:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateImage = async () => {
    if (!prompt) return;
    setIsProcessing(true);

    try {
      const response = await fetch("/api/image/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error("Failed to generate image");

      const data = await response.json();
      const newLayer: Layer = {
        id: Date.now().toString(),
        name: "AI Generated",
        type: "ai",
        content: data.imageUrl,
        visible: true,
        opacity: 100,
      };
      setLayers([...layers, newLayer]);
      setSelectedLayer(newLayer);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const saveToLibrary = async () => {
    try {
      const response = await fetch("/api/library/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "image",
          layers,
          thumbnail: layers[layers.length - 1]?.content,
        }),
      });

      if (!response.ok) throw new Error("Failed to save to library");
      
      // Handle success (e.g., show notification)
    } catch (error) {
      console.error("Error saving to library:", error);
    }
  };

  return (
    <div className="max-w-[1800px] mx-auto p-4 space-y-8">
      <div className="flex items-center justify-between mb-8">
        <Link href="/dashboard" className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition">
          <ImageIcon className="w-8 h-8" />
          <span className="text-xl font-semibold">CreativeAI Studio</span>
        </Link>
        <CreditDisplay cost={5} />
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Tools Panel */}
        <div className="col-span-1 bg-gray-800/30 rounded-lg p-4">
          <div className="flex flex-col items-center space-y-4">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={tool.action}
                className={`p-3 rounded-lg transition ${
                  selectedTool === tool.id
                    ? "bg-purple-600 text-white"
                    : "hover:bg-gray-700"
                }`}
                title={tool.name}
              >
                {tool.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="col-span-8 bg-gray-800/30 rounded-lg p-4">
          <div className="h-[600px] bg-gray-900/50 rounded-lg flex items-center justify-center">
            {layers.length === 0 ? (
              <div className="text-gray-400 text-center">
                <p>No image selected</p>
                <p className="text-sm">Upload, download, or generate an image to get started</p>
              </div>
            ) : (
              <div className="relative w-full h-full">
                {layers.map((layer) => (
                  layer.visible && (
                    <img
                      key={layer.id}
                      src={layer.content}
                      alt={layer.name}
                      className="absolute top-0 left-0 w-full h-full object-contain"
                      style={{ opacity: layer.opacity / 100 }}
                    />
                  )
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="col-span-3 space-y-4">
          {/* Tabs */}
          <div className="flex bg-gray-800/30 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("generate")}
              className={`flex-1 py-2 rounded-md transition ${
                activeTab === "generate" ? "bg-purple-600 text-white" : "text-gray-400"
              }`}
            >
              Generate
            </button>
            <button
              onClick={() => setActiveTab("edit")}
              className={`flex-1 py-2 rounded-md transition ${
                activeTab === "edit" ? "bg-purple-600 text-white" : "text-gray-400"
              }`}
            >
              Edit
            </button>
            <button
              onClick={() => setActiveTab("download")}
              className={`flex-1 py-2 rounded-md transition ${
                activeTab === "download" ? "bg-purple-600 text-white" : "text-gray-400"
              }`}
            >
              Download
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-gray-800/30 rounded-lg p-4">
            {activeTab === "generate" && (
              <div className="space-y-4">
                <textarea
                  placeholder="Describe the image you want to generate..."
                  className="w-full h-32 bg-gray-800/50 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <button
                  onClick={generateImage}
                  disabled={isProcessing || !prompt}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-3 hover:from-purple-600 hover:to-pink-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Wand2 className="w-5 h-5" />
                  {isProcessing ? "Generating..." : "Generate Image"}
                </button>
              </div>
            )}

            {activeTab === "edit" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium">Layers</h3>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 hover:bg-gray-700 rounded-lg transition"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {layers.map((layer) => (
                    <div
                      key={layer.id}
                      onClick={() => setSelectedLayer(layer)}
                      className={`flex items-center justify-between p-2 rounded-lg transition ${
                        selectedLayer?.id === layer.id
                          ? "bg-purple-600"
                          : "hover:bg-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setLayers(layers.map(l => 
                              l.id === layer.id ? { ...l, visible: !l.visible } : l
                            ));
                          }}
                        >
                          {layer.visible ? (
                            <Layers className="w-4 h-4" />
                          ) : (
                            <Layers className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                        <span>{layer.name}</span>
                      </div>
                      <button
                        onClick={() => {
                          setLayers(layers.filter(l => l.id !== layer.id));
                          if (selectedLayer?.id === layer.id) {
                            setSelectedLayer(null);
                          }
                        }}
                      >
                        <Trash className="w-4 h-4 hover:text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "download" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter image or video URL..."
                      className="flex-1 bg-gray-800/50 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={downloadUrl}
                      onChange={(e) => setDownloadUrl(e.target.value)}
                    />
                    <button
                      onClick={() => handleUrlDownload(downloadUrl)}
                      disabled={!downloadUrl || isProcessing}
                      className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <button
            onClick={saveToLibrary}
            disabled={layers.length === 0}
            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white rounded-lg p-3 hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            Save to Library
          </button>
        </div>
      </div>
    </div>
  );
}
