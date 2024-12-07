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
    { name: 'AI Video', href: '/video', icon: Video },
    { name: 'AI Podcast', href: '/podcast', icon: Mic2 },
    { name: 'AI Blog', href: '/blog', icon: PenTool },
    { name: 'AI Image', href: '/image', icon: ImageIcon },
    { name: 'AI Music', href: '/music', icon: Music },
    { name: 'AI Chat', href: '/chat', icon: MessageSquare },
    { name: 'AI Audiobook', href: '/audiobook', icon: Book },
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
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`nav-item ${pathname === item.href ? 'active' : ''}`}
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
