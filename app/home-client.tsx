"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { List } from "lucide-react"
import { motion } from "framer-motion"

export default function HomePage() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const propertyId = searchParams.get("id")
    if (propertyId) {
      window.location.href = `/inmueble/${propertyId}`
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white flex flex-col items-center p-4 overflow-hidden">

      {/* NAV */}
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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img src="/casadata-logo.png" alt="casaData" className="w-16 h-16 mx-auto" />
          </motion.div>

          <h1 className="text-3xl font-bold">
            casaData
          </h1>

          <p className="text-gray-400 text-balance">
            Explora casas, apartamentos, cocheras, negocios y espacios de almacenamiento.
          </p>

          <p className="text-sm text-gray-500">
            Además, detecta quién está realmente interesado en cada propiedad.
          </p>
        </motion.div>

        {/* IMAGE (visual fuerte) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl overflow-hidden border border-white/10"
        >
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop"
            alt="real estate"
            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
          />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
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
        </motion.div>

        {/* VALUE */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4"
        >
          <p className="text-sm text-emerald-400 font-medium">
            🎉 Primera publicación GRATIS para nuevos usuarios
          </p>
        </motion.div>

        {/* HOW IT WORKS */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="pt-6 space-y-4 text-left"
        >
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
        </motion.div>

        {/* FOOT */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-sm text-gray-500"
        >
          Escaneaste un código QR desde un cartel inmobiliario
        </motion.p>

      </div>
    </div>
  )
}
