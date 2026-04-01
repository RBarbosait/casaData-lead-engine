"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Copy, Phone, X } from "lucide-react"

export const runtime = "edge"

const API_URL = "https://casadata-api-production.up.railway.app"

// =========================
// SEND SAFE
// =========================
function sendData(url: string, data: any) {
  const payload = JSON.stringify(data)

  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    const blob = new Blob([payload], { type: "application/json" })
    navigator.sendBeacon(url, blob)
  } else {
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    })
  }
}

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
  const [name, setName] = useState("")
  const [contact, setContact] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  // =========================
  // LOAD PROPERTY
  // =========================

  useEffect(() => {
    fetch(`${API_URL}/property/${propertyId}`)
      .then((r) => r.json())
      .then(setProperty)
  }, [propertyId])

  // =========================
  // VISIT TRACK
  // =========================

  useEffect(() => {
    if (!property) return

    const sessionId = getSessionId()
    const key = `last_visit_${propertyId}_${sessionId}`
    const lastVisit = Number(localStorage.getItem(key) || 0)

    if (!lastVisit || Date.now() - lastVisit > 15000) {
      localStorage.setItem(key, String(Date.now()))

      sendData(`${API_URL}/track`, {
        propertyId,
        source:
          new URLSearchParams(window.location.search).get("src") || "web",
        sessionId,
      })
    }

    setTimeout(() => setShowModal(true), 1500)
  }, [property, propertyId])

  // =========================
  // 🔥 TIME TRACK (FIX REAL)
  // =========================

  useEffect(() => {
    if (!propertyId) return

    const sessionId = getSessionId()
    let last = Date.now()

    const interval = setInterval(() => {
      const now = Date.now()
      const delta = now - last
      last = now

      if (delta < 500) return

      sendData(`${API_URL}/track-time`, {
        propertyId,
        sessionId,
        timeSpent: delta,
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [propertyId])

  // =========================
  // 🔥 REACH TRACK (FIX REAL)
  // =========================

  useEffect(() => {
    if (!propertyId) return

    const sessionId = getSessionId()

    const sections = ["hero", "details", "features", "contact"]
    const seen = new Set<string>()

    let timeout: any

    const send = () => {
      sendData(`${API_URL}/track-reach`, {
        propertyId,
        sessionId,
        sections: Array.from(seen),
      })
    }

    const onScroll = () => {
      let changed = false

      sections.forEach((id) => {
        const el = document.getElementById(id)
        if (!el) return

        const rect = el.getBoundingClientRect()

        if (rect.top < window.innerHeight * 0.7) {
          if (!seen.has(id)) {
            seen.add(id)
            changed = true
          }
        }
      })

      if (changed) {
        clearTimeout(timeout)
        timeout = setTimeout(send, 800)
      }
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", onScroll)
    }
  }, [propertyId])

  // =========================
  // CONTACT TRACK
  // =========================

  const trackContact = () => {
    sendData(`${API_URL}/track-reach`, {
      propertyId,
      sessionId: getSessionId(),
      sections: ["contact"],
    })
  }

  // =========================
  // LEADS
  // =========================

  const handleSubmitLead = async () => {
    if (!name || !contact) return

    trackContact()
    setLoading(true)

    await fetch(`${API_URL}/lead`, {
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
    trackContact()

    await fetch(`${API_URL}/lead`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        propertyId,
        type: "whatsapp",
      }),
    })

    window.open(`https://wa.me/${property.agentPhone}`)
  }

  const handleEmail = async () => {
    trackContact()

    await fetch(`${API_URL}/lead`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        propertyId,
        type: "form",
      }),
    })

    window.location.href = `mailto:${property.agentEmail}`
  }

  if (!property) return <div className="p-10">Cargando...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-6 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <img id="hero" src={property.image} className="rounded-xl" />

          <div id="details">
            <h1>{property.title}</h1>
            <p>{property.address}</p>
          </div>

          <div id="features">{property.description}</div>
        </div>

        <div id="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contacto</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <Button onClick={handleWhatsApp}>WhatsApp</Button>
              <Button onClick={handleEmail}>Email</Button>
              <Button onClick={() => setShowModal(true)}>
                Dejar datos
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-xl">
            {!sent ? (
              <>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nombre"
                />
                <input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Contacto"
                />
                <Button onClick={handleSubmitLead}>
                  {loading ? "..." : "Enviar"}
                </Button>
              </>
            ) : (
              <p>✅ Enviado</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
