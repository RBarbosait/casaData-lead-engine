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
  <div className="min-h-screen bg-gradient-to-br from-background to-muted">

    {/* NAV */}
    <div className="absolute top-4 right-4 flex gap-2">
      <Link href="/how-it-works">
        <Button variant="ghost" size="sm">Cómo funciona</Button>
      </Link>
      <Link href="/about">
        <Button variant="ghost" size="sm">About</Button>
      </Link>
      <Link href="/auth/login">
        <Button variant="outline" size="sm">Iniciar sesión</Button>
      </Link>
      <Link href="/auth/register">
        <Button size="sm">Registrarse</Button>
      </Link>
    </div>

    <div className="max-w-md mx-auto text-center space-y-10 pt-24 px-4">

      {/* HERO */}
      <div className="space-y-4">
        <img src="/casadata-logo.png" className="w-16 h-16 mx-auto" />

        <h1 className="text-4xl font-bold">
          casaData
        </h1>

        <p className="text-gray-600 leading-relaxed">
          Detecta quién está realmente interesado en tus propiedades.
          <br />
          <span className="font-medium text-gray-900">
            No más visitas vacías.
          </span>
        </p>
      </div>

      {/* CTA */}
      <div className="space-y-3">
        <Link href="/inmuebles">
          <Button className="w-full h-14 text-lg bg-black hover:bg-black/90">
            <List className="w-5 h-5 mr-2" />
            Ver propiedades
          </Button>
        </Link>

        <Link href="/auth/register">
          <Button variant="outline" className="w-full h-14 text-lg">
            📝 Publicar propiedad
          </Button>
        </Link>
      </div>

      {/* VALUE */}
      <div className="bg-black text-white rounded-xl p-5 space-y-2">
        <p className="text-sm opacity-80">
          🚀 Primera publicación gratis
        </p>
        <p className="text-sm font-medium">
          Mide visitas, intención y contactos en tiempo real
        </p>
      </div>

      {/* 🔥 HOW IT WORKS MINI */}
      <div className="text-left space-y-4 pt-6">
        <h2 className="text-lg font-semibold text-center">
          Cómo funciona
        </h2>

        <div className="space-y-3 text-sm text-gray-600">
          <div className="p-3 rounded-lg border bg-white">
            1. Publicás tu propiedad
          </div>
          <div className="p-3 rounded-lg border bg-white">
            2. Compartís el QR
          </div>
          <div className="p-3 rounded-lg border bg-white">
            3. Ves quién realmente está interesado
          </div>
        </div>

        <Link href="/how-it-works">
          <Button variant="ghost" className="w-full">
            Ver más →
          </Button>
        </Link>
      </div>

      <p className="text-xs text-gray-500">
        Escaneaste un QR desde un cartel inmobiliario
      </p>
    </div>
  </div>
)
