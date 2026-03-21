import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/sonner'
import { Suspense } from 'react'
import './globals.css'

const geistSans = Geist({ 
  subsets: ["latin"],
  variable: '--font-geist-sans'
});

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-geist-mono'
});

export const metadata: Metadata = {
  title: 'casaData - Tu hogar te esta esperando',
  description: 'Encuentra tu hogar ideal. Explora casas, apartamentos, cocheras, negocios y espacios de almacenamiento escaneando codigos QR desde carteles inmobiliarios.',
  generator: 'v0.app',
  keywords: ['inmobiliaria', 'real estate', 'leads', 'QR', 'proptech', 'marketing inmobiliario', 'Uruguay'],
  authors: [{ name: 'casaData' }],
  openGraph: {
    title: 'casaData - Tu hogar te esta esperando',
    description: 'Transforma carteles inmobiliarios en canales de generacion de leads medibles.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#166534',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <Suspense fallback={null}>
          {children}
        </Suspense>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
