"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { List } from "lucide-react"

export default function HomePage() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const propertyId = searchParams.get("id")
    if (propertyId) {
      window.location.href = `/inmueble/${propertyId}`
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white flex flex-col items-center p-4">

      {/* NAV */}
      <div className="absolute top-4 right-4 flex gap-2 animate-fade-in">
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
        <div className="space-y-4 animate-fade-up">
          <img src="/casadata-logo.png" alt="casaData" className="w-16 h-16 mx-auto animate-scale-in" />

          <h1 className="text-3xl font-bold">
            casaData
          </h1>

          <p className="text-gray-400 text-balance">
            Explora casas, apartamentos, cocheras, negocios y espacios de almacenamiento.
          </p>

          <p className="text-sm text-gray-500">
            Además, detecta quién está realmente interesado en cada propiedad.
          </p>
        </div>

        {/* IMAGE */}
        <div className="rounded-xl overflow-hidden border border-white/10 animate-fade-up delay-100">
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop"
            alt="real estate"
            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* CTA */}
        <div className="space-y-4 animate-fade-up delay-200">
          <Link href="/inmuebles">
            <Button className="w-full h-14 text-lg">
              <List className="w-5 h-5 mr-2" />
              Ver todos los inmuebles
            </Button>
          </Link>

          <Link href="/auth/register">
            <Button variant="outline" className="w-full h-14 text-lg bg-transparent">
              📝 Publicar mi propiedad
            </Button>
          </Link>
        </div>

        {/* VALUE */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 animate-fade-up delay-300">
          <p className="text-sm text-emerald-400 font-medium">
            🎉 Primera publicación GRATIS para nuevos usuarios
          </p>
        </div>

        {/* HOW IT WORKS */}
        <div className="pt-6 space-y-4 text-left animate-fade-up delay-400">
          <h2 className="text-center font-semibold text-lg">
            Cómo funciona
          </h2>

          <div className="space-y-3 text-sm text-gray-400">

            <div className="p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition">
              1. Publicás tu propiedad
            </div>

            <div className="p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition">
              2. Compartís el QR en carteles o redes
            </div>

            <div className="p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition">
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
        <p className="text-sm text-gray-500 animate-fade-in delay-500">
          Escaneaste un código QR desde un cartel inmobiliario
        </p>
      </div>

      {/* 🔥 ANIMATIONS (Tailwind custom) */}
      <style jsx global>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-up {
          animation: fadeUp 0.6s ease forwards;
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease forwards;
        }

        .animate-scale-in {
          animation: scaleIn 0.5s ease forwards;
        }

        .delay-100 { animation-delay: 0.1s }
        .delay-200 { animation-delay: 0.2s }
        .delay-300 { animation-delay: 0.3s }
        .delay-400 { animation-delay: 0.4s }
        .delay-500 { animation-delay: 0.5s }
      `}</style>
    </div>
  )
}
