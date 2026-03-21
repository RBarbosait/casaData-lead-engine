export interface Property {
  id: string
  title: string
  price: number
  location: string
  description: string
  type: 'casa' | 'apartamento' | 'terreno' | 'oficina'
  images: string[]
  phone: string
  ownerId: string
  createdAt: string
  updatedAt: string
}

export interface PropertyMetrics {
  propertyId: string
  views: number
  whatsappClicks: number
  saves: number
  shares: number
}

export interface TrackingEvent {
  id: string
  propertyId: string
  eventType: 'view_property' | 'click_whatsapp' | 'save_property' | 'share_property'
  source: 'qr' | 'web'
  timestamp: string
}

export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export type DemandLevel = 'high' | 'medium' | 'low'

export function calculateDemandScore(metrics: PropertyMetrics): number {
  return metrics.views + (metrics.saves * 3) + (metrics.shares * 4) + (metrics.whatsappClicks * 5)
}

export function getDemandLevel(score: number): DemandLevel {
  if (score > 100) return 'high'
  if (score >= 50) return 'medium'
  return 'low'
}

export function getConversionRate(metrics: PropertyMetrics): number {
  if (metrics.views === 0) return 0
  return (metrics.whatsappClicks / metrics.views) * 100
}
