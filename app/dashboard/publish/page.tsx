"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Upload, Gift, CreditCard, CheckCircle, X, ImageIcon } from "lucide-react"
import { saveUserProperty } from "@/lib/properties"

interface User {
  email: string
  name: string
  freePublicationUsed: boolean
  subscriptionType: string | null
}

export default function PublishPage() {
  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    address: "",
    description: "",
    contact: "",
    operation: "Venta",
    features: "",
    agent: "",
    agentPhone: "",
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const userData = localStorage.getItem("casadata_user")
    if (!userData) {
      router.push("/auth/login")
      return
    }
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    setFormData((prev) => ({
      ...prev,
      agent: parsedUser.name,
      agentPhone: parsedUser.phone || "",
    }))
  }, [router])

  const handleImageSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file)

      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

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
      const imageUrl = imagePreview || "/modern-property-exterior.png"

      const newProperty = saveUserProperty({
        title: formData.title,
        type: formData.type,
        address: formData.address,
        operation: formData.operation,
        image: imageUrl,
        contact: formData.contact,
        hasStreetView: false,
        description: formData.description,
        features: formData.features
          .split(",")
          .map((f) => f.trim())
          .filter((f) => f),
        agent: formData.agent || user.name,
        agentPhone: formData.agentPhone || formData.contact,
        status: "active",
      })

      const updatedUser = { ...user }

      if (!user.freePublicationUsed) {
        updatedUser.freePublicationUsed = true
      }

      localStorage.setItem("casadata_user", JSON.stringify(updatedUser))

      setIsLoading(false)
      router.push(`/dashboard?published=${newProperty.id}`)
    } catch (error) {
      console.error("Error saving property:", error)
      setIsLoading(false)
    }
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>
  }

  const canPublishFree = !user.freePublicationUsed
  const hasSubscription = user.subscriptionType

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-8">
        <Card>
          <CardHeader>
            <CardTitle>Nueva Publicación</CardTitle>
            <CardDescription>Completa la información</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">

              <Input
                placeholder="Título"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />

              <Input
                placeholder="Dirección"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />

              <Textarea
                placeholder="Descripción"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />

              <Input
                placeholder="Teléfono"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                required
              />

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Publicando..." : "Publicar"}
              </Button>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}