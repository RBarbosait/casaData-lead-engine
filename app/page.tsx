"use client"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { List, Home } from "lucide-react"

function SplashScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 2500)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="text-center animate-fade-in">
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary">
              <Home className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">casaData</h1>
          <p className="text-muted-foreground text-lg">Tu hogar te esta esperando</p>
        </div>
        <div className="animate-spin w-8 h-8 border-2 border-muted border-t-primary rounded-full mx-auto"></div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true)
  const searchParams = useSearchParams()

  useEffect(() => {
    const propertyId = searchParams.get("id")
    if (propertyId) {
      setShowSplash(false)
      window.location.href = `/inmueble/${propertyId}`
      return
    }
  }, [searchParams])

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="absolute top-4 right-4 flex gap-2">
          <Link href="/auth/login">
            <Button variant="outline" size="sm">
              Iniciar Sesion
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button size="sm">Registrarse</Button>
          </Link>
        </div>

        <div className="space-y-4">
          <div className="mb-4 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
              <Home className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">casaData</h1>
          <p className="text-muted-foreground text-balance">
            Explora casas, apartamentos, cocheras, negocios y espacios de almacenamiento.
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/inmuebles">
            <Button className="w-full h-14 text-lg" size="lg">
              <List className="w-5 h-5 mr-2" />
              Ver todos los inmuebles
            </Button>
          </Link>

          <Link href="/auth/register">
            <Button variant="outline" className="w-full h-14 text-lg" size="lg">
              Publicar mi propiedad
            </Button>
          </Link>
        </div>

        <div className="bg-secondary/20 border border-secondary/30 rounded-lg p-4">
          <p className="text-sm text-secondary font-medium">Primera publicacion GRATIS para nuevos usuarios</p>
        </div>

        <p className="text-sm text-muted-foreground">Escaneaste un codigo QR desde un cartel inmobiliario</p>
      </div>
    </div>
  )
}
