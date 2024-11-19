import BottomNav from '@/app/components/BottomNav'
import LoadingSpinner from '@/app/components/LoadingSpinner';
import Header from '@/app/components/Header'
import CreatePostButton from '@/app/components/CreatePostButton'
import './globals.css'
import { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Suspense } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext'; // We'll create this next
import ThemeBackground from './components/ThemeBackground';

export const metadata: Metadata = {
  title: 'Giveaholic',
  description: 'Description of your app',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Giveaholic',
  },
  icons: {
    icon: '/icon-192x192.png',
    apple: '/icon-192x192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#f97316',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen overflow-hidden">
        <ThemeProvider>
          <AuthProvider>
            <ThemeBackground />
            {/* Splash screen */}
            <div id="splash-screen" className="fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-500">
              <h1 className="text-4xl font-bold text-white">GiveApp</h1>
            </div>

            {/* Main content */}
            <div id="__next" className="opacity-0 transition-opacity duration-500 relative z-10">
              <div className="flex flex-col h-screen">
                <Header />
                <main className="flex-grow overflow-auto p-4 pb-20 relative">
                  <Suspense fallback={<LoadingSpinner />}>
                    {children}
                  </Suspense>
                </main>
                <CreatePostButton />
                <BottomNav />
              </div>
            </div>
          </AuthProvider>
        </ThemeProvider>
        <Script src="/splash-screen.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}