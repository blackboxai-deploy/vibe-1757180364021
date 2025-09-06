import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Image Generator',
  description: 'Create stunning, high-quality images from text descriptions using advanced AI technology.',
  keywords: ['AI', 'image generation', 'artificial intelligence', 'text to image', 'creative tools'],
  authors: [{ name: 'AI Image Generator' }],
  openGraph: {
    title: 'AI Image Generator',
    description: 'Create stunning, high-quality images from text descriptions using advanced AI technology.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Image Generator',
    description: 'Create stunning, high-quality images from text descriptions using advanced AI technology.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  );
}