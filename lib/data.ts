import { Property, PropertyMetrics, User } from './types'

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'demo@casadata.com',
    name: 'Demo User',
    createdAt: '2024-01-01T00:00:00Z'
  }
]

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Casa moderna en Carrasco',
    price: 285000,
    location: 'Carrasco, Montevideo',
    description: 'Hermosa casa moderna de 3 dormitorios con jardín amplio, piscina y parrillero. Excelente ubicación cerca de colegios y servicios.',
    type: 'casa',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
    ],
    phone: '59899123456',
    ownerId: '1',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Apartamento con vista al mar',
    price: 195000,
    location: 'Punta Carretas, Montevideo',
    description: 'Espectacular apartamento de 2 dormitorios con vista panorámica al mar. Edificio con amenities, piscina y gimnasio.',
    type: 'apartamento',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    ],
    phone: '59899234567',
    ownerId: '1',
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-20T14:30:00Z'
  },
  {
    id: '3',
    title: 'Casa a estrenar en Malvín',
    price: 220000,
    location: 'Malvín, Montevideo',
    description: 'Casa nueva de 4 dormitorios, 2 baños, garaje para 2 autos. Cocina equipada y living comedor integrado.',
    type: 'casa',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
    ],
    phone: '59899345678',
    ownerId: '1',
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-02-01T09:00:00Z'
  },
  {
    id: '4',
    title: 'Oficina premium en Ciudad Vieja',
    price: 125000,
    location: 'Ciudad Vieja, Montevideo',
    description: 'Oficina de 80m2 en edificio histórico restaurado. Ideal para estudios profesionales o startups.',
    type: 'oficina',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop',
    ],
    phone: '59899456789',
    ownerId: '1',
    createdAt: '2024-02-10T11:00:00Z',
    updatedAt: '2024-02-10T11:00:00Z'
  },
  {
    id: '5',
    title: 'Terreno en zona de crecimiento',
    price: 85000,
    location: 'Solymar, Canelones',
    description: 'Terreno de 500m2 en zona residencial en expansión. Todos los servicios disponibles. Ideal para construir.',
    type: 'terreno',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
    ],
    phone: '59899567890',
    ownerId: '1',
    createdAt: '2024-02-15T16:00:00Z',
    updatedAt: '2024-02-15T16:00:00Z'
  },
  {
    id: '6',
    title: 'Penthouse exclusivo en Pocitos',
    price: 450000,
    location: 'Pocitos, Montevideo',
    description: 'Penthouse de lujo con terraza de 100m2, jacuzzi y vista 360. 3 dormitorios en suite, 2 garajes.',
    type: 'apartamento',
    images: [
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop',
    ],
    phone: '59899678901',
    ownerId: '1',
    createdAt: '2024-02-20T08:00:00Z',
    updatedAt: '2024-02-20T08:00:00Z'
  }
]

export const mockMetrics: PropertyMetrics[] = [
  { propertyId: '1', views: 120, whatsappClicks: 18, saves: 25, shares: 12 },
  { propertyId: '2', views: 85, whatsappClicks: 10, saves: 15, shares: 8 },
  { propertyId: '3', views: 45, whatsappClicks: 5, saves: 8, shares: 3 },
  { propertyId: '4', views: 30, whatsappClicks: 3, saves: 5, shares: 2 },
  { propertyId: '5', views: 25, whatsappClicks: 2, saves: 4, shares: 1 },
  { propertyId: '6', views: 200, whatsappClicks: 35, saves: 45, shares: 25 },
]

export function getPropertyById(id: string): Property | undefined {
  return mockProperties.find(p => p.id === id)
}

export function getMetricsByPropertyId(propertyId: string): PropertyMetrics | undefined {
  return mockMetrics.find(m => m.propertyId === propertyId)
}

export function getPropertiesByOwner(ownerId: string): Property[] {
  return mockProperties.filter(p => p.ownerId === ownerId)
}
