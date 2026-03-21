'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DemandBadge } from '@/components/demand-badge'
import { Property, PropertyMetrics, calculateDemandScore, getDemandLevel } from '@/lib/types'
import { 
  MessageCircle, 
  Heart, 
  Share2, 
  MapPin, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  Users,
  Bookmark
} from 'lucide-react'
import { toast } from 'sonner'

interface PropertyDetailProps {
  property: Property
  metrics?: PropertyMetrics
  isFromQR?: boolean
}

export function PropertyDetail({ property, metrics, isFromQR }: PropertyDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isSaved, setIsSaved] = useState(false)
  
  const score = metrics ? calculateDemandScore(metrics) : 0
  const demandLevel = getDemandLevel(score)
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price)
  }

  const typeLabels = {
    casa: 'Casa',
    apartamento: 'Apartamento',
    terreno: 'Terreno',
    oficina: 'Oficina'
  }

  const handleWhatsAppClick = () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const message = encodeURIComponent(
      `Hola, vi esta propiedad en casaData y me interesa: ${property.title}\n${url}`
    )
    const whatsappUrl = `https://wa.me/${property.phone}?text=${message}`
    window.open(whatsappUrl, '_blank')
    
    // Track event (in production this would be a real API call)
    console.log('Event tracked:', {
      type: 'click_whatsapp',
      propertyId: property.id,
      source: isFromQR ? 'qr' : 'web'
    })
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
    toast.success(isSaved ? 'Eliminado de favoritos' : 'Guardado en favoritos')
  }

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Mira esta propiedad: ${property.title}`,
          url
        })
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(url)
      toast.success('Link copiado al portapapeles')
    }
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    )
  }

  return (
    <div className="pb-24 md:pb-8">
      {/* Image Carousel */}
      <section className="relative bg-muted">
        <div className="relative aspect-[16/10] md:aspect-[21/9]">
          <Image
            src={property.images[currentImageIndex]}
            alt={`${property.title} - Imagen ${currentImageIndex + 1}`}
            fill
            className="object-cover"
            priority
          />
          
          {/* Navigation arrows */}
          {property.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur transition-colors hover:bg-white"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur transition-colors hover:bg-white"
                aria-label="Siguiente imagen"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
          
          {/* Image counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-sm text-white">
            {currentImageIndex + 1} / {property.images.length}
          </div>
          
          {/* Badges */}
          <div className="absolute left-4 top-4 flex flex-col gap-2">
            <DemandBadge level={demandLevel} />
            <span className="rounded-md bg-primary/90 px-2.5 py-1 text-xs font-medium text-primary-foreground backdrop-blur">
              {typeLabels[property.type]}
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h1 className="mb-2 text-2xl font-bold md:text-3xl">{property.title}</h1>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{property.location}</span>
                </div>
              </div>
              <p className="shrink-0 text-2xl font-bold text-primary md:text-3xl">
                {formatPrice(property.price)}
              </p>
            </div>
            
            <div className="mb-6 flex gap-3">
              <Button
                variant={isSaved ? "default" : "outline"}
                size="sm"
                onClick={handleSave}
              >
                <Heart className={`mr-2 h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                {isSaved ? 'Guardado' : 'Guardar'}
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Compartir
              </Button>
            </div>
            
            <div className="prose prose-neutral max-w-none">
              <h2 className="text-lg font-semibold">Descripcion</h2>
              <p className="leading-relaxed text-muted-foreground">
                {property.description}
              </p>
            </div>
            
            {/* Metrics Card (Desktop) */}
            {metrics && (
              <Card className="mt-8 hidden md:block">
                <CardContent className="p-6">
                  <h3 className="mb-4 font-semibold">Metricas de interes</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="rounded-lg bg-muted/50 p-4 text-center">
                      <Eye className="mx-auto mb-2 h-5 w-5 text-muted-foreground" />
                      <p className="text-2xl font-bold">{metrics.views}</p>
                      <p className="text-xs text-muted-foreground">Visitas</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-4 text-center">
                      <Users className="mx-auto mb-2 h-5 w-5 text-muted-foreground" />
                      <p className="text-2xl font-bold">{metrics.whatsappClicks}</p>
                      <p className="text-xs text-muted-foreground">Contactos</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-4 text-center">
                      <Bookmark className="mx-auto mb-2 h-5 w-5 text-muted-foreground" />
                      <p className="text-2xl font-bold">{metrics.saves}</p>
                      <p className="text-xs text-muted-foreground">Guardados</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-4 text-center">
                      <Share2 className="mx-auto mb-2 h-5 w-5 text-muted-foreground" />
                      <p className="text-2xl font-bold">{metrics.shares}</p>
                      <p className="text-xs text-muted-foreground">Compartidos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Sidebar - Contact Card (Desktop) */}
          <div className="hidden lg:block">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <p className="mb-4 text-center text-sm text-muted-foreground">
                  Te interesa esta propiedad? Contacta en segundos
                </p>
                <Button 
                  className="w-full bg-green-600 text-white hover:bg-green-700" 
                  size="lg"
                  onClick={handleWhatsAppClick}
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Consultar por WhatsApp
                </Button>
                <div className="mt-4 flex justify-center gap-3">
                  <Button variant="outline" size="sm" onClick={handleSave}>
                    <Heart className={`mr-1.5 h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                    Guardar
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="mr-1.5 h-4 w-4" />
                    Compartir
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Fixed Bottom CTA (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background p-4 md:hidden">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-lg font-bold text-primary">{formatPrice(property.price)}</p>
            <p className="text-xs text-muted-foreground">Contacta ahora</p>
          </div>
          <Button 
            className="bg-green-600 text-white hover:bg-green-700"
            onClick={handleWhatsAppClick}
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            WhatsApp
          </Button>
        </div>
      </div>
    </div>
  )
}
