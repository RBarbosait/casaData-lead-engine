"use client"

import { useState, useEffect, useRef } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

const API_URL = "https://casadata-api-production.up.railway.app"

interface User {
  email: string
  name: string
  phone?: string
  freePublicationUsed: boolean
  subscriptionType: string | null
}

export default function PublishPage() {
  const [user, setUser] = useState<User | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    address: "",
    description: "",
    contact: "",
    operation: "Venta",
    price: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    features: "",
  })

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // =========================
  // USER LOAD
  // =========================
  useEffect(() => {
    const userData = localStorage.getItem("casadata_user")

    if (!userData) {
      router.push("/auth/login")
      return
    }

    const parsed = JSON.parse(userData)
    setUser(parsed)
  }, [router])

  // =========================
  // IMAGE
  // =========================
  const handleImage = (file: File) => {
    if (!file.type.startsWith("image/")) return

    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  // =========================
  // SUBMIT (🔥 FIX REAL)
  // =========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const canPublishFree = !user.freePublicationUsed
    const hasSubscription = user.subscriptionType

    if (!canPublishFree && !hasSubscription) {
      router.push("/dashboard/payment")
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch(`${API_URL}/property`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // 🔥 CORE
          title: formData.title,
          address: formData.address,
          description: formData.description,
          image:
            imagePreview ||
            "https://images.unsplash.com/photo-1560185007-cde436f6a4d0",

          // 🔥 FICHA COMPATIBLE
          operationType: formData.operation,
          price: Number(formData.price) || null,
          bedrooms: Number(formData.bedrooms) || null,
          bathrooms: Number(formData.bathrooms) || null,
          area: Number(formData.area) || null,

          // 🔥 ARRAYS (tu ficha usa esto)
          features: formData.features
            .split(",")
            .map((f) => f.trim())
            .filter(Boolean),

          // 🔥 AGENTE (CLAVE)
          agentName: user.name,
          agentPhone: formData.contact,

          // 🔥 SISTEMA
          source: "user",
          status: "active",
        }),
      })

      if (!res.ok) throw new Error("Error creando propiedad")

      const newProperty = await res.json()

      // marcar free usado
      const updatedUser = { ...user }
      if (!user.freePublicationUsed) {
        updatedUser.freePublicationUsed = true
      }

      localStorage.setItem("casadata_user", JSON.stringify(updatedUser))

      // 👉 REDIRECT A FICHA REAL
      router.push(`/inmueble/${newProperty.id}`)

    } catch (err) {
      console.error("Error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Nueva propiedad</CardTitle>
            <CardDescription>
              Publicá y medí interés real
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">

              <Input
                placeholder="Título"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />

              <Input
                placeholder="Dirección"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                required
              />

              <Input
                placeholder="Precio"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />

              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="Dormitorios"
                  value={formData.bedrooms}
                  onChange={(e) =>
                    setFormData({ ...formData, bedrooms: e.target.value })
                  }
                />
                <Input
                  placeholder="Baños"
                  value={formData.bathrooms}
                  onChange={(e) =>
                    setFormData({ ...formData, bathrooms: e.target.value })
                  }
                />
                <Input
                  placeholder="m²"
                  value={formData.area}
                  onChange={(e) =>
                    setFormData({ ...formData, area: e.target.value })
                  }
                />
              </div>

              <Textarea
                placeholder="Descripción"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />

              <Input
                placeholder="Características (coma separadas)"
                value={formData.features}
                onChange={(e) =>
                  setFormData({ ...formData, features: e.target.value })
                }
              />

              <Input
                placeholder="Teléfono o WhatsApp"
                value={formData.contact}
                onChange={(e) =>
                  setFormData({ ...formData, contact: e.target.value })
                }
                required
              />

              {/* IMAGE */}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) =>
                    e.target.files && handleImage(e.target.files[0])
                  }
                />

                {imagePreview && (
                  <img
                    src={imagePreview}
                    className="mt-3 rounded-xl h-40 object-cover"
                  />
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Publicando..." : "Publicar"}
              </Button>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
