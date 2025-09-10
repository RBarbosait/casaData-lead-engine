"use client"

import { useState, useRef, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Eye, Home, Building, Car, ArrowLeft, Copy, QrCode, Download, Printer } from "lucide-react"
import { getPropertyById, incrementPropertyViews } from "@/lib/properties"

export default function PropertyPage() {
  const params = useParams()
  const router = useRouter()
  const [showContact, setShowContact] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)

  const propertyId = Number.parseInt(params.id as string)
  const property = getPropertyById(propertyId)

  const getPropertyUrl = () => {
    if (typeof window !== "undefined") {
      // Detectar si estamos en el entorno de preview de v0 o en producción
      const currentOrigin = window.location.origin
      if (currentOrigin.includes("preview-") || currentOrigin.includes("v0.app")) {
        // Usar el dominio de producción de Vercel
        return `https://v0-inmobiliaria-app-five.vercel.app/inmueble/${propertyId}`
      }
      return `${currentOrigin}/inmueble/${propertyId}`
    }
    return `https://v0-inmobiliaria-app-five.vercel.app/inmueble/${propertyId}`
  }

  const propertyUrl = getPropertyUrl()

  useEffect(() => {
    if (property) {
      incrementPropertyViews(propertyId)
    }
  }, [propertyId, property])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(propertyUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const handleBackClick = () => {
    router.push(`/inmuebles?scrollTo=${propertyId}`)
  }

  const printQR = () => {
    if (qrRef.current) {
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Código QR - ${property?.title || property?.type} - ${property?.address}</title>
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  text-align: center; 
                  padding: 20px;
                  margin: 0;
                }
                .qr-container {
                  border: 2px solid #000;
                  padding: 20px;
                  margin: 20px auto;
                  max-width: 400px;
                  background: white;
                }
                .property-info {
                  margin-bottom: 15px;
                  font-size: 14px;
                }
                .qr-code {
                  margin: 20px 0;
                }
                .url {
                  font-size: 12px;
                  color: #666;
                  margin-top: 10px;
                }
              </style>
            </head>
            <body>
              <div class="qr-container">
                <div class="property-info">
                  <h2>${property?.title || property?.type}</h2>
                  <p>${property?.address}</p>
                  <p><strong>${property?.operation}</strong></p>
                </div>
                <div class="qr-code">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(propertyUrl)}" alt="Código QR" />
                </div>
                <div class="url">
                  Escanea para ver detalles<br>
                  ${propertyUrl.replace("https://", "")}
                </div>
              </div>
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Casa":
        return <Home className="w-5 h-5" />
      case "Apartamento":
        return <Building className="w-5 h-5" />
      case "Local Comercial":
        return <Building className="w-5 h-5" />
      case "Cochera":
        return <Car className="w-5 h-5" />
      default:
        return <Home className="w-5 h-5" />
    }
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Propiedad no encontrada</h1>
          <p className="text-muted-foreground mb-4">La propiedad que buscas no existe o ha sido eliminada.</p>
          <Button onClick={() => router.push("/inmuebles")}>Volver al listado</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleBackClick}>
                <ArrowLeft className="w-4 h-4 mr-1" />
                Volver
              </Button>
              <div className="flex items-center gap-2">
                <img src="/casadata-logo.png" alt="casaData" className="w-6 h-6" />
                <span className="text-lg font-semibold text-foreground">casaData</span>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={copyLink}>
              <Copy className="w-4 h-4 mr-1" />
              {copied ? "¡Copiado!" : "Copiar enlace"}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Property Image */}
        <div className="relative mb-8">
          <img
            src={property.image || "/placeholder.svg"}
            alt={property.type}
            className="w-full h-64 md:h-96 object-cover rounded-lg"
          />
          <Badge
            className="absolute top-4 left-4 text-sm px-3 py-1"
            variant={property.operation === "Venta" ? "default" : "secondary"}
          >
            {property.operation}
          </Badge>
          {property.isUserGenerated && (
            <Badge className="absolute top-4 right-4 bg-emerald-500 text-white" variant="default">
              Publicación de usuario
            </Badge>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Property Header */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                {getTypeIcon(property.type)}
                <h1 className="text-3xl font-bold text-foreground">{property.title || property.type}</h1>
              </div>
              <div className="flex items-start gap-2 text-muted-foreground mb-4">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span className="text-lg">{property.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="w-4 h-4" />
                <span>{property.views} visualizaciones</span>
              </div>
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Descripción</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{property.description}</p>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>Características</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.features.map((feature, index) => (
                    <Badge key={index} variant="outline" className="justify-center py-2">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle>Contacto</CardTitle>
                <CardDescription>Agente inmobiliario</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold text-foreground">{property.agent}</p>
                  <p className="text-sm text-muted-foreground">Agente especializado</p>
                </div>

                {showContact ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">{property.agentPhone}</p>
                    <Button className="w-full" onClick={() => window.open(`tel:${property.agentPhone}`)}>
                      <Phone className="w-4 h-4 mr-2" />
                      Llamar ahora
                    </Button>
                  </div>
                ) : (
                  <Button className="w-full" onClick={() => setShowContact(true)}>
                    <Phone className="w-4 h-4 mr-2" />
                    Ver contacto
                  </Button>
                )}

                {property.hasStreetView && (
                  <Button variant="outline" className="w-full bg-transparent">
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Street View
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* QR Code Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  Código QR
                </CardTitle>
                <CardDescription>Para imprimir y colocar en el inmueble</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!showQR ? (
                  <Button variant="outline" className="w-full bg-transparent" onClick={() => setShowQR(true)}>
                    <QrCode className="w-4 h-4 mr-2" />
                    Mostrar código QR
                  </Button>
                ) : (
                  <div className="space-y-4" ref={qrRef}>
                    <div className="text-center">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(propertyUrl)}`}
                        alt="Código QR del inmueble"
                        className="mx-auto border rounded-lg"
                      />
                      <p className="text-xs text-muted-foreground mt-2">Escanea para ver detalles del inmueble</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" onClick={printQR} className="text-xs bg-transparent">
                        <Printer className="w-3 h-3 mr-1" />
                        Imprimir
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const link = document.createElement("a")
                          link.href = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(propertyUrl)}`
                          link.download = `qr-inmueble-${propertyId}.png`
                          link.click()
                        }}
                        className="text-xs"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Descargar
                      </Button>
                    </div>

                    <Button variant="ghost" size="sm" onClick={() => setShowQR(false)} className="w-full text-xs">
                      Ocultar QR
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* QR Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Información QR</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Escaneaste este código desde un cartel inmobiliario. Comparte esta URL: <br />
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">{propertyUrl.replace("https://", "")}</code>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
