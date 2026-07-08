import type { Metadata } from 'next'
import { Bebas_Neue, Inter, Space_Mono } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import { ToastProvider } from '@/components/ui/Toast'
import './globals.css'

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bebas',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
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
    <html
      lang="en"
      className={`${bebasNeue.variable} ${inter.variable} ${spaceMono.variable}`}
    >
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
