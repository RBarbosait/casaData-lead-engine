"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Crown, Calendar, CreditCard, AlertTriangle, RefreshCw, History, Settings } from "lucide-react"

interface User {
  email: string
  name: string
  freePublicationUsed: boolean
  subscriptionType: string | null
  subscriptionExpiry?: string
  subscriptionStatus?: "active" | "cancelled" | "expired"
  autoRenew?: boolean
  paidPublications?: number
}

interface PaymentHistory {
  id: string
  date: string
  amount: number
  currency: string
  plan: string
  status: "completed" | "pending" | "failed"
}

export default function SubscriptionPage() {
  const [user, setUser] = useState<User | null>(null)
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("casadata_user")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser({
      ...parsedUser,
      subscriptionStatus: parsedUser.subscriptionStatus || "active",
      autoRenew: parsedUser.autoRenew !== false, // Default to true
    })

    // Mock payment history
    setPaymentHistory([
      {
        id: "pay_001",
        date: "2024-01-15",
        amount: 1500,
        currency: "$UY",
        plan: "Plan Mensual",
        status: "completed",
      },
      {
        id: "pay_002",
        date: "2024-02-15",
        amount: 1500,
        currency: "$UY",
        plan: "Plan Mensual",
        status: "completed",
      },
      {
        id: "pay_003",
        date: "2024-03-15",
        amount: 1500,
        currency: "$UY",
        plan: "Plan Mensual",
        status: "pending",
      },
    ])
  }, [router])

  const handleCancelSubscription = () => {
    if (!user) return

    setIsLoading(true)

    setTimeout(() => {
      const updatedUser = {
        ...user,
        subscriptionStatus: "cancelled" as const,
        autoRenew: false,
      }

      localStorage.setItem("casadata_user", JSON.stringify(updatedUser))
      setUser(updatedUser)
      setIsLoading(false)
      setShowCancelConfirm(false)
    }, 1500)
  }

  const handleReactivateSubscription = () => {
    if (!user) return

    setIsLoading(true)

    setTimeout(() => {
      const updatedUser = {
        ...user,
        subscriptionStatus: "active" as const,
        autoRenew: true,
      }

      localStorage.setItem("casadata_user", JSON.stringify(updatedUser))
      setUser(updatedUser)
      setIsLoading(false)
    }, 1500)
  }

  const toggleAutoRenew = () => {
    if (!user) return

    const updatedUser = {
      ...user,
      autoRenew: !user.autoRenew,
    }

    localStorage.setItem("casadata_user", JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "expired":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Activa"
      case "cancelled":
        return "Cancelada"
      case "expired":
        return "Expirada"
      default:
        return status
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completado"
      case "pending":
        return "Pendiente"
      case "failed":
        return "Fallido"
      default:
        return status
    }
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>
  }

  const hasActiveSubscription = user.subscriptionType && user.subscriptionStatus === "active"
  const subscriptionExpired = user.subscriptionExpiry && new Date(user.subscriptionExpiry) < new Date()
  const daysUntilExpiry = user.subscriptionExpiry
    ? Math.ceil((new Date(user.subscriptionExpiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <ArrowLeft className="w-5 h-5" />
                <span>Volver al Dashboard</span>
              </Link>
            </div>

            <div className="flex items-center space-x-2">
              <img src="/casadata-logo.png" alt="casaData" className="w-8 h-8" />
              <span className="font-bold text-xl">casaData</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Suscripción</h1>
            <p className="text-gray-600">Administra tu plan y configuraciones de pago</p>
          </div>

          {/* Subscription Status Alerts */}
          {subscriptionExpired && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Tu suscripción ha expirado. Renueva tu plan para continuar publicando propiedades ilimitadas.
              </AlertDescription>
            </Alert>
          )}

          {hasActiveSubscription && daysUntilExpiry <= 7 && daysUntilExpiry > 0 && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                Tu suscripción vence en {daysUntilExpiry} días.{" "}
                {user.autoRenew ? "Se renovará automáticamente." : "Renueva tu plan para continuar."}
              </AlertDescription>
            </Alert>
          )}

          {user.subscriptionStatus === "cancelled" && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Tu suscripción está cancelada. Puedes reactivarla en cualquier momento.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Current Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  Plan Actual
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.subscriptionType ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{user.subscriptionType}</span>
                      <Badge className={getStatusColor(user.subscriptionStatus || "active")}>
                        {getStatusText(user.subscriptionStatus || "active")}
                      </Badge>
                    </div>

                    {user.subscriptionExpiry && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {user.subscriptionStatus === "cancelled" ? "Válido hasta" : "Próxima renovación"}:{" "}
                          {new Date(user.subscriptionExpiry).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Renovación automática</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={toggleAutoRenew}
                          disabled={user.subscriptionStatus === "cancelled"}
                        >
                          {user.autoRenew ? "Activada" : "Desactivada"}
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      {user.subscriptionStatus === "active" ? (
                        <Button
                          variant="outline"
                          className="w-full bg-transparent"
                          onClick={() => setShowCancelConfirm(true)}
                          disabled={isLoading}
                        >
                          Cancelar Suscripción
                        </Button>
                      ) : (
                        <Button className="w-full" onClick={handleReactivateSubscription} disabled={isLoading}>
                          {isLoading ? (
                            <div className="flex items-center">
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              Reactivando...
                            </div>
                          ) : (
                            "Reactivar Suscripción"
                          )}
                        </Button>
                      )}

                      <Link href="/dashboard/payment">
                        <Button variant="outline" className="w-full bg-transparent">
                          Cambiar Plan
                        </Button>
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <Crown className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="font-medium text-gray-900 mb-2">Sin suscripción activa</h3>
                    <p className="text-gray-600 text-sm mb-4">Suscríbete para obtener publicaciones ilimitadas</p>
                    <Link href="/dashboard/payment">
                      <Button>Ver Planes</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Resumen de Cuenta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Publicaciones gratuitas</span>
                    <span className="font-medium">{user.freePublicationUsed ? "Usada" : "Disponible"}</span>
                  </div>

                  {user.paidPublications && user.paidPublications > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Publicaciones pagadas</span>
                      <span className="font-medium">{user.paidPublications}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Tipo de cuenta</span>
                    <span className="font-medium">{user.subscriptionType ? "Premium" : "Básica"}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Miembro desde</span>
                    <span className="font-medium">
                      {user.registrationDate ? new Date(user.registrationDate).toLocaleDateString() : "Enero 2024"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Historial de Pagos
              </CardTitle>
              <CardDescription>Últimas transacciones y pagos realizados</CardDescription>
            </CardHeader>
            <CardContent>
              {paymentHistory.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">Sin historial de pagos</h3>
                  <p className="text-gray-600 text-sm">Tus transacciones aparecerán aquí</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {paymentHistory.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{payment.plan}</p>
                          <p className="text-sm text-gray-600">{new Date(payment.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {payment.currency} {payment.amount.toLocaleString()}
                        </p>
                        <Badge className={getPaymentStatusColor(payment.status)} variant="secondary">
                          {getPaymentStatusText(payment.status)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cancel Confirmation Modal */}
          {showCancelConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="w-full max-w-md mx-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="w-5 h-5" />
                    Cancelar Suscripción
                  </CardTitle>
                  <CardDescription>¿Estás seguro de que quieres cancelar tu suscripción?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      Tu suscripción seguirá activa hasta{" "}
                      {user.subscriptionExpiry && new Date(user.subscriptionExpiry).toLocaleDateString()}. Después de
                      esa fecha, no podrás crear nuevas publicaciones ilimitadas.
                    </p>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => setShowCancelConfirm(false)}
                    >
                      Mantener Plan
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={handleCancelSubscription}
                      disabled={isLoading}
                    >
                      {isLoading ? "Cancelando..." : "Cancelar"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
