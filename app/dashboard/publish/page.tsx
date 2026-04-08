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

// 🔥 CONFIG CLOUDINARY
const CLOUD_NAME = "TU_CLOUD_NAME"
const UPLOAD_PRESET = "casadata"

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

  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // =========================
  // USER
  // =========================
  useEffect(() => {
    const userData = localStorage.getItem("casadata_user")

    if (!userData) {
      router.push("/auth/login")
      return
    }

    setUser(JSON.parse(userData))
  }, [router])

  // =========================
  // IMAGE SELECT (MULTI)
  // =========================
  const handleImages = (selectedFiles: FileList) => {
    const newFiles = Array.from(selectedFiles).filter((f) =>
      f.type.startsWith("image/")
    )

    setFiles((prev) => [...prev, ...newFiles])

    const newPreviews = newFiles.map((file) =>
      URL.createObjectURL(file)
    )

    setPreviews((prev) => [...prev, ...newPreviews])
  }

  const removeImage = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  // =========================
  // CLOUDINARY UPLOAD
  // =========================
  const uploadImage = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", UPLOAD_PRESET)

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    )

    const data = await res.json()
    return data.secure_url
  }

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)

    try {
      // 🔥 subir todas las imágenes
      const uploadedImages = await Promise.all(
        files.map((file) => uploadImage(file))
      )

      const mainImage =
        uploadedImages[0] ||
        "https://images.unsplash.com/photo-1560185007-cde436f6a4d0"

      const res = await fetch(`${API_URL}/property`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          address: formData.address,
          description: formData.description,

          // 🔥 IMAGES
          image: mainImage,
          images: uploadedImages,

          operationType: formData.operation,
          price: Number(formData.price) || null,
          bedrooms: Number(formData.bedrooms) || null,
          bathrooms: Number(formData.bathrooms) || null,
          area: Number(formData.area) || null,

          features: formData.features
            .split(",")
            .map((f) => f.trim())
            .filter(Boolean),

          agentName: user.name,
          agentPhone: formData.contact,

          source: "user",
          status: "active",
        }),
      })

      if (!res.ok) throw new Error("Error")

      const newProperty = await res.json()

      router.push(`/inmueble/${newProperty.id}`)

    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-6">

        <Card>
          <CardHeader>
            <CardTitle>Nueva propiedad</CardTitle>
            <CardDescription>
              Publicá con imágenes reales 🚀
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

              {/* 🔥 MULTI IMAGE */}
              <div>
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  onChange={(e) =>
                    e.target.files && handleImages(e.target.files)
                  }
                />

                <div className="grid grid-cols-3 gap-2 mt-3">
                  {previews.map((src, i) => (
                    <div key={i} className="relative">
                      <img
                        src={src}
                        className="h-24 w-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-black/70 text-white text-xs px-1 rounded"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Subiendo imágenes..." : "Publicar"}
              </Button>

            </form>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
