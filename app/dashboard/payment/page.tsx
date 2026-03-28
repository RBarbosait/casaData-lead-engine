"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CreditCard, Check, Star, Zap } from "lucide-react"

interface User {
  email: string
  name: string
  freePublicationUsed: boolean
  subscriptionType: string | null
}

const plans = [
  {
    id: "single",
    name: "Publicación Individual",
    price: 500,
    currency: "$UY",
    description: "Perfecta para una sola propiedad",
    features: ["1 publicación", "Válida por 60 días", "Código QR incluido", "Soporte básico"],
    popular: false,
    type: "single",
  },
  {
    id: "monthly",
    name: "Plan Mensual",
    price: 1500,
    currency: "$UY",
    description: "Ideal para agentes activos",
    features: [
      "Publicaciones ilimitadas",
      "Válido por 30 días",
      "Códigos QR ilimitados",
      "Soporte prioritario",
      "Estadísticas avanzadas",
    ],
    popular: true,
    type: "subscription",
  },
  {
    id: "annual",
    name: "Plan Anual",
    price: 15000,
    currency: "$UY",
    description: "Máximo ahorro para profesionales",
    features: [
      "Publicaciones ilimitadas",
      "Válido por 365 días",
      "Códigos QR ilimitados",
      "Soporte VIP 24/7",
      "Estadísticas avanzadas",
      "Badge de agente verificado",
      "2 meses gratis",
    ],
    popular: false,
    type: "subscription",
    savings: "Ahorra $3,000",
  },
]

export default function PaymentPage() {
  const [user, setUser] = useState<User | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  })
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("casadata_user")
    if (!userData) {
      router.push("/auth/login")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const handlePayment = async () => {
    if (!selectedPlan || !user) return

    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      const plan = plans.find((p) => p.id === selectedPlan)
      if (!plan) return

      // Update user subscription
      const updatedUser = {
        ...user,
        subscriptionType: plan.type === "single" ? null : plan.name,
        freePublicationUsed: plan.type === "single" ? user.freePublicationUsed : true,
        subscriptionExpiry:
          plan.type === "subscription"
            ? new Date(Date.now() + (plan.id === "annual" ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString()
            : null,
        paidPublications: plan.type === "single" ? 1 : 0,
      }

      localStorage.setItem("casadata_user", JSON.stringify(updatedUser))
      setIsProcessing(false)

      // Redirect based on plan type
      if (plan.type === "single") {
        router.push("/dashboard/publish?paid=true")
      } else {
        router.push("/dashboard?subscribed=true")
      }
    }, 3000)
  }

  const updatePaymentData = (field: string, value: string) => {
    setPaymentData((prev) => ({ ...prev, [field]: value }))
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>
  }

  const selectedPlanData = plans.find((p) => p.id === selectedPlan)

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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Elige tu plan</h1>
          <p className="text-gray-600">Selecciona la opción que mejor se adapte a tus necesidades</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Plans Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Planes disponibles</h2>

            <div className="space-y-4">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`cursor-pointer transition-all ${
                    selectedPlan === plan.id ? "ring-2 ring-primary border-primary" : "hover:shadow-md border-gray-200"
                  } ${plan.popular ? "relative" : ""}`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Más popular
                    </Badge>
                  )}

                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {plan.currency} {plan.price.toLocaleString()}
                        </div>
                        {plan.savings && <div className="text-sm text-green-600 font-medium">{plan.savings}</div>}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {selectedPlan === plan.id && (
                      <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                        <div className="flex items-center text-primary">
                          <Check className="w-4 h-4 mr-2" />
                          <span className="text-sm font-medium">Plan seleccionado</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Payment Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Información de pago</h2>

            {selectedPlan ? (
              <Card>
                <CardHeader>
                  <CardTitle>Resumen del pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Order Summary */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>{selectedPlanData?.name}</span>
                      <span className="font-medium">
                        {selectedPlanData?.currency} {selectedPlanData?.price.toLocaleString()}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>
                        {selectedPlanData?.currency} {selectedPlanData?.price.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-4">
                    <Label>Método de pago</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="card">Tarjeta de crédito/débito</SelectItem>
                        <SelectItem value="transfer">Transferencia bancaria</SelectItem>
                        <SelectItem value="mercadopago">MercadoPago</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Card Details */}
                  {paymentMethod === "card" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Número de tarjeta</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={paymentData.cardNumber}
                          onChange={(e) => updatePaymentData("cardNumber", e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Fecha de vencimiento</Label>
                          <Input
                            id="expiryDate"
                            placeholder="MM/AA"
                            value={paymentData.expiryDate}
                            onChange={(e) => updatePaymentData("expiryDate", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={paymentData.cvv}
                            onChange={(e) => updatePaymentData("cvv", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardName">Nombre en la tarjeta</Label>
                        <Input
                          id="cardName"
                          placeholder="Juan Pérez"
                          value={paymentData.cardName}
                          onChange={(e) => updatePaymentData("cardName", e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Transfer Info */}
                  {paymentMethod === "transfer" && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Datos para transferencia</h4>
                      <div className="text-sm text-blue-800 space-y-1">
                        <p>Banco: Banco República</p>
                        <p>Cuenta: 123456789</p>
                        <p>Titular: casaData SRL</p>
                        <p className="font-medium">
                          Importe: {selectedPlanData?.currency} {selectedPlanData?.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* MercadoPago Info */}
                  {paymentMethod === "mercadopago" && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Pago con MercadoPago</h4>
                      <p className="text-sm text-blue-800">
                        Serás redirigido a MercadoPago para completar el pago de forma segura.
                      </p>
                    </div>
                  )}

                  {/* Payment Button */}
                  <Button className="w-full" size="lg" onClick={handlePayment} disabled={isProcessing}>
                    {isProcessing ? (
                      <div className="flex items-center">
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Procesando pago...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Pagar {selectedPlanData?.currency} {selectedPlanData?.price.toLocaleString()}
                      </div>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    Al proceder con el pago, aceptas nuestros términos y condiciones. Tu información está protegida con
                    encriptación SSL.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Selecciona un plan</h3>
                  <p className="text-gray-500">Elige el plan que mejor se adapte a tus necesidades para continuar.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Security Info */}
        <div className="mt-12 bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
              <span>Pago seguro SSL</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
              <span>Datos protegidos</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
              <span>Soporte 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
