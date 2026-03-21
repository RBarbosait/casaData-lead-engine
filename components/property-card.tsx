'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DemandBadge } from '@/components/demand-badge'
import { Property, PropertyMetrics, calculateDemandScore, getDemandLevel } from '@/lib/types'
import { MapPin, Heart, Share2, Eye } from 'lucide-react'
import { toast } from 'sonner'

interface PropertyCardProps {
  property: Property
  metrics?: PropertyMetrics
}

export function PropertyCard({ property, metrics }: PropertyCardProps) {
  const score = metrics ? calculateDemandScore(metrics) : 0
  const demandLevel = getDemandLevel(score)

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault()
    toast.success('Propiedad guardada en favoritos')
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    const url = `${window.location.origin}/property/${property.id}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Mirá esta propiedad: ${property.title}`,
          url
        })
      } catch {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(url)
      toast.success('Link copiado al portapapeles')
    }
  }

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

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/property/${property.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute left-3 top-3">
            <DemandBadge level={demandLevel} />
          </div>
          <div className="absolute right-3 top-3 flex gap-2">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full bg-white/90 backdrop-blur hover:bg-white"
              onClick={handleSave}
            >
              <Heart className="h-4 w-4" />
              <span className="sr-only">Guardar</span>
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full bg-white/90 backdrop-blur hover:bg-white"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Compartir</span>
            </Button>
          </div>
          <div className="absolute bottom-3 left-3">
            <span className="rounded-md bg-primary/90 px-2 py-1 text-xs font-medium text-primary-foreground backdrop-blur">
              {typeLabels[property.type]}
            </span>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 font-semibold leading-tight text-foreground">
              {property.title}
            </h3>
            <span className="shrink-0 text-lg font-bold text-primary">
              {formatPrice(property.price)}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{property.location}</span>
          </div>
          {metrics && (
            <div className="mt-3 flex items-center gap-3 border-t border-border pt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {metrics.views} visitas
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-3.5 w-3.5" />
                {metrics.saves} guardados
              </span>
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  )
}
