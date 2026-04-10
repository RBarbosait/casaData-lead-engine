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
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4">

      {/* NAV FIXED */}
      <div className="w-full max-w-5xl flex flex-wrap items-center justify-end gap-2 mb-6">
        <Link href="/how-it-works">
          <Button variant="ghost" size="sm">
            Cómo funciona
          </Button>
        </Link>

        <Link href="/about">
          <Button variant="ghost" size="sm">
            About
          </Button>
        </Link>

        <Link href="/auth/login">
          <Button variant="outline" size="sm">
            Iniciar Sesión
          </Button>
        </Link>

        <Link href="/auth/register">
          <Button size="sm">
            Registrarse
          </Button>
        </Link>
      </div>

      <div className="max-w-md w-full text-center space-y-8">

        {/* HERO */}
        <div className="space-y-4 animate-fade-up">
          <img
            src="/casadata-logo.png"
            alt="casaData"
            className="w-16 h-16 mx-auto animate-scale-in"
          />

          <h1 className="text-3xl font-bold leading-tight">
            Entendé la demanda real de tu propiedad
          </h1>

          <p className="text-muted-foreground">
            No solo visitas. casaData detecta intención, interés y probabilidad de contacto en tiempo real.
          </p>

          <p className="text-sm text-muted-foreground">
            Dejá de adivinar. Tomá decisiones con datos reales.
          </p>
        </div>

        {/* MÉTRICAS */}
        <div className="grid grid-cols-3 gap-3 animate-fade-up delay-100">
          <div className="p-3 rounded-lg border bg-white">
            <p className="text-lg font-bold">+120%</p>
            <p className="text-xs text-muted-foreground">más leads</p>
          </div>
          <div className="p-3 rounded-lg border bg-white">
            <p className="text-lg font-bold">x2</p>
            <p className="text-xs text-muted-foreground">revisitas</p>
          </div>
          <div className="p-3 rounded-lg border bg-white">
            <p className="text-lg font-bold">+35%</p>
            <p className="text-xs text-muted-foreground">tiempo en ficha</p>
          </div>
        </div>

        {/* IMAGE */}
        <div className="rounded-xl overflow-hidden border animate-fade-up delay-200">
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop"
            alt="real estate"
            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* CTA */}
        <div className="space-y-4 animate-fade-up delay-300">
          <Link href="/inmuebles">
            <Button className="w-full h-14 text-lg">
              <List className="w-5 h-5 mr-2" />
              Ver propiedades
            </Button>
          </Link>

          <Link href="/auth/register">
            <Button variant="outline" className="w-full h-14 text-lg">
              🚀 Empezar a medir mi propiedad
            </Button>
          </Link>
        </div>

        {/* VALUE */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 animate-fade-up delay-400">
          <p className="text-sm text-emerald-700 font-medium">
            🎉 Primera publicación GRATIS para nuevos usuarios
          </p>
        </div>

        {/* HOW IT WORKS */}
        <div className="pt-6 space-y-4 text-left animate-fade-up delay-500">
          <h2 className="text-center font-semibold text-lg">
            Cómo funciona
          </h2>

          <div className="space-y-3 text-sm text-muted-foreground">

            <div className="p-3 rounded-lg border bg-white">
              1. Publicás tu propiedad en casaData
            </div>

            <div className="p-3 rounded-lg border bg-white">
              2. Detectamos comportamiento real (tiempo, scroll, revisitas)
            </div>

            <div className="p-3 rounded-lg border bg-white">
              3. Identificamos usuarios con alta intención de compra
            </div>

          </div>

          <Link href="/how-it-works">
            <Button variant="ghost" className="w-full">
              Ver más →
            </Button>
          </Link>
        </div>
        {/* 🇺🇾 URUGUAY */}
<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 animate-fade-up delay-400 text-center">
  <p className="text-sm text-blue-800 font-medium">
    🇺🇾 casaData es un emprendimiento orgullosamente uruguayo
  </p>

  <p className="text-xs text-blue-600 mt-1">
    Creado para transformar cómo se entiende la demanda inmobiliaria en la región
  </p>
</div>
{/* CONTACT */}
<div className="pt-6 space-y-4 animate-fade-up delay-500">
  <h2 className="text-center font-semibold text-lg">
    ¿Querés conocernos o tenés dudas?
  </h2>

  <p className="text-sm text-muted-foreground text-center">
    Escribinos y te respondemos lo antes posible. También podés contarnos qué necesitás medir.
  </p>

  <form
    className="space-y-3"
    onSubmit={(e) => {
      e.preventDefault()

      const form = e.currentTarget
      const name = (form.elements.namedItem("name") as HTMLInputElement).value
      const contact = (form.elements.namedItem("contact") as HTMLInputElement).value
      const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value

      const subject = encodeURIComponent("Contacto casaData")
      const body = encodeURIComponent(
        `Nombre: ${name}\nContacto: ${contact}\n\nMensaje:\n${message}`
      )

      window.location.href = `mailto:rbarbosait@gmail.com?subject=${subject}&body=${body}`
    }}
  >
    <input
      name="name"
      required
      placeholder="Nombre *"
      className="w-full p-3 rounded-lg border bg-white"
    />

    <input
      name="contact"
      required
      placeholder="Email o Teléfono *"
      className="w-full p-3 rounded-lg border bg-white"
    />

    <textarea
      name="message"
      required
      placeholder="Mensaje *"
      rows={4}
      className="w-full p-3 rounded-lg border bg-white"
    />

    <Button type="submit" className="w-full h-12">
      Enviar mensaje
    </Button>
  </form>
</div>
        {/* FOOT */}
        <p className="text-sm text-muted-foreground animate-fade-in delay-500">
          Escaneaste un código QR desde un cartel inmobiliario
        </p>
      </div>

      {/* ANIMATIONS */}
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
