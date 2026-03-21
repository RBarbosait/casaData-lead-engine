import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
});

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-geist-mono'
});

export const metadata: Metadata = {
  title: 'casaData - Convertí tus carteles en generadores de leads',
  description: 'Plataforma PropTech que conecta cartelería inmobiliaria física con fichas digitales mediante códigos QR. Medí cuántas personas ven tus propiedades y generá más consultas.',
  generator: 'v0.app',
  keywords: ['inmobiliaria', 'real estate', 'leads', 'QR', 'proptech', 'marketing inmobiliario'],
  authors: [{ name: 'casaData' }],
  openGraph: {
    title: 'casaData - Convertí tus carteles en generadores de leads',
    description: 'Transformá carteles inmobiliarios en canales de generación de leads medibles.',
    type: 'website',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#4a3728',
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
      <body className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
