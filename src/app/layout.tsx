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

const BASE_URL = 'https://kouzou.fly.dev'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: '耐震診断くん - 木造住宅の耐震診断ツール',
    template: '%s | 耐震診断くん',
  },
  description:
    '木造住宅（在来工法・2x4）の簡易診断・精密診断法1に対応した耐震診断Webアプリケーション。10問の簡易診断から精密診断法1まで、木造住宅の耐震性能を無料で診断できます。',
  keywords: [
    '耐震診断',
    '木造住宅',
    '耐震',
    '地震',
    '簡易診断',
    '精密診断',
    '在来工法',
    '2x4',
    'ツーバイフォー',
    '上部構造評点',
    '壁量計算',
    '偏心率',
    '耐震補強',
  ],
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '192x192', type: 'image/png' },
    ],
  },
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
    url: BASE_URL,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '耐震診断くん - 木造住宅の耐震診断ツール',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '耐震診断くん - 木造住宅の耐震診断ツール',
    description:
      '10問の簡易診断から精密診断法1まで。木造住宅の耐震性能を無料で診断できるWebアプリです。',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: BASE_URL,
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
}

// JSON-LD 構造化データ
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': `${BASE_URL}/#webapp`,
      name: '耐震診断くん',
      description:
        '木造住宅（在来工法・2x4）の簡易診断・精密診断法1に対応した耐震診断Webアプリケーション',
      url: BASE_URL,
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Web Browser',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'JPY',
      },
      featureList: [
        '10問の簡易耐震診断',
        '精密診断法1による上部構造評点算出',
        '壁量計算・偏心率計算',
        '劣化度診断',
        '補強提案・概算費用見積',
        'PDF診断レポート出力',
      ],
      inLanguage: 'ja',
    },
    {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: '耐震診断くん',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/icons/icon-512x512.png`,
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      url: BASE_URL,
      name: '耐震診断くん',
      description: '木造住宅の耐震診断ツール',
      publisher: {
        '@id': `${BASE_URL}/#organization`,
      },
      inLanguage: 'ja',
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
