"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const API_URL = "https://casadata-api-production.up.railway.app"

export default function EditPropertyPage() {
  const { id } = useParams()
  const router = useRouter()

  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // =========================
  // LOAD PROPERTY
  // =========================
  useEffect(() => {
    fetch(`${API_URL}/property/${id}`)
      .then((r) => r.json())
      .then((data) => setProperty(data))
  }, [id])

  // =========================
  // SAVE
  // =========================
  const handleSave = async () => {
    setLoading(true)

    await fetch(`${API_URL}/property/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(property),
    })

    setLoading(false)

    // 🔥 UX PRO
    router.push("/dashboard?updated=1")
  }

  if (!property) {
    return <div className="p-8">Cargando...</div>
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-bold">Editar propiedad</h1>

      <Input
        value={property.title || ""}
        onChange={(e) =>
          setProperty({ ...property, title: e.target.value })
        }
        placeholder="Título"
      />

      <Input
        value={property.location || ""}
        onChange={(e) =>
          setProperty({ ...property, location: e.target.value })
        }
        placeholder="Ubicación"
      />

      <Input
        value={property.price || ""}
        onChange={(e) =>
          setProperty({
            ...property,
            price: Number(e.target.value),
          })
        }
        placeholder="Precio"
      />

      <Input
        value={property.agentName || ""}
        onChange={(e) =>
          setProperty({
            ...property,
            agentName: e.target.value,
          })
        }
        placeholder="Agente"
      />

      <Input
        value={property.agentPhone || ""}
        onChange={(e) =>
          setProperty({
            ...property,
            agentPhone: e.target.value,
          })
        }
        placeholder="Teléfono"
      />

      <Button onClick={handleSave} className="w-full">
        {loading ? "Guardando..." : "Guardar cambios"}
      </Button>
    </div>
  )
}
