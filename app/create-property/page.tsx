'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { QRCodeDisplay } from '@/components/qr-code-display'
import { 
  Home, 
  MapPin, 
  DollarSign, 
  Phone, 
  FileText, 
  Image as ImageIcon,
  Loader2,
  ArrowRight,
  CheckCircle
} from 'lucide-react'
import { toast } from 'sonner'

export default function CreatePropertyPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [createdProperty, setCreatedProperty] = useState<{
    id: string
    title: string
    url: string
  } | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    location: '',
    description: '',
    type: 'casa',
    phone: '',
    images: ''
  })

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.price || !formData.location || !formData.phone) {
      toast.error('Por favor completa los campos requeridos')
      return
    }
    
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newPropertyId = crypto.randomUUID().slice(0, 8)
    const propertyUrl = `${window.location.origin}/property/${newPropertyId}?source=qr`
    
    setCreatedProperty({
      id: newPropertyId,
      title: formData.title,
      url: propertyUrl
    })
    
    toast.success('Propiedad creada exitosamente')
    setIsLoading(false)
  }

  if (createdProperty) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        
        <main className="flex-1">
          <div className="container mx-auto px-4 py-12">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              
              <h1 className="mb-4 text-3xl font-bold">Propiedad creada</h1>
              <p className="mb-8 text-muted-foreground">
                Tu propiedad &quot;{createdProperty.title}&quot; fue publicada exitosamente. 
                Descarga el codigo QR para tus carteles.
              </p>
              
              <Card className="mb-8">
                <CardContent className="p-8">
                  <QRCodeDisplay 
                    url={createdProperty.url} 
                    title={createdProperty.title}
                  />
                </CardContent>
              </Card>
              
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button asChild>
                  <Link href="/dashboard">
                    Ir al Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" onClick={() => setCreatedProperty(null)}>
                  Crear otra propiedad
                </Button>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-3xl font-bold">Publicar propiedad</h1>
              <p className="text-muted-foreground">
                Completa el formulario para crear tu ficha digital y generar el codigo QR
              </p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Informacion de la propiedad</CardTitle>
                <CardDescription>
                  Los campos marcados con * son obligatorios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="title">Titulo *</FieldLabel>
                      <div className="relative">
                        <Home className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="title"
                          placeholder="Ej: Casa moderna en Carrasco"
                          className="pl-10"
                          value={formData.title}
                          onChange={(e) => handleChange('title', e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                    </Field>
                    
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="price">Precio (USD) *</FieldLabel>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="price"
                            type="number"
                            placeholder="285000"
                            className="pl-10"
                            value={formData.price}
                            onChange={(e) => handleChange('price', e.target.value)}
                            disabled={isLoading}
                          />
                        </div>
                      </Field>
                      
                      <Field>
                        <FieldLabel htmlFor="type">Tipo de propiedad</FieldLabel>
                        <Select
                          value={formData.type}
                          onValueChange={(value) => handleChange('type', value)}
                          disabled={isLoading}
                        >
                          <SelectTrigger id="type">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="casa">Casa</SelectItem>
                            <SelectItem value="apartamento">Apartamento</SelectItem>
                            <SelectItem value="terreno">Terreno</SelectItem>
                            <SelectItem value="oficina">Oficina</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    </div>
                    
                    <Field>
                      <FieldLabel htmlFor="location">Ubicacion *</FieldLabel>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="location"
                          placeholder="Ej: Carrasco, Montevideo"
                          className="pl-10"
                          value={formData.location}
                          onChange={(e) => handleChange('location', e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                    </Field>
                    
                    <Field>
                      <FieldLabel htmlFor="description">Descripcion</FieldLabel>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Textarea
                          id="description"
                          placeholder="Describe las caracteristicas principales de la propiedad..."
                          className="min-h-[120px] pl-10"
                          value={formData.description}
                          onChange={(e) => handleChange('description', e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                    </Field>
                    
                    <Field>
                      <FieldLabel htmlFor="phone">Telefono WhatsApp *</FieldLabel>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="phone"
                          placeholder="Ej: 59899123456"
                          className="pl-10"
                          value={formData.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Incluye el codigo de pais sin el signo +
                      </p>
                    </Field>
                    
                    <Field>
                      <FieldLabel htmlFor="images">URLs de imagenes</FieldLabel>
                      <div className="relative">
                        <ImageIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Textarea
                          id="images"
                          placeholder="Pega las URLs de las imagenes, una por linea"
                          className="min-h-[80px] pl-10"
                          value={formData.images}
                          onChange={(e) => handleChange('images', e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                    </Field>
                    
                    <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creando propiedad...
                        </>
                      ) : (
                        <>
                          Publicar y generar QR
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </FieldGroup>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
