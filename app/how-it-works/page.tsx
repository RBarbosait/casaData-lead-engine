"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function HowItWorks() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">

      {/* TOP BAR */}
      <div className="max-w-3xl mx-auto mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          ← Volver
        </Button>
      </div>

      <div className="max-w-3xl mx-auto space-y-10">

        <h1 className="text-3xl font-bold text-center">
          Cómo funciona
        </h1>

        <div className="space-y-6">

          <div className="flex gap-4 items-start bg-white p-5 rounded-xl border shadow-sm">
            <div className="text-xl font-bold">1</div>
            <div>
              <h2 className="font-semibold">Publicás tu propiedad</h2>
              <p className="text-sm text-gray-600">
                Cargás la información y generás un link + QR único.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start bg-white p-5 rounded-xl border shadow-sm">
            <div className="text-xl font-bold">2</div>
            <div>
              <h2 className="font-semibold">Compartís el QR</h2>
              <p className="text-sm text-gray-600">
                Lo usás en carteles, redes o portales.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start bg-white p-5 rounded-xl border shadow-sm">
            <div className="text-xl font-bold">3</div>
            <div>
              <h2 className="font-semibold">Medimos comportamiento</h2>
              <p className="text-sm text-gray-600">
                Registramos visitas, tiempo, revisitas y acciones.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start bg-white p-5 rounded-xl border shadow-sm">
            <div className="text-xl font-bold">4</div>
            <div>
              <h2 className="font-semibold">Convertís mejor</h2>
              <p className="text-sm text-gray-600">
                Identificás leads con intención real y priorizás contactos.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
