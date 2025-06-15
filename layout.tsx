import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MovieFlix - Discover Amazing Movies',
  description: 'Browse, search, and discover your favorite movies with MovieFlix',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-900 min-h-screen`}>
        <LanguageProvider>
          <WishlistProvider>
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </WishlistProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}