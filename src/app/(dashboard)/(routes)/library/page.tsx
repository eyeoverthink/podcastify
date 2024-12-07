'use client';

import { useEffect, useState } from "react";
import { ImageIcon, Music, Mic, FileText, Tabs, TabsList, TabsTrigger, TabsContent } from "lucide-react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { CreditDisplay } from "@/components/shared/credit-display";

interface SavedContent {
  id: string;
  url: string;
  prompt: string;
  createdAt: string;
  type: 'image' | 'music' | 'podcast' | 'blog';
  title?: string;
  duration?: string;
}

const ContentLibrary = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'images' | 'music' | 'podcasts' | 'blogs'>('all');
  const [content, setContent] = useState<SavedContent[]>([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchContent = async () => {
      if (!user?.id) return;
      try {
        const response = await fetch(`/api/library?userId=${user.id}&type=${activeTab}`);
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    };

    fetchContent();
  }, [user?.id, activeTab]);

  const getIconForType = (type: SavedContent['type']) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-6 h-6" />;
      case 'music':
        return <Music className="w-6 h-6" />;
      case 'podcast':
        return <Mic className="w-6 h-6" />;
      case 'blog':
        return <FileText className="w-6 h-6" />;
      default:
        return null;
    }
  };

  const renderContent = (item: SavedContent) => {
    switch (item.type) {
      case 'image':
        return (
          <div className="relative aspect-square">
            <Image
              src={item.url}
              alt={item.prompt}
              fill
              className="object-cover"
            />
          </div>
        );
      case 'music':
      case 'podcast':
        return (
          <div className="p-4">
            <audio controls className="w-full">
              <source src={item.url} type="audio/mpeg" />
            </audio>
            {item.duration && (
              <p className="text-gray-500 text-xs mt-2">Duration: {item.duration}</p>
            )}
          </div>
        );
      case 'blog':
        return (
          <div className="p-4">
            <p className="text-gray-300 text-sm line-clamp-3">{item.prompt}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Content Library</h1>
          <p className="text-gray-400">Your collection of AI-generated content</p>
        </div>
        <CreditDisplay />
      </div>

      <div className="mb-8">
        <div className="flex space-x-4 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-2 px-4 ${activeTab === 'all' ? 'text-purple-500 border-b-2 border-purple-500' : 'text-gray-400'}`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('images')}
            className={`pb-2 px-4 ${activeTab === 'images' ? 'text-purple-500 border-b-2 border-purple-500' : 'text-gray-400'}`}
          >
            Images
          </button>
          <button
            onClick={() => setActiveTab('music')}
            className={`pb-2 px-4 ${activeTab === 'music' ? 'text-purple-500 border-b-2 border-purple-500' : 'text-gray-400'}`}
          >
            Music
          </button>
          <button
            onClick={() => setActiveTab('podcasts')}
            className={`pb-2 px-4 ${activeTab === 'podcasts' ? 'text-purple-500 border-b-2 border-purple-500' : 'text-gray-400'}`}
          >
            Podcasts
          </button>
          <button
            onClick={() => setActiveTab('blogs')}
            className={`pb-2 px-4 ${activeTab === 'blogs' ? 'text-purple-500 border-b-2 border-purple-500' : 'text-gray-400'}`}
          >
            Blogs
          </button>
        </div>
      </div>

      {content.length === 0 ? (
        <div className="bg-[#1a1b1e] rounded-lg p-20 text-center">
          <div className="flex justify-center space-x-4 mb-4">
            <ImageIcon className="w-8 h-8 text-purple-500" />
            <Music className="w-8 h-8 text-purple-500" />
            <Mic className="w-8 h-8 text-purple-500" />
            <FileText className="w-8 h-8 text-purple-500" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">No content yet</h3>
          <p className="text-gray-400 mb-4">
            Start creating with our AI tools to build your library
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.map((item) => (
            <div key={item.id} className="bg-[#1a1b1e] rounded-lg overflow-hidden">
              {renderContent(item)}
              <div className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  {getIconForType(item.type)}
                  <span className="text-gray-400 text-sm capitalize">{item.type}</span>
                </div>
                {item.title && (
                  <h3 className="text-white font-medium mb-2">{item.title}</h3>
                )}
                <p className="text-gray-300 text-sm line-clamp-2">{item.prompt}</p>
                <p className="text-gray-500 text-xs mt-2">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentLibrary;
