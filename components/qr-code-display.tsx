'use client'

import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Copy, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import QRCode from 'qrcode'

interface QRCodeDisplayProps {
  url: string
  title: string
}

export function QRCodeDisplay({ url, title }: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 256,
        margin: 2,
        color: {
          dark: '#1a1a1a',
          light: '#ffffff'
        }
      })
    }
  }, [url])

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement('a')
      link.download = `qr-${title.toLowerCase().replace(/\s+/g, '-')}.png`
      link.href = canvasRef.current.toDataURL('image/png')
      link.click()
      toast.success('QR descargado')
    }
  }

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(url)
    toast.success('Link copiado al portapapeles')
  }

  const handleOpenLink = () => {
    window.open(url, '_blank')
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 rounded-xl border border-border bg-white p-4">
        <canvas ref={canvasRef} className="mx-auto" />
      </div>
      
      <p className="mb-4 text-center text-sm text-muted-foreground">
        Escanea este codigo QR para ver la ficha de la propiedad
      </p>
      
      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Descargar QR
        </Button>
        <Button variant="outline" onClick={handleCopyLink}>
          <Copy className="mr-2 h-4 w-4" />
          Copiar link
        </Button>
        <Button variant="ghost" onClick={handleOpenLink}>
          <ExternalLink className="mr-2 h-4 w-4" />
          Abrir
        </Button>
      </div>
      
      <div className="mt-6 w-full rounded-lg bg-muted p-3">
        <p className="break-all text-center text-xs text-muted-foreground">
          {url}
        </p>
      </div>
    </div>
  )
}
