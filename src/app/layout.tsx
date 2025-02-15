import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Providers } from '@/lib/providers';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: {
    template: '%s | NextSocialBoilerplate',
    default: 'Home | NextSocialBoilerplate',
  },
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers attribute="class" enableSystem>
          <main>{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
