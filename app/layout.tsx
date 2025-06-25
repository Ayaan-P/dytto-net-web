import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { ErrorBoundary } from '@/components/ui/error-boundary';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Dytto - Revolutionary Relationship Management',
  description: 'The most beautiful and intelligent way to build meaningful relationships in the digital age.',
  keywords: ['relationships', 'networking', 'personal growth', 'AI', 'productivity', 'CRM'],
  authors: [{ name: 'Dytto Team' }],
  creator: 'Dytto',
  publisher: 'Dytto',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://dytto.com'),
  openGraph: {
    title: 'Dytto - Revolutionary Relationship Management',
    description: 'The most beautiful and intelligent way to build meaningful relationships in the digital age.',
    url: 'https://dytto.com',
    siteName: 'Dytto',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Dytto - Relationship Management Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dytto - Revolutionary Relationship Management',
    description: 'The most beautiful and intelligent way to build meaningful relationships in the digital age.',
    creator: '@dyttoapp',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster 
              position="top-right"
              toastOptions={{
                style: {
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  color: 'hsl(var(--card-foreground))',
                },
              }}
            />
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}