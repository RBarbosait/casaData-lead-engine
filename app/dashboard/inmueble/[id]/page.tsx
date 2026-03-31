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

  // 🔥 NUEVO: métricas
  const [metrics, setMetrics] = useState<any>(null)

  const [showModal, setShowModal] = useState(false)
  const [dontShowAgain, setDontShowAgain] = useState(false)
  const [name, setName] = useState("")
  const [contact, setContact] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${API_URL}/property/${propertyId}`)
      const data = await res.json()

      setProperty(data)

      // =======================
      // 🔥 CALCULO DASHBOARD
      // =======================

      const visits = data.visits || []

      const sortedVisits = [...visits].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
      )

      const WINDOW = 60 * 1000

      let uniqueUsers = 0
      let lastTime = 0

      sortedVisits.forEach((visit) => {
        const t = new Date(visit.createdAt).getTime()
        if (t - lastTime > WINDOW) {
          uniqueUsers++
          lastTime = t
        }
      })

      const totalVisits = visits.length
      const revisits = totalVisits - uniqueUsers

      const sessionsMap: Record<string, number> = {}

      visits.forEach((v: any) => {
        sessionsMap[v.sessionId] = (sessionsMap[v.sessionId] || 0) + 1
      })

      const usersWhoRevisit = Object.values(sessionsMap).filter(c => c > 1).length

      const hotLeads = Object.entries(sessionsMap)
        .filter(([_, count]) => count >= 3)

      setMetrics({
        totalVisits,
        uniqueUsers,
        revisits,
        usersWhoRevisit,
        hotLeads
      })
    }

    load()
  }, [propertyId])

  // =======================
  // 🔥 RESTO DE TU CÓDIGO (NO TOCADO)
  // =======================

  const handleCloseModal = () => {
    if (dontShowAgain) {
      localStorage.setItem(`modal_dismissed_${propertyId}`, "true")
    }
    setShowModal(false)
  }

  if (!property) return <div className="p-10">Cargando...</div>

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <header className="border-b bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between">
          <Button variant="ghost" onClick={() => router.push("/inmuebles")}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver
          </Button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">

        {/* IZQUIERDA */}
        <div className="md:col-span-2 space-y-6">
          <img
            id="hero"
            src={property.image}
            className="w-full h-[420px] object-cover rounded-2xl"
          />

          <div>
            <h1 className="text-3xl font-semibold">{property.title}</h1>
            <p className="text-gray-500">{property.address}</p>
          </div>

          <p className="text-gray-700">{property.description}</p>

          {/* 🔥 NUEVO: MÉTRICAS (COPIA DEL DASHBOARD) */}
          {metrics && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Stat label="Visitas" value={metrics.totalVisits} />
              <Stat label="Usuarios únicos" value={metrics.uniqueUsers} />
              <Stat label="Revisitas" value={metrics.revisits} />
              <Stat label="Usuarios que vuelven" value={metrics.usersWhoRevisit} />
            </div>
          )}
        </div>

        {/* DERECHA */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contacto</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => setShowModal(true)}>
                Dejar mis datos
              </Button>
            </CardContent>
          </Card>

          {/* 🔥 NUEVO: HOT USERS */}
          {metrics && metrics.hotLeads.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>🔥 Alta intención</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {metrics.hotLeads.map(([_, count]: any, i: number) => (
                  <div key={i} className="text-sm">
                    Usuario con {count} visitas
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* MODAL (TUYO) */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-xl">
            <button onClick={handleCloseModal}>
              <X />
            </button>
            <p>Formulario</p>
          </div>
        </div>
      )}
    </div>
  )
}

function Stat({ label, value }: any) {
  return (
    <div className="p-4 border rounded-xl bg-white">
      <p className="text-sm">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}
