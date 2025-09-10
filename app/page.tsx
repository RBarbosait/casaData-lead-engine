"use client"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { List } from "lucide-react"

function SplashScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 2500)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 bg-gray-100 flex items-center justify-center z-50">
      <div className="text-center animate-fade-in">
        <div className="mb-8">
          <div className="mb-4">
            <img src="/casadata-logo.png" alt="casaData" className="w-20 h-20 mx-auto" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">casaData</h1>
          <p className="text-gray-700 text-lg">Tu hogar te está esperando</p>
        </div>
        <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full mx-auto"></div>
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
        <div className="absolute top-4 right-4 flex space-x-2">
          <Link href="/auth/login">
            <Button variant="outline" size="sm">
              Iniciar Sesión
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button size="sm">Registrarse</Button>
          </Link>
        </div>

        <div className="space-y-4">
          <div className="mb-4">
            <img src="/casadata-logo.png" alt="casaData" className="w-16 h-16 mx-auto" />
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
            <Button variant="outline" className="w-full h-14 text-lg bg-transparent" size="lg">
              📝 Publicar mi propiedad
            </Button>
          </Link>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <p className="text-sm text-emerald-800 font-medium">🎉 Primera publicación GRATIS para nuevos usuarios</p>
        </div>

        <p className="text-sm text-muted-foreground">Escaneaste un código QR desde un cartel inmobiliario</p>
      </div>
    </div>
  )
}
