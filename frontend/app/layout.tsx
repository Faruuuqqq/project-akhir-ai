import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono, Inter } from 'next/font/google';
import '../styles/globals.css';
import { RootClient } from './root-client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MammoAI Precision',
  description: 'Deteksi Dini Kanker Payudara dengan AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${jakarta.variable} ${jetbrains.variable} ${inter.variable}`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL,GRAD,opsz@400,0,0,24&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-clinical-pearl font-inter text-charcoal antialiased selection:bg-ribbon-pink/20">
        <RootClient>
          <div className="flex flex-col min-h-dvh">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </RootClient>
      </body>
    </html>
  );
}
