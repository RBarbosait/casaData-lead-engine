"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Upload, Gift, CreditCard, CheckCircle, X, ImageIcon } from "lucide-react"
import { saveUserProperty } from "@/lib/properties"

interface User {
  email: string
  name: string
  freePublicationUsed: boolean
  subscriptionType: string | null
  paidPublications?: number
}

export default function PublishPage() {
  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    address: "",
    description: "",
    contact: "",
    operation: "Venta",
    features: "",
    agent: "",
    agentPhone: "",
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const userData = localStorage.getItem("casadata_user")
    if (!userData) {
      router.push("/auth/login")
      return
    }
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    setFormData((prev) => ({
      ...prev,
      agent: parsedUser.name,
      agentPhone: parsedUser.phone || "",
    }))
  }, [router])

  const handleImageSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file)

      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleImageSelect(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    const canPublishFree = !user.freePublicationUsed
    const hasSubscription = user.subscriptionType
    const hasPaidPublications = user.paidPublications && user.paidPublications > 0

    if (!canPublishFree && !hasSubscription && !hasPaidPublications) {
      router.push("/dashboard/payment")
      return
    }

    setIsLoading(true)

    try {
      const imageUrl = imagePreview || "/modern-property-exterior.png"

      const newProperty = saveUserProperty({
        title: formData.title,
        type: formData.type,
        address: formData.address,
        operation: formData.operation,
        image: imageUrl,
        contact: formData.contact,
        hasStreetView: false,
        description: formData.description,
        features: formData.features
          .split(",")
          .map((f) => f.trim())
          .filter((f) => f),
        agent: formData.agent || user.name,
        agentPhone: formData.agentPhone || formData.contact,
        status: "active",
      })

      const updatedUser = { ...user }

      if (!user.freePublicationUsed) {
        updatedUser.freePublicationUsed = true
      } else if (user.paidPublications && user.paidPublications > 0) {
        updatedUser.paidPublications = user.paidPublications - 1
      }

      localStorage.setItem("casadata_user", JSON.stringify(updatedUser))

      setIsLoading(false)
      router.push(`/dashboard?published=${newProperty.id}`)
    } catch (error) {
      console.error("Error saving property:", error)
      setIsLoading(false)
    }
  }

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>
  }

  const canPublishFree = !user.freePublicationUsed
  const hasSubscription = user.subscriptionType
  const hasPaidPublications = user.paidPublications && user.paidPublications > 0
  const needsPayment = !canPublishFree && !hasSubscription && !hasPaidPublications
  const showPaidAlert = searchParams.get("paid") === "true"

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <ArrowLeft className="w-5 h-5" />
                <span>Volver al Dashboard</span>
              </Link>
            </div>

            <div className="flex items-center space-x-2">
              <img src="/casadata-logo.png" alt="casaData" className="w-8 h-8" />
              <span className="font-bold text-xl">casaData</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {showPaidAlert && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                ¡Pago procesado exitosamente! Ahora puedes crear tu publicación.
              </AlertDescription>
            </Alert>
          )}

          {canPublishFree && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Gift className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="font-medium text-emerald-800">Publicación Gratuita</h3>
                  <p className="text-sm text-emerald-700">Esta es tu primera publicación, completamente gratis</p>
                </div>
              </div>
            </div>
          )}

          {hasSubscription && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-yellow-600" />
                <div>
                  <h3 className="font-medium text-yellow-800">Plan {user.subscriptionType}</h3>
                  <p className="text-sm text-yellow-700">Publicaciones ilimitadas incluidas en tu plan</p>
                </div>
              </div>
            </div>
          )}

          {hasPaidPublications && !hasSubscription && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="font-medium text-blue-800">Publicaciones Pagadas</h3>
                  <p className="text-sm text-blue-700">
                    Tienes {user.paidPublications} publicaciones pagadas disponibles
                  </p>
                </div>
              </div>
            </div>
          )}

          {needsPayment && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <div>
                    <h3 className="font-medium text-blue-800">Publicación de Pago</h3>
                    <p className="text-sm text-blue-700">
                      $500 por publicación o suscríbete para publicaciones ilimitadas
                    </p>
                  </div>
                </div>
                <Link href="/dashboard/payment">
                  <Button size="sm">Ver Planes</Button>
                </Link>
              </div>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Nueva Publicación</CardTitle>
              <CardDescription>Completa la información de tu propiedad</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Título de la publicación</Label>
                  <Input
                    id="title"
                    placeholder="Ej: Casa moderna en Pocitos"
                    value={formData.title}
                    onChange={(e) => updateFormData("title", e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo de propiedad</Label>
                    <Select value={formData.type} onValueChange={(value) => updateFormData("type", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Casa">Casa</SelectItem>
                        <SelectItem value="Apartamento">Apartamento</SelectItem>
                        <SelectItem value="Cochera">Cochera</SelectItem>
                        <SelectItem value="Local Comercial">Local Comercial</SelectItem>
                        <SelectItem value="Espacio de Almacenamiento">Espacio de Almacenamiento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="operation">Operación</Label>
                    <Select value={formData.operation} onValueChange={(value) => updateFormData("operation", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona operación" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Venta">Venta</SelectItem>
                        <SelectItem value="Alquiler">Alquiler</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    placeholder="Dirección completa"
                    value={formData.address}
                    onChange={(e) => updateFormData("address", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe las características de la propiedad..."
                    value={formData.description}
                    onChange={(e) => updateFormData("description", e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="features">Características (separadas por comas)</Label>
                  <Input
                    id="features"
                    placeholder="Ej: 3 dormitorios, 2 baños, jardín, garaje"
                    value={formData.features}
                    onChange={(e) => updateFormData("features", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="agent">Nombre del agente</Label>
                    <Input
                      id="agent"
                      placeholder="Tu nombre"
                      value={formData.agent}
                      onChange={(e) => updateFormData("agent", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact">Teléfono de contacto</Label>
                    <Input
                      id="contact"
                      placeholder="+598 99 123 456"
                      value={formData.contact}
                      onChange={(e) => updateFormData("contact", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Imagen principal</Label>
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={removeImage}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                        isDragOver ? "border-cyan-400 bg-cyan-50" : "border-gray-300 hover:border-gray-400"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <div className="flex items-center space-x-2">
                          <Upload className="w-8 h-8 text-gray-400" />
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Arrastra una imagen aquí o haz clic para seleccionar
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Formatos soportados: JPG, PNG, GIF (máx. 10MB)</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileInputChange}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading || needsPayment} size="lg">
                  {isLoading ? "Publicando..." : needsPayment ? "Ir a Pagos" : "Publicar Propiedad"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
