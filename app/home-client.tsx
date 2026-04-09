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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex flex-col items-center p-4">

      {/* 🔥 NAV EXTRA (nuevo) */}
      <div className="absolute top-4 right-4 flex gap-2">
        <Link href="/how-it-works">
          <Button variant="ghost" size="sm">Cómo funciona</Button>
        </Link>
        <Link href="/about">
          <Button variant="ghost" size="sm">About</Button>
        </Link>
        <Link href="/auth/login">
          <Button variant="outline" size="sm">
            Iniciar Sesión
          </Button>
        </Link>
        <Link href="/auth/register">
          <Button size="sm">Registrarse</Button>
        </Link>
      </div>

      <div className="max-w-md w-full text-center space-y-8 mt-20">

        {/* HERO */}
        <div className="space-y-4">
          <div className="mb-4">
            <img src="/casadata-logo.png" alt="casaData" className="w-16 h-16 mx-auto" />
          </div>

          <h1 className="text-3xl font-bold text-foreground">
            casaData
          </h1>

          {/* 🔥 mejora sin romper tu texto */}
          <p className="text-muted-foreground text-balance">
            Explora casas, apartamentos, cocheras, negocios y espacios de almacenamiento.
          </p>

          {/* 🔥 agregado SaaS */}
          <p className="text-sm text-gray-600">
            Además, detecta quién está realmente interesado en cada propiedad.
          </p>
        </div>

        {/* CTA */}
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

        {/* VALUE */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <p className="text-sm text-emerald-800 font-medium">
            🎉 Primera publicación GRATIS para nuevos usuarios
          </p>
        </div>

        {/* 🔥 NUEVA SECCIÓN (clave SaaS) */}
        <div className="pt-6 space-y-4 text-left">
          <h2 className="text-center font-semibold text-lg">
            Cómo funciona
          </h2>

          <div className="space-y-3 text-sm text-gray-600">
            <div className="p-3 rounded-lg border bg-white">
              1. Publicás tu propiedad
            </div>
            <div className="p-3 rounded-lg border bg-white">
              2. Compartís el QR en carteles o redes
            </div>
            <div className="p-3 rounded-lg border bg-white">
              3. Medís visitas, interés y contactos reales
            </div>
          </div>

          <Link href="/how-it-works">
            <Button variant="ghost" className="w-full">
              Ver más →
            </Button>
          </Link>
        </div>

        {/* FOOT */}
        <p className="text-sm text-muted-foreground">
          Escaneaste un código QR desde un cartel inmobiliario
        </p>
      </div>
    </div>
  )
}
