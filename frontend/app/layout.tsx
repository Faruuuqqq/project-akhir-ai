import type { Metadata } from 'next';
import '../styles/globals.css';
import { RootClient } from './root-client';

export const metadata: Metadata = {
  title: 'RSNA Mammography AI',
  description: 'AI-powered breast cancer detection assistant',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-clinical-pearl">
        <RootClient>{children}</RootClient>
      </body>
    </html>
  );
}
