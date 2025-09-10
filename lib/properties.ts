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
  status: "active" | "pending" | "expired"
  views: number
  createdAt: string
  userId?: string
  isUserGenerated?: boolean
}

// Mock properties (existing ones)
const defaultProperties: Property[] = [
  {
    id: 1,
    title: "Casa moderna en zona residencial",
    type: "Casa",
    address: "Av. 18 de Julio 1234, Montevideo",
    operation: "Venta",
    image: "/modern-house-exterior.png",
    contact: "+598 99 123 456",
    hasStreetView: true,
    description:
      "Hermosa casa de 3 dormitorios con jardín amplio, ideal para familias. Ubicada en zona residencial tranquila con fácil acceso a servicios.",
    features: ["3 dormitorios", "2 baños", "Jardín", "Garaje", "150m²"],
    agent: "María González",
    agentPhone: "+598 99 123 456",
    status: "active",
    views: 45,
    createdAt: "2024-01-15",
    isUserGenerated: false,
  },
  {
    id: 2,
    title: "Apartamento con vista al mar",
    type: "Apartamento",
    address: "Pocitos, Montevideo",
    operation: "Alquiler",
    image: "/modern-apartment-building.png",
    contact: "+598 99 654 321",
    hasStreetView: true,
    description:
      "Moderno apartamento con vista al mar en Pocitos. Totalmente amueblado y equipado, listo para habitar.",
    features: ["2 dormitorios", "1 baño", "Balcón", "Vista al mar", "80m²"],
    agent: "Carlos Rodríguez",
    agentPhone: "+598 99 654 321",
    status: "active",
    views: 32,
    createdAt: "2024-01-18",
    isUserGenerated: false,
  },
  {
    id: 3,
    title: "Local comercial en zona histórica",
    type: "Local Comercial",
    address: "Ciudad Vieja, Montevideo",
    operation: "Alquiler",
    image: "/commercial-storefront.png",
    contact: "+598 99 789 012",
    hasStreetView: false,
    description:
      "Amplio local comercial en zona histórica, ideal para restaurante o tienda. Excelente ubicación con alto tránsito peatonal.",
    features: ["120m²", "Vidriera amplia", "Baño", "Depósito", "Zona histórica"],
    agent: "Ana Martínez",
    agentPhone: "+598 99 789 012",
    status: "active",
    views: 28,
    createdAt: "2024-01-20",
    isUserGenerated: false,
  },
  {
    id: 4,
    title: "Cochera cubierta con portero",
    type: "Cochera",
    address: "Cordón, Montevideo",
    operation: "Alquiler",
    image: "/multi-level-parking.png",
    contact: "+598 99 345 678",
    hasStreetView: false,
    description: "Cochera cubierta en edificio con portero. Acceso fácil y seguro las 24 horas.",
    features: ["Cubierta", "Portero 24hs", "Acceso fácil", "Segura"],
    agent: "Luis Fernández",
    agentPhone: "+598 99 345 678",
    status: "active",
    views: 15,
    createdAt: "2024-01-22",
    isUserGenerated: false,
  },
]

// Property management functions
export const getAllProperties = (): Property[] => {
  const userProperties = getUserProperties()
  return [...defaultProperties, ...userProperties]
}

export const getPropertyById = (id: number): Property | undefined => {
  const allProperties = getAllProperties()
  return allProperties.find((p) => p.id === id)
}

export const getUserProperties = (): Property[] => {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem("casadata_user_properties")
  return stored ? JSON.parse(stored) : []
}

export const saveUserProperty = (
  property: Omit<Property, "id" | "views" | "createdAt" | "isUserGenerated">,
): Property => {
  const userProperties = getUserProperties()
  const allProperties = getAllProperties()

  // Generate new ID
  const maxId = Math.max(...allProperties.map((p) => p.id), 0)
  const newProperty: Property = {
    ...property,
    id: maxId + 1,
    views: 0,
    createdAt: new Date().toISOString().split("T")[0],
    isUserGenerated: true,
    status: "active",
  }

  const updatedProperties = [...userProperties, newProperty]
  localStorage.setItem("casadata_user_properties", JSON.stringify(updatedProperties))

  return newProperty
}

export const updateUserProperty = (id: number, updates: Partial<Property>): Property | null => {
  const userProperties = getUserProperties()
  const propertyIndex = userProperties.findIndex((p) => p.id === id)

  if (propertyIndex === -1) return null

  const updatedProperty = { ...userProperties[propertyIndex], ...updates }
  userProperties[propertyIndex] = updatedProperty

  localStorage.setItem("casadata_user_properties", JSON.stringify(userProperties))
  return updatedProperty
}

export const deleteUserProperty = (id: number): boolean => {
  const userProperties = getUserProperties()
  const filteredProperties = userProperties.filter((p) => p.id !== id)

  if (filteredProperties.length === userProperties.length) return false

  localStorage.setItem("casadata_user_properties", JSON.stringify(filteredProperties))
  return true
}

export const incrementPropertyViews = (id: number): void => {
  const userProperties = getUserProperties()
  const propertyIndex = userProperties.findIndex((p) => p.id === id)

  if (propertyIndex !== -1) {
    userProperties[propertyIndex].views += 1
    localStorage.setItem("casadata_user_properties", JSON.stringify(userProperties))
  }
}
