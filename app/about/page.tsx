"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">

      {/* TOP BAR */}
      <div className="max-w-3xl mx-auto mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          ← Volver
        </Button>
      </div>

      <div className="max-w-3xl mx-auto space-y-8">

        <h1 className="text-3xl font-bold">
          Sobre casaData
        </h1>

        <p className="text-gray-600 leading-relaxed">
          casaData no es un portal inmobiliario.
          Es una herramienta diseñada para entender el comportamiento real
          de las personas interesadas en una propiedad.
        </p>

        <div className="grid gap-4">

          <div className="p-5 bg-white rounded-xl border shadow-sm">
            <h2 className="font-semibold mb-2">El problema</h2>
            <p className="text-sm text-gray-600">
              Los portales muestran visitas, pero no intención real.
              No sabés quién está interesado de verdad.
            </p>
          </div>

          <div className="p-5 bg-white rounded-xl border shadow-sm">
            <h2 className="font-semibold mb-2">La solución</h2>
            <p className="text-sm text-gray-600">
              casaData mide comportamiento: tiempo en página,
              revisitas, interacción y contacto.
            </p>
          </div>

          <div className="p-5 bg-white rounded-xl border shadow-sm">
            <h2 className="font-semibold mb-2">El resultado</h2>
            <p className="text-sm text-gray-600">
              Priorizás leads reales, ahorrás tiempo
              y cerrás más operaciones.
            </p>
          </div>

        </div>

      </div>
    </div>
  )
}
