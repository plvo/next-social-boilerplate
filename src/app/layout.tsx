import { Providers } from '@/lib/providers';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '@/styles/globals.css';
import { Toaster } from 'sonner';

const geistSans = localFont({
  src: '../styles/fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: '../styles/fonts/GeistMonoVF.woff',
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
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers attribute='class' enableSystem>
          <main>{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
