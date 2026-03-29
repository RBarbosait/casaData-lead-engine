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
      autoRenew: parsedUser.autoRenew !== false,
    })

    setPaymentHistory([
      {
        id: "pay_001",
        date: "2024-01-15",
        amount: 1500,
        currency: "$UY",
        plan: "Plan Mensual",
        status: "completed",
      }
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
    }, 1000)
  }

  if (!user) return <div>Cargando...</div>

  const hasActiveSubscription = user.subscriptionType && user.subscriptionStatus === "active"

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Link href="/dashboard">
        <Button variant="ghost">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
      </Link>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Suscripción</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {user.subscriptionType ? (
            <>
              <div className="flex justify-between">
                <span>{user.subscriptionType}</span>
                <Badge>{user.subscriptionStatus}</Badge>
              </div>

              {user.subscriptionExpiry && (
                <p>
                  Vence: {new Date(user.subscriptionExpiry).toLocaleDateString()}
                </p>
              )}

              <Button onClick={handleCancelSubscription} disabled={isLoading}>
                Cancelar suscripción
              </Button>
            </>
          ) : (
            <div>
              <p>No tienes plan activo</p>
              <Link href="/dashboard/payment">
                <Button>Ver planes</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}