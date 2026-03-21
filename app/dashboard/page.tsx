"use client"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Home, Plus, Settings, LogOut, Eye, Edit, Trash2, Crown, Gift, CheckCircle, MessageCircle, TrendingUp, QrCode } from "lucide-react"
import { getUserProperties, getLeadStats, type Property } from "@/lib/properties"

interface User {
  email: string
  name: string
  freePublicationUsed: boolean
  subscriptionType: string | null
  subscriptionExpiry?: string
  subscriptionStatus?: string
  paidPublications?: number
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
  const stats = getLeadStats()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Home className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl">casaData</span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/inmuebles">
                <Button variant="ghost" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  Ver inmuebles
                </Button>
              </Link>

              <div className="flex items-center gap-2">
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
        {/* Success Alerts */}
        {showPublishedAlert && (
          <Alert className="mb-6 border-secondary/50 bg-secondary/10">
            <CheckCircle className="h-4 w-4 text-secondary" />
            <AlertDescription className="text-secondary">
              Publicacion creada exitosamente! Tu propiedad ya esta visible para todos los usuarios.
            </AlertDescription>
          </Alert>
        )}

        {showSubscribedAlert && (
          <Alert className="mb-6 border-secondary/50 bg-secondary/10">
            <CheckCircle className="h-4 w-4 text-secondary" />
            <AlertDescription className="text-secondary">
              Suscripcion activada! Ahora puedes crear publicaciones ilimitadas.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mi Cuenta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {!user.freePublicationUsed && (
                    <div className="bg-secondary/20 border border-secondary/30 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Gift className="w-4 h-4 text-secondary" />
                        <span className="text-sm font-medium text-secondary">Publicacion gratis disponible</span>
                      </div>
                    </div>
                  )}

                  {user.subscriptionType && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Crown className="w-4 h-4 text-yellow-600" />
                        <div>
                          <span className="text-sm font-medium text-yellow-800 block">{user.subscriptionType}</span>
                          {user.subscriptionExpiry && (
                            <span className="text-xs text-yellow-700">
                              Vence: {new Date(user.subscriptionExpiry).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {user.paidPublications && user.paidPublications > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Plus className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">
                          {user.paidPublications} publicaciones pagadas
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Configuracion
                  </Button>

                  {user.subscriptionType ? (
                    <Link href="/dashboard/subscription">
                      <Button variant="ghost" className="w-full justify-start" size="sm">
                        <Crown className="w-4 h-4 mr-2" />
                        Gestionar suscripcion
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/dashboard/payment">
                      <Button variant="outline" className="w-full justify-start" size="sm">
                        <Crown className="w-4 h-4 mr-2" />
                        Actualizar plan
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Visitas</p>
                      <p className="text-2xl font-bold">{stats.totalViews}</p>
                    </div>
                    <Eye className="w-8 h-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Leads</p>
                      <p className="text-2xl font-bold">{stats.totalLeads}</p>
                    </div>
                    <MessageCircle className="w-8 h-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">QR Scans</p>
                      <p className="text-2xl font-bold">{stats.totalQrScans}</p>
                    </div>
                    <QrCode className="w-8 h-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Conversion</p>
                      <p className="text-2xl font-bold">{stats.conversionRate}%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Properties Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Mis Publicaciones</CardTitle>
                    <CardDescription>Gestiona tus propiedades publicadas</CardDescription>
                  </div>
                  <Link href="/dashboard/publish">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Nueva Publicacion
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {properties.length === 0 ? (
                  <div className="text-center py-12">
                    <Home className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No tienes publicaciones</h3>
                    <p className="text-muted-foreground mb-4">Comienza publicando tu primera propiedad</p>
                    <Link href="/dashboard/publish">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Crear primera publicacion
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {properties.map((property) => (
                      <div key={property.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <img
                          src={property.image || "/placeholder.svg"}
                          alt={property.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{property.title}</h4>
                          <p className="text-sm text-muted-foreground">{property.address}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary">{property.type}</Badge>
                            <Badge className={getStatusColor(property.status)}>{getStatusText(property.status)}</Badge>
                            <span className="text-sm text-muted-foreground">{property.views} visitas</span>
                            <span className="text-sm text-muted-foreground">{property.leads} leads</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link href={`/inmueble/${property.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
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
