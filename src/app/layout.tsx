import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Toaster } from '@/components/ui/toaster'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const viewport: Viewport = {
  themeColor: '#0ea5e9',
}

export const metadata: Metadata = {
  title: '耐震診断くん - 木造住宅の耐震診断ツール',
  description:
    '木造住宅（在来工法・2x4）の簡易診断・精密診断法1に対応した耐震診断Webアプリケーション',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '耐震診断くん',
  },
  openGraph: {
    title: '耐震診断くん - 木造住宅の耐震診断ツール',
    description:
      '10問の簡易診断から精密診断法1まで。木造住宅の耐震性能を無料で診断できるWebアプリです。',
    type: 'website',
    locale: 'ja_JP',
    siteName: '耐震診断くん',
  },
  twitter: {
    card: 'summary',
    title: '耐震診断くん - 木造住宅の耐震診断ツール',
    description:
      '10問の簡易診断から精密診断法1まで。木造住宅の耐震性能を無料で診断できるWebアプリです。',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  )
}
