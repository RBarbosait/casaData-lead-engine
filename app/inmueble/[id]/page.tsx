"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Copy, Phone, X } from "lucide-react"

export const runtime = "edge"

// ✅ session persistente por usuario
function getSessionId() {
  if (typeof window === "undefined") return "server"

  let session = localStorage.getItem("session")

  // 🔥 fallback extra para evitar pérdida
  if (!session) {
    session =
      crypto.randomUUID() +
      "_" +
      Math.floor(Date.now() / 1000000)

    localStorage.setItem("session", session)
  }

  return session
}

export default function PropertyPage() {
  const params = useParams()
  const router = useRouter()
  const propertyId = params.id as string

  const [property, setProperty] = useState<any>(null)
  const [copied, setCopied] = useState(false)

  const [showModal, setShowModal] = useState(false)
  const [dontShowAgain, setDontShowAgain] = useState(false)

  const [name, setName] = useState("")
  const [contact, setContact] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  // 🔹 cargar propiedad
  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/property/${propertyId}`)
      const data = await res.json()
      setProperty(data)
    }
    load()
  }, [propertyId])

  // 🔥 TRACKING + MODAL (FIX REAL)
  useEffect(() => {
    if (!property) return

    const sessionId = getSessionId()
    const key = `last_visit_${propertyId}_${sessionId}`

    const lastVisit = Number(localStorage.getItem(key) || 0)

    // 🚫 evitar doble ejecución (React Strict Mode)
    const reactKey = `react_fix_${propertyId}_${sessionId}`

    let allowTracking = true

if (sessionStorage.getItem(reactKey)) {
  allowTracking = false
} else {
  sessionStorage.setItem(reactKey, "1")
  setTimeout(() => {
    sessionStorage.removeItem(reactKey)
  }, 2000)
}

    // ⏱️ ventana mínima (permite contar visitas reales)
    const TTL = 3 * 1000

    const shouldTrack =
      !lastVisit || isNaN(lastVisit) || Date.now() - lastVisit > TTL

    console.log("TRACK DEBUG", {
      sessionId,
      lastVisit,
      shouldTrack,
    })

    if (shouldTrack) {
      localStorage.setItem(key, String(Date.now()))

      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId,
          source:
            new URLSearchParams(window.location.search).get("src") || "web",
          sessionId,
        }),
      }).catch(console.error)
    }

    // 🔥 MODAL (NO BLOQUEADO)
    const dismissed = localStorage.getItem(
      `modal_dismissed_${propertyId}`
    )

    if (!dismissed) {
      const timer = setTimeout(() => {
        setShowModal(true)
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [property, propertyId])

  // ----------------------

  const getMessage = () => {
    if (!property) return ""

    if (property.status === "nuevo")
      return "Sé el primero en interesarte en esta propiedad"

    if (property.status === "alta_demanda")
      return "🔥 Hay varias personas interesadas. Llegá antes que el resto"

    if (property.status === "baja_demanda")
      return "💡 Aprovechá esta oportunidad con menos competencia"

    return "Esta propiedad está generando interés"
  }

  const handleSubmitLead = async () => {
    if (!name || !contact) return

    setLoading(true)

    await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        propertyId,
        type: "form",
        name,
        contact,
      }),
    })

    setLoading(false)
    setSent(true)
  }

  const handleWhatsApp = async () => {
    await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        propertyId,
        type: "whatsapp",
      }),
    })

    const msg = encodeURIComponent(
      `Hola, me interesa esta propiedad: ${property.title}`
    )

    window.open(`https://wa.me/${property.agentPhone}?text=${msg}`)
  }

  const handleEmail = async () => {
    await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        propertyId,
        type: "form",
      }),
    })

    window.location.href = `mailto:${property.agentEmail}`
  }

  const handleCloseModal = () => {
    if (dontShowAgain) {
      localStorage.setItem(
        `modal_dismissed_${propertyId}`,
        "true"
      )
    }
    setShowModal(false)
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!property) return <div className="p-10">Cargando...</div>

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <header className="border-b bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between">
          <Button variant="ghost" onClick={() => router.push("/inmuebles")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Volver
          </Button>

          <Button variant="outline" onClick={copyLink}>
            <Copy className="w-4 h-4 mr-1" />
            {copied ? "Copiado" : "Copiar link"}
          </Button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">

        {/* MAIN */}
        <div className="md:col-span-2 space-y-6">
          <img
            src={property.image}
            className="w-full h-[420px] object-cover rounded-2xl"
          />

          <div>
            <h1 className="text-3xl font-semibold">{property.title}</h1>
            <p className="text-gray-500">{property.address}</p>
          </div>

          <div className="text-blue-600 font-medium">
            {getMessage()}
          </div>

          <p className="text-gray-700">{property.description}</p>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-4">
          <Card className="rounded-2xl shadow-sm border border-gray-100">
            <CardHeader>
              <CardTitle>Contacto</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <Button
                className="w-full h-11 rounded-xl"
                onClick={handleWhatsApp}
              >
                <Phone className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>

              <Button
                variant="outline"
                className="w-full h-11 rounded-xl"
                onClick={handleEmail}
              >
                Email
              </Button>

              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setShowModal(true)}
              >
                Dejar mis datos
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md relative shadow-xl">

            <button
              className="absolute top-3 right-3 text-gray-400"
              onClick={handleCloseModal}
            >
              <X size={18} />
            </button>

            <h2 className="text-xl font-semibold mb-2">
              {getMessage()}
            </h2>

            <p className="text-sm text-gray-500 mb-4">
              Dejá tu contacto y te escriben
            </p>

            {!sent ? (
              <>
                <input
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-2"
                />

                <input
                  placeholder="Email o teléfono"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-3"
                />

                <Button
                  className="w-full h-11 rounded-xl"
                  onClick={handleSubmitLead}
                >
                  {loading ? "Enviando..." : "Quiero que me contacten"}
                </Button>

                <div className="flex items-center gap-2 mt-3">
                  <input
                    type="checkbox"
                    checked={dontShowAgain}
                    onChange={(e) => setDontShowAgain(e.target.checked)}
                  />
                  <span className="text-xs text-gray-500">
                    No volver a mostrar
                  </span>
                </div>
              </>
            ) : (
              <p className="text-green-600 text-sm">
                ✅ Te van a contactar pronto
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}