import { UserButton } from "@clerk/nextjs";
import { CreditDisplay } from "@/components/shared/credit-display";
import Link from "next/link";
import { 
  Mic, 
  PanelsTopLeft, 
  Video, 
  PenTool, 
  Image, 
  Music, 
  MessageSquare, 
  BookOpen, 
  Palette, 
  CreditCard 
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <main>
        <div className="h-screen flex bg-gray-900">
          {/* Sidebar */}
          <div className="hidden md:flex md:w-64 md:flex-col">
            <div className="flex flex-col flex-grow pt-5 bg-gray-800 overflow-y-auto">
              {/* Logo */}
              <div className="flex items-center flex-shrink-0 px-4">
                <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                  Podcastify
                </h1>
              </div>
              
              {/* Navigation */}
              <div className="mt-5 flex-1 flex flex-col">
                <nav className="flex-1 px-2 space-y-1">
                  <Link href="/studio" className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white">
                    <PanelsTopLeft className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-300" />
                    Creator Studio
                  </Link>
                  <Link href="/ai-tools/video" className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white">
                    <Video className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-300" />
                    AI Video
                  </Link>
                  <Link href="/ai-tools/podcast" className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white">
                    <Mic className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-300" />
                    AI Podcast
                  </Link>
                  <Link href="/ai-tools/blog" className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white">
                    <PenTool className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-300" />
                    AI Blog
                  </Link>
                  <Link href="/ai-tools/image" className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white">
                    <Image className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-300" />
                    AI Image
                  </Link>
                  <Link href="/ai-tools/music" className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white">
                    <Music className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-300" />
                    AI Music
                  </Link>
                  <Link href="/chat" className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white">
                    <MessageSquare className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-300" />
                    AI Chat
                  </Link>
                  <Link href="/ai-tools/audiobook" className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white">
                    <BookOpen className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-300" />
                    AI Audiobook
                  </Link>
                  <Link href="/ai-tools/design" className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white">
                    <Palette className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-300" />
                    Design Tools
                  </Link>
                  <Link href="/credits" className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white">
                    <CreditCard className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-300" />
                    Credits
                  </Link>
                </nav>
              </div>

              {/* Credits Display */}
              <div className="flex-shrink-0 flex border-t border-gray-700 p-4">
                <div className="flex items-center w-full justify-between">
                  <div className="flex items-center gap-4">
                    <CreditDisplay />
                    <button className="text-xs text-purple-400 hover:text-purple-300">
                      Buy Credits
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col flex-1 overflow-hidden">
            <main className="flex-1 relative overflow-y-auto focus:outline-none">
              {children}
            </main>
          </div>
        </div>
      </main>
    </div>
  );
}
