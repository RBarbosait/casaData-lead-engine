"use client"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Home, Plus, Settings, LogOut, Eye, Edit, Trash2, Crown, Gift, CheckCircle } from "lucide-react"
import { getUserProperties, type Property } from "@/lib/properties"

interface User {
  email: string
  name: string
  freePublicationUsed: boolean
  subscriptionType: string | null
  subscriptionExpiry?: string
  subscriptionStatus?: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [properties, setProperties] = useState<Property[]>([])
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
    setProperties(getUserProperties())
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("casadata_user")
    router.push("/")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "expired":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Activa"
      case "pending":
        return "Pendiente"
      case "expired":
        return "Expirada"
      default:
        return status
    }
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>
  }

  const showPublishedAlert = searchParams.get("published")
  const showSubscribedAlert = searchParams.get("subscribed")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            <Link href="/" className="flex items-center space-x-2">
              <img src="/casadata-logo.png" alt="casaData" className="w-8 h-8" />
              <span className="font-bold text-xl">casaData</span>
            </Link>

            <div className="flex items-center space-x-4">
              <Link href="/inmuebles">
                <Button variant="ghost" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  Ver inmuebles
                </Button>
              </Link>

              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user.name}</span>
              </div>

              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>

          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Alerts */}
        {showPublishedAlert && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              ¡Publicación creada exitosamente!
            </AlertDescription>
          </Alert>
        )}

        {showSubscribedAlert && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              ¡Suscripción activada!
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mi Cuenta</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">

                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                {!user.freePublicationUsed && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Gift className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm text-emerald-800">
                        Publicación gratis disponible
                      </span>
                    </div>
                  </div>
                )}

                {user.subscriptionType && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Crown className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm text-yellow-800">
                        {user.subscriptionType}
                      </span>
                    </div>
                  </div>
                )}

                <Link href="/dashboard/payment">
                  <Button variant="outline" className="w-full">
                    <Crown className="w-4 h-4 mr-2" />
                    Ver planes
                  </Button>
                </Link>

              </CardContent>
            </Card>
          </div>

          {/* Main */}
          <div className="lg:col-span-3 space-y-6">

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Mis Publicaciones</CardTitle>
                  <CardDescription>Gestiona tus propiedades</CardDescription>
                </div>

                <Link href="/dashboard/publish">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva
                  </Button>
                </Link>
              </CardHeader>

              <CardContent>

                {properties.length === 0 ? (
                  <div className="text-center py-12">
                    <Home className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>No tienes publicaciones aún</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {properties.map((p) => (
                      <div key={p.id} className="flex justify-between border p-4 rounded-lg">
                        <div>
                          <h4 className="font-medium">{p.title}</h4>
                          <p className="text-sm text-gray-500">{p.address}</p>
                          <Badge className={getStatusColor(p.status)}>
                            {getStatusText(p.status)}
                          </Badge>
                        </div>

                        <div className="flex gap-2">
                          {/* 🔥 FIX REAL */}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => router.push(`/dashboard/inmueble/${p.id}`)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>

                          <Button size="sm" variant="ghost">
                            <Edit className="w-4 h-4" />
                          </Button>

                          <Button size="sm" variant="ghost">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  )
}
