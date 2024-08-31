import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ display: 'swap', subsets: ['latin'], preload: true });

export const metadata: Metadata = {
  title: 'Quran Tiktok Bot',
  icons: [{ rel: 'icon', url: '/logo.png' }],
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
