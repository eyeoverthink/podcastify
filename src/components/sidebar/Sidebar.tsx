'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutGrid,
  Video,
  Mic2,
  PenTool,
  Image as ImageIcon,
  Music,
  MessageSquare,
  Book,
  Palette,
  CreditCard
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();

  const navigation = [
    { name: 'Creator Studio', href: '/dashboard', icon: LayoutGrid },
    { name: 'AI Video', href: '/ai-tools/video', icon: Video },
    { name: 'AI Podcast', href: '/ai-tools/podcast', icon: Mic2 },
    { name: 'AI Blog', href: '/ai-tools/blog', icon: PenTool },
    { name: 'AI Image', href: '/ai-tools/image', icon: ImageIcon },
    { name: 'AI Music', href: '/ai-tools/music', icon: Music },
    { name: 'AI Chat', href: '/ai-tools/chat', icon: MessageSquare },
    { name: 'AI Audiobook', href: '/ai-tools/audiobook', icon: Book },
    { name: 'Design Tools', href: '/design', icon: Palette },
    { name: 'Credits', href: '/credits', icon: CreditCard },
  ];

  return (
    <div className="sidebar">
      <Link href="/dashboard" className="block p-6">
        <h1 className="text-xl font-bold text-white">CreativeAI Studio</h1>
      </Link>
      <nav className="flex-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
