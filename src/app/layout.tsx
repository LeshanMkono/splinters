import type { Metadata } from 'next'
import { Inter, Space_Mono } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import { ToastProvider } from '@/components/ui/Toast'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://splinters.co.ke'),
  title: {
    default: 'Splinters Basketball — Nairobi Pickup Community',
    template: '%s | Splinters Basketball',
  },
  description:
    'Nairobi\'s pickup basketball community. Vote on games, track payments, and find courts. Every Saturday & Sunday.',
  openGraph: {
    siteName: 'Splinters Basketball',
    locale: 'en_KE',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-white text-navy antialiased">
        <SessionProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
