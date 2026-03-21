"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CheckCircle, Home } from "lucide-react"

interface User {
  email: string
  name: string
  freePublicationUsed: boolean
  subscriptionType: string | null
  paidPublications?: number
}

export default function PaymentPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("casadata_user")
    if (!userData) {
      router.push("/auth/login")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const handlePurchase = (type: "single" | "subscription") => {
    if (!user) return

    setIsProcessing(true)

    setTimeout(() => {
      const updatedUser = { ...user }

      if (type === "single") {
        updatedUser.paidPublications = (user.paidPublications || 0) + 1
        localStorage.setItem("casadata_user", JSON.stringify(updatedUser))
        router.push("/dashboard/publish?paid=true")
      } else {
        updatedUser.subscriptionType = "Mensual"
        updatedUser.subscriptionExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        localStorage.setItem("casadata_user", JSON.stringify(updatedUser))
        router.push("/dashboard?subscribed=true")
      }

      setIsProcessing(false)
    }, 1500)
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-2">
                <ArrowLeft className="w-5 h-5" />
                <span>Volver al Dashboard</span>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Home className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">casaData</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Planes y Precios</h1>
          <p className="text-muted-foreground">Elige el plan que mejor se adapte a tus necesidades</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Single Publication */}
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Publicacion Individual</CardTitle>
              <CardDescription>Una sola publicacion</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$500</span>
                <span className="text-muted-foreground"> / publicacion</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {["1 publicacion activa", "Codigo QR incluido", "Metricas basicas", "Contacto por WhatsApp"].map(
                  (feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-secondary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ),
                )}
              </ul>

              <Button className="w-full" onClick={() => handlePurchase("single")} disabled={isProcessing}>
                {isProcessing ? "Procesando..." : "Comprar Publicacion"}
              </Button>
            </CardContent>
          </Card>

          {/* Subscription */}
          <Card className="border-primary relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
              Recomendado
            </div>
            <CardHeader className="text-center">
              <CardTitle>Suscripcion Mensual</CardTitle>
              <CardDescription>Publicaciones ilimitadas</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$2,500</span>
                <span className="text-muted-foreground"> / mes</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {[
                  "Publicaciones ilimitadas",
                  "Codigos QR ilimitados",
                  "Metricas avanzadas",
                  "Soporte prioritario",
                  "Dashboard de analytics",
                  "Exportar datos",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-secondary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button className="w-full" onClick={() => handlePurchase("subscription")} disabled={isProcessing}>
                {isProcessing ? "Procesando..." : "Suscribirme"}
              </Button>
            </CardContent>
          </Card>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Pago seguro procesado. Precios en pesos uruguayos (UYU). Puedes cancelar tu suscripcion en cualquier momento.
        </p>
      </div>
    </div>
  )
}
