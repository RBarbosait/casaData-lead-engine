"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Copy, Phone, X } from "lucide-react"

export const runtime = "edge"

const API_URL = "https://casadata-api-production.up.railway.app"

function getSessionId() {
  if (typeof window === "undefined") return "server"

  let session = localStorage.getItem("session")

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

  // =========================
  // LOAD PROPERTY
  // =========================

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${API_URL}/property/${propertyId}`)
      const data = await res.json()
      setProperty(data)
    }
    load()
  }, [propertyId])

  // =========================
  // VISIT TRACK
  // =========================

  useEffect(() => {
    if (!property) return

    const sessionId = getSessionId()
    const key = `last_visit_${propertyId}_${sessionId}`
    const lastVisit = Number(localStorage.getItem(key) || 0)

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

    const TTL = 15000

    const shouldTrack =
      !lastVisit || isNaN(lastVisit) || Date.now() - lastVisit > TTL

    if (shouldTrack && allowTracking) {
      localStorage.setItem(key, String(Date.now()))

      fetch(`${API_URL}/track`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId,
          source:
            new URLSearchParams(window.location.search).get("src") || "web",
          sessionId,
        }),
      })
    }

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

  // =========================
  // TIME TRACK (FIX REAL)
  // =========================

  useEffect(() => {
    if (!propertyId) return

    const sessionId = getSessionId()
    const start = Date.now()

    const sendTime = () => {
      const timeSpent = Math.max(1000, Date.now() - start)

      fetch(`${API_URL}/track-time`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId,
          sessionId,
          timeSpent,
        }),
        keepalive: true,
      })
    }

    window.addEventListener("beforeunload", sendTime)

    return () => {
      sendTime()
      window.removeEventListener("beforeunload", sendTime)
    }
  }, [propertyId])

  // =========================
  // REACH TRACK (FIX REAL)
  // =========================

  useEffect(() => {
    if (!propertyId) return

    const sessionId = getSessionId()

    const sections = ["hero", "details", "features", "contact"] // 🔥 IMPORTANTE
    const seen = new Set<string>()

    let timeout: any

    const send = () => {
      fetch(`${API_URL}/track-reach`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId,
          sessionId,
          sections: Array.from(seen),
        }),
        keepalive: true,
      })
    }

    const onScroll = () => {
      sections.forEach((id) => {
        const el = document.getElementById(id)
        if (!el) return

        const rect = el.getBoundingClientRect()

        if (rect.top < window.innerHeight * 0.7) {
          seen.add(id)
        }
      })

      clearTimeout(timeout)
      timeout = setTimeout(send, 1000)
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", onScroll)
      send()
    }
  }, [propertyId])

  // =========================
  // CONTACT TRACK
  // =========================

  const trackContact = () => {
    const sessionId = getSessionId()

    fetch(`${API_URL}/track-reach`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        propertyId,
        sessionId,
        sections: ["contact"],
      }),
      keepalive: true,
    })
  }

  const getMessage = () => {
    if (!property) return ""

    if (property.status === "nuevo")
      return "Sé el primero en interesarte en esta propiedad"

    if (property.status === "alta_demanda")
      return "Hay varias personas interesadas. Llegá antes que el resto"

    if (property.status === "baja_demanda")
      return "Aprovechá esta oportunidad con menos competencia"

    return "Esta propiedad está generando interés"
  }

  const handleSubmitLead = async () => {
    if (!name || !contact) return

    trackContact()

    setLoading(true)

    await fetch(`${API_URL}/lead`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
    trackContact()

    await fetch(`${API_URL}/lead`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
    trackContact()

    await fetch(`${API_URL}/lead`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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

      <header className="border-b bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between">
          <Button variant="ghost" onClick={() => router.push("/inmuebles")}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver
          </Button>

          <Button variant="outline" onClick={copyLink}>
            <Copy className="w-4 h-4 mr-1" />
            {copied ? "Copiado" : "Copiar link"}
          </Button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <img
            id="hero"
            src={property.image}
            className="w-full h-[420px] object-cover rounded-2xl"
          />

          <div id="details">
            <h1 className="text-3xl font-semibold">{property.title}</h1>
            <p className="text-gray-500">{property.address}</p>
          </div>

          <div id="features" className="text-blue-600 font-medium">
            {getMessage()}
          </div>

          <p className="text-gray-700">{property.description}</p>
        </div>

        <div id="contact" className="space-y-4">
          <Card className="rounded-2xl shadow-sm border border-gray-100">
            <CardHeader>
              <CardTitle>Contacto</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <Button className="w-full h-11 rounded-xl" onClick={handleWhatsApp}>
                <Phone className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>

              <Button variant="outline" className="w-full h-11 rounded-xl" onClick={handleEmail}>
                Email
              </Button>

              <Button variant="ghost" className="w-full" onClick={() => setShowModal(true)}>
                Dejar mis datos
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 relative">

            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3"
            >
              <X className="w-5 h-5" />
            </button>

            {!sent ? (
              <>
                <h2 className="text-xl font-semibold mb-2">
                  Dejá tus datos
                </h2>

                <div className="space-y-3">
                  <input
                    className="w-full border p-3 rounded-lg"
                    placeholder="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  <input
                    className="w-full border p-3 rounded-lg"
                    placeholder="Contacto"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                  />

                  <Button className="w-full" onClick={handleSubmitLead}>
                    {loading ? "Enviando..." : "Enviar"}
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <p className="text-lg font-semibold">✅ Enviado</p>
                <Button className="mt-4" onClick={handleCloseModal}>
                  Cerrar
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  )
}
