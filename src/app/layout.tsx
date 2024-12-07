import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { Navbar } from '@/components/navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Podcastify - AI-Powered Podcast Creation',
  description: 'Create amazing podcasts with AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: { colorPrimary: 'rgb(168, 85, 247)' },
      }}
    >
      <html lang="en">
        <body className={inter.className}>
          <div className="h-full relative">
            <Navbar />
            <main className="pt-16 h-full">
              {children}
            </main>
            <Toaster />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
