'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DemandBadge } from '@/components/demand-badge'
import { mockProperties, mockMetrics } from '@/lib/data'
import { calculateDemandScore, getDemandLevel, getConversionRate } from '@/lib/types'
import { 
  Plus, 
  Eye, 
  MessageCircle, 
  Heart, 
  Share2, 
  TrendingUp,
  ExternalLink,
  BarChart3
} from 'lucide-react'

export function DashboardContent() {
  // Calculate totals
  const totalViews = mockMetrics.reduce((sum, m) => sum + m.views, 0)
  const totalLeads = mockMetrics.reduce((sum, m) => sum + m.whatsappClicks, 0)
  const totalSaves = mockMetrics.reduce((sum, m) => sum + m.saves, 0)
  const totalShares = mockMetrics.reduce((sum, m) => sum + m.shares, 0)
  const avgConversion = totalViews > 0 ? ((totalLeads / totalViews) * 100).toFixed(1) : '0'

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Dashboard</h1>
          <p className="text-muted-foreground">
            Gestiona tus propiedades y analiza el rendimiento
          </p>
        </div>
        <Button asChild>
          <Link href="/create-property">
            <Plus className="mr-2 h-4 w-4" />
            Nueva propiedad
          </Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalViews}</p>
                <p className="text-xs text-muted-foreground">Visitas totales</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <MessageCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalLeads}</p>
                <p className="text-xs text-muted-foreground">Leads WhatsApp</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-100">
                <Heart className="h-5 w-5 text-pink-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalSaves}</p>
                <p className="text-xs text-muted-foreground">Guardados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                <Share2 className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalShares}</p>
                <p className="text-xs text-muted-foreground">Compartidos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                <TrendingUp className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{avgConversion}%</p>
                <p className="text-xs text-muted-foreground">Conversion</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Properties List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Mis propiedades
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            {mockProperties.length} propiedades
          </span>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockProperties.map((property) => {
              const metrics = mockMetrics.find(m => m.propertyId === property.id)
              const score = metrics ? calculateDemandScore(metrics) : 0
              const demandLevel = getDemandLevel(score)
              const conversion = metrics ? getConversionRate(metrics) : 0

              return (
                <div
                  key={property.id}
                  className="flex flex-col gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center"
                >
                  {/* Property Image & Info */}
                  <div className="flex flex-1 items-center gap-4">
                    <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md">
                      <Image
                        src={property.images[0]}
                        alt={property.title}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate font-medium">{property.title}</h3>
                        <DemandBadge level={demandLevel} showLabel={false} />
                      </div>
                      <p className="text-sm text-muted-foreground">{property.location}</p>
                      <p className="text-sm font-semibold text-primary">
                        {formatPrice(property.price)}
                      </p>
                    </div>
                  </div>

                  {/* Metrics */}
                  {metrics && (
                    <div className="flex items-center gap-6 text-center sm:gap-8">
                      <div>
                        <p className="text-lg font-bold">{metrics.views}</p>
                        <p className="text-xs text-muted-foreground">Visitas</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-green-600">{metrics.whatsappClicks}</p>
                        <p className="text-xs text-muted-foreground">Leads</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold">{metrics.saves}</p>
                        <p className="text-xs text-muted-foreground">Guardados</p>
                      </div>
                      <div>
                        <p className={`text-lg font-bold ${conversion >= 10 ? 'text-green-600' : ''}`}>
                          {conversion.toFixed(1)}%
                        </p>
                        <p className="text-xs text-muted-foreground">Conv.</p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex shrink-0 gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/property/${property.id}`}>
                        <ExternalLink className="mr-1.5 h-4 w-4" />
                        Ver
                      </Link>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Conversion Tips */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">Tips para mejorar conversiones</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
              Las propiedades con mas de 10% de conversion tienen fotos de alta calidad
            </li>
            <li className="flex items-start gap-2">
              <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
              Descripciones detalladas aumentan el tiempo en pagina y las consultas
            </li>
            <li className="flex items-start gap-2">
              <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
              Compartir en redes sociales aumenta las visitas en un 40% promedio
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
