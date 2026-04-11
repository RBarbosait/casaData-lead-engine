"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MapPin, Phone, Home, Building, Car, Search, Navigation, Share, Menu } from "lucide-react"
import { getAllProperties, incrementPropertyViews, type Property } from "@/lib/properties"

const FEATURED_PROPERTY_URL =
  "https://casadata-lead-engine.pages.dev/inmueble/cmnb6o8k10000ov0054anf7tg"

function PropertyCard({
  property,
  href,
}: {
  property: Property
  href?: string
}) {
  const handleShareProperty = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const propertyUrl =
      href || `${window.location.origin}/inmueble/${property.id}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${property.type} - ${property.address}`,
          text: `Mira esta propiedad: ${property.type} en ${property.address}`,
          url: propertyUrl,
        })
      } catch (error) {
        await navigator.clipboard.writeText(propertyUrl)
        alert("Link copiado al portapapeles")
      }
    } else {
      try {
        await navigator.clipboard.writeText(propertyUrl)
        alert("Link copiado al portapapeles")
      } catch (error) {
        console.error("Error al copiar:", error)
      }
    }
  }

  const handleCardClick = () => {
    incrementPropertyViews(property.id)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Casa":
        return <Home className="w-4 h-4" />
      case "Apartamento":
        return <Building className="w-4 h-4" />
      case "Local Comercial":
        return <Building className="w-4 h-4" />
      case "Cochera":
        return <Car className="w-4 h-4" />
      default:
        return <Home className="w-4 h-4" />
    }
  }

  return (
    <Link href={href || `/inmueble/${property.id}`} onClick={handleCardClick}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className="relative">
          <img
            src={property.image || "/placeholder.svg"}
            alt={property.type}
            className="w-full h-48 object-cover"
          />
          <Badge
            className="absolute top-2 left-2"
            variant={property.operation === "Venta" ? "default" : "secondary"}
          >
            {property.operation}
          </Badge>
          {property.isUserGenerated && (
            <Badge
              className="absolute top-2 right-2 bg-emerald-500 text-white"
              variant="default"
            >
              Nuevo
            </Badge>
          )}
        </div>

        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 mb-1">
            {getTypeIcon(property.type)}
            <CardTitle className="text-lg">
              {property.title || property.type}
            </CardTitle>
          </div>

          <CardDescription className="flex items-start gap-1">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span className="text-sm">{property.address}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1"
              onClick={(e) => e.preventDefault()}
            >
              <Phone className="w-4 h-4 mr-1" />
              Contactar
            </Button>
            <Button size="sm" variant="outline" onClick={handleShareProperty}>
              <Share className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function InmueblesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [nearbyMode, setNearbyMode] = useState(false)
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  const searchParams = useSearchParams()
  useEffect(() => {
  setLoading(true)
  getAllProperties()
    .then(setProperties)
    .finally(() => setLoading(false))
}, [])

  useEffect(() => {
    const scrollTo = searchParams.get("scrollTo")
    if (scrollTo) {
      setTimeout(() => {
        const element = document.querySelector(
          `[data-property-id="${scrollTo}"]`
        )
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }, 100)
    }
  }, [searchParams])
function PropertySkeleton() {
  return (
    <Card className="overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-muted" />

      <CardHeader className="pb-2">
        <div className="h-4 bg-muted rounded w-2/3 mb-2" />
        <div className="h-3 bg-muted rounded w-1/2" />
      </CardHeader>

      <CardContent>
        <div className="flex gap-2">
          <div className="h-8 bg-muted rounded flex-1" />
          <div className="h-8 bg-muted rounded w-10" />
        </div>
      </CardContent>
    </Card>
  )
}
  const filteredProperties = properties.filter(
    (property) =>
      property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (property.title &&
        property.title.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <img src="/casadata-logo.png" alt="casaData" className="w-8 h-8" />
              <h1 className="text-2xl font-bold text-foreground">casaData</h1>
            </Link>

            <div className="flex items-center gap-2">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  Mi Dashboard
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Sobre nosotros</DropdownMenuItem>
                  <DropdownMenuItem>Contacto</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <section className="bg-primary text-primary-foreground py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Todas las propiedades</h2>
            <p className="text-primary-foreground/80">
              Encuentra casas, apartamentos, cocheras, negocios y espacios de almacenamiento
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar por dirección o tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background text-foreground"
              />
              <Button
                size="sm"
                variant="secondary"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setNearbyMode(!nearbyMode)}
              >
                <Navigation className="w-4 h-4 mr-1" />
                {nearbyMode ? "Todas" : "Cerca de mí"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-8" id="properties-grid">
        <div className="max-w-7xl mx-auto px-4">
          {nearbyMode && (
            <div className="mb-6 p-4 bg-muted rounded-lg text-center">
              <Navigation className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Mostrando propiedades cerca de tu ubicación
              </p>
            </div>
          )}

          {loading ? (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: 8 }).map((_, i) => (
      <PropertySkeleton key={i} />
    ))}
  </div>
) : filteredProperties.length === 0 ? (
            <div className="text-center py-12">
              <Home className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No se encontraron propiedades
              </h3>
              <p className="text-muted-foreground">
                Intenta con otros términos de búsqueda
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProperties.map((property, index) => (
                <div key={property.id} data-property-id={property.id}>
                  <PropertyCard
                    property={property}
                    href={index === 0 ? FEATURED_PROPERTY_URL : undefined}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <img
                src="/casadata-logo.png"
                alt="casaData"
                className="w-6 h-6"
              />
              <span className="text-lg font-semibold text-foreground">
                casaData
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              Tu próximo hogar está a un escaneo de distancia
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

