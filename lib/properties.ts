export interface Property {
  id: number
  title: string
  type: string
  address: string
  operation: string
  image: string
  contact: string
  hasStreetView: boolean
  description: string
  features: string[]
  agent: string
  agentPhone: string
  views: number
  leads: number
  qrScans: number
  status: string
  isUserGenerated?: boolean
  createdAt?: string
}

const DEFAULT_PROPERTIES: Property[] = [
  {
    id: 1,
    title: "Casa moderna en Carrasco",
    type: "Casa",
    address: "Av. Bolivia 1234, Carrasco, Montevideo",
    operation: "Venta",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
    contact: "+598 99 123 456",
    hasStreetView: true,
    description: "Hermosa casa moderna de 3 plantas con amplio jardin y piscina. Acabados de primera calidad, cocina americana equipada, 4 dormitorios con vestidores, 3 banos completos. Garage para 2 vehiculos.",
    features: ["4 Dormitorios", "3 Banos", "Piscina", "Jardin", "Garage doble", "Parrillero"],
    agent: "Maria Gonzalez",
    agentPhone: "+598 99 123 456",
    views: 245,
    leads: 32,
    qrScans: 156,
    status: "active"
  },
  {
    id: 2,
    title: "Apartamento en Pocitos",
    type: "Apartamento",
    address: "Av. Brasil 2567, Pocitos, Montevideo",
    operation: "Alquiler",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
    contact: "+598 99 234 567",
    hasStreetView: true,
    description: "Luminoso apartamento a 2 cuadras de la rambla. Vista panoramica, living-comedor amplio, cocina integrada. Edificio con porteria 24hs, gimnasio y azotea con parrillero.",
    features: ["2 Dormitorios", "1 Bano", "Vista al mar", "Porteria 24hs", "Gimnasio"],
    agent: "Carlos Perez",
    agentPhone: "+598 99 234 567",
    views: 189,
    leads: 24,
    qrScans: 98,
    status: "active"
  },
  {
    id: 3,
    title: "Cochera cubierta en Centro",
    type: "Cochera",
    address: "18 de Julio 1890, Centro, Montevideo",
    operation: "Alquiler",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    contact: "+598 99 345 678",
    hasStreetView: false,
    description: "Cochera cubierta en edificio centrico con acceso las 24 horas. Espacio para vehiculo mediano o grande. Excelente ubicacion cerca de principales avenidas.",
    features: ["Cubierta", "Acceso 24hs", "Seguridad", "Portero electrico"],
    agent: "Laura Martinez",
    agentPhone: "+598 99 345 678",
    views: 67,
    leads: 8,
    qrScans: 34,
    status: "active"
  },
  {
    id: 4,
    title: "Local comercial en Punta Carretas",
    type: "Local Comercial",
    address: "Ellauri 850, Punta Carretas, Montevideo",
    operation: "Venta",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
    contact: "+598 99 456 789",
    hasStreetView: true,
    description: "Local comercial de 120m2 en zona de alto transito. Vidriera amplia, bano privado, deposito. Ideal para comercio minorista o servicios profesionales.",
    features: ["120m2", "Vidriera", "Deposito", "Bano privado", "Alto transito"],
    agent: "Roberto Silva",
    agentPhone: "+598 99 456 789",
    views: 156,
    leads: 18,
    qrScans: 89,
    status: "active"
  },
  {
    id: 5,
    title: "Apartamento amplio en Cordon",
    type: "Apartamento",
    address: "Gaboto 1540, Cordon, Montevideo",
    operation: "Alquiler",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
    contact: "+598 99 567 890",
    hasStreetView: true,
    description: "Amplio apartamento de 3 dormitorios en edificio de epoca reciclado. Techos altos, pisos de madera originales, balcon al frente. Excelente luz natural.",
    features: ["3 Dormitorios", "2 Banos", "Balcon", "Pisos de madera", "Techos altos"],
    agent: "Ana Rodriguez",
    agentPhone: "+598 99 567 890",
    views: 134,
    leads: 15,
    qrScans: 67,
    status: "active"
  },
  {
    id: 6,
    title: "Casa con jardin en Malvin",
    type: "Casa",
    address: "Aconcagua 2345, Malvin, Montevideo",
    operation: "Venta",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
    contact: "+598 99 678 901",
    hasStreetView: true,
    description: "Encantadora casa de 2 plantas con jardin y fondo. Zona tranquila, cerca de la rambla. Living con estufa a lena, cocina comedor, 3 dormitorios. Garage.",
    features: ["3 Dormitorios", "2 Banos", "Jardin", "Garage", "Estufa a lena", "Fondo"],
    agent: "Diego Fernandez",
    agentPhone: "+598 99 678 901",
    views: 178,
    leads: 21,
    qrScans: 112,
    status: "active"
  }
]

const USER_PROPERTIES_KEY = "casadata_user_properties"

export function getAllProperties(): Property[] {
  if (typeof window === "undefined") return DEFAULT_PROPERTIES
  
  const userProperties = localStorage.getItem(USER_PROPERTIES_KEY)
  const parsedUserProperties: Property[] = userProperties ? JSON.parse(userProperties) : []
  
  return [...DEFAULT_PROPERTIES, ...parsedUserProperties]
}

export function getPropertyById(id: number): Property | undefined {
  return getAllProperties().find(p => p.id === id)
}

export function getUserProperties(): Property[] {
  if (typeof window === "undefined") return []
  
  const userProperties = localStorage.getItem(USER_PROPERTIES_KEY)
  return userProperties ? JSON.parse(userProperties) : []
}

export function saveUserProperty(propertyData: Omit<Property, "id" | "views" | "leads" | "qrScans" | "isUserGenerated" | "createdAt">): Property {
  const allProperties = getAllProperties()
  const maxId = Math.max(...allProperties.map(p => p.id), 0)
  
  const newProperty: Property = {
    ...propertyData,
    id: maxId + 1,
    views: 0,
    leads: 0,
    qrScans: 0,
    isUserGenerated: true,
    createdAt: new Date().toISOString()
  }
  
  const userProperties = getUserProperties()
  userProperties.push(newProperty)
  localStorage.setItem(USER_PROPERTIES_KEY, JSON.stringify(userProperties))
  
  return newProperty
}

export function incrementPropertyViews(id: number): void {
  if (typeof window === "undefined") return
  
  const userProperties = getUserProperties()
  const propertyIndex = userProperties.findIndex(p => p.id === id)
  
  if (propertyIndex !== -1) {
    userProperties[propertyIndex].views += 1
    localStorage.setItem(USER_PROPERTIES_KEY, JSON.stringify(userProperties))
  }
}

export function trackLead(id: number): void {
  if (typeof window === "undefined") return
  
  const userProperties = getUserProperties()
  const propertyIndex = userProperties.findIndex(p => p.id === id)
  
  if (propertyIndex !== -1) {
    userProperties[propertyIndex].leads += 1
    localStorage.setItem(USER_PROPERTIES_KEY, JSON.stringify(userProperties))
  }
}

export function getLeadStats() {
  const allProperties = getAllProperties()
  
  const totalViews = allProperties.reduce((sum, p) => sum + p.views, 0)
  const totalLeads = allProperties.reduce((sum, p) => sum + p.leads, 0)
  const totalQrScans = allProperties.reduce((sum, p) => sum + p.qrScans, 0)
  const conversionRate = totalViews > 0 ? Math.round((totalLeads / totalViews) * 100) : 0
  
  return {
    totalViews,
    totalLeads,
    totalQrScans,
    conversionRate
  }
}
