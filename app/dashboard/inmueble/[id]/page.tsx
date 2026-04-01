export const runtime = "edge"
export const dynamic = "force-dynamic"

import { getInsights } from "@/lib/analytics"
import QRCard from "@/components/dashboard/qr-card"

export default async function Page({ params }: { params: { id: string } }) {
  const res = await fetch(
    `https://casadata-api-production.up.railway.app/property/${params.id}?t=${Date.now()}`,
    { cache: "no-store" }
  )

  if (!res.ok) {
    throw new Error("Error fetching property")
  }

  const property = await res.json()

  const visits = property.visits || []
  const leads = property.leads || []
  const sessionAnalytics = property.sessionAnalytics || []

  const insights = getInsights(visits, leads, sessionAnalytics)

  const safeNumber = (n: any) => (Number.isFinite(n) ? n : 0)

  const totalSessions = sessionAnalytics.length

  const totalTime = sessionAnalytics.reduce(
    (acc: number, s: any) => acc + (s?.timeSpent || 0),
    0
  )

  const avgTime = safeNumber(totalSessions ? totalTime / totalSessions : 0)

  const avgReach = safeNumber(
    totalSessions
      ? sessionAnalytics.reduce(
          (acc: number, s: any) =>
            acc + ((s?.reach as string[] | null)?.length || 0),
          0
        ) / totalSessions
      : 0
  )

  const usersReachedContact = sessionAnalytics.filter((s: any) =>
    (s?.reach as string[] | null)?.includes("contact")
  ).length

  const reachContactRate = safeNumber(
    totalSessions ? (usersReachedContact / totalSessions) * 100 : 0
  )

  const reachCounts: Record<string, number> = {}

  sessionAnalytics.forEach((s: any) => {
    const sections = (s?.reach as string[] | null) || []
    sections.forEach((section) => {
      reachCounts[section] = (reachCounts[section] || 0) + 1
    })
  })

  const sortedReach = Object.entries(reachCounts).sort(
    (a, b) => b[1] - a[1]
  )

  const highIntentUsers = sessionAnalytics.filter((s: any) => {
    const time = s?.timeSpent || 0
    const reach = (s?.reach as string[] | null) || []
    return time > 15000 || reach.includes("contact")
  })

  const normVisits = Math.min(visits.length / 50, 1)

  const uniqueSessions = new Set(
    visits.map((v: any) => v.sessionId)
  ).size

  const normRevisits = Math.min(
    visits.length
      ? (visits.length - uniqueSessions) / visits.length
      : 0,
    1
  )

  const normTime = Math.min(avgTime / 30000, 1)
  const normReach = Math.min(avgReach / 4, 1)
  const normContact = Math.min(reachContactRate / 100, 1)

  const intentionScore = Math.round(
    (
      normVisits * 0.2 +
      normRevisits * 0.2 +
      normTime * 0.25 +
      normReach * 0.2 +
      normContact * 0.15
    ) * 100
  )

  const sortedVisits = [...visits].sort(
    (a, b) =>
      new Date(a.createdAt).getTime() -
      new Date(b.createdAt).getTime()
  )

  const totalVisitsReal = visits.length

  const WINDOW = 60000

  let uniqueUsersReal = 0
  let lastClusterTime = 0

  sortedVisits.forEach((visit) => {
    const t = new Date(visit.createdAt).getTime()
    if (t - lastClusterTime > WINDOW) {
      uniqueUsersReal++
      lastClusterTime = t
    }
  })

  const revisitsReal = totalVisitsReal - uniqueUsersReal

  const intensityReal = uniqueUsersReal
    ? revisitsReal / uniqueUsersReal
    : 0

  const sessionsMap: Record<string, number> = {}

  visits.forEach((v: any) => {
    sessionsMap[v.sessionId] = (sessionsMap[v.sessionId] || 0) + 1
  })

  const usersWhoRevisit = Object.values(sessionsMap).filter(
    (c) => c > 1
  ).length

  const statusColor: Record<string, string> = {
    alta_demanda: "text-green-600",
    interes_activo: "text-yellow-600",
    baja_demanda: "text-red-600",
    nuevo: "text-gray-500",
  }

  const safeStatus = statusColor[insights.status] || "text-gray-500"

  const total = insights.totalVisits
  const qrPercent = total ? (insights.qrVisits / total) * 100 : 0
  const webPercent = total ? (insights.webVisits / total) * 100 : 0

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen max-w-5xl mx-auto">

      <div>
        <h1 className="text-3xl font-bold">{property.title}</h1>
        <p className="text-muted-foreground">{property.location}</p>

        <QRCard
          propertyId={property.id}
          title={property.title}
          address={property.location}
        />

        <div className="p-6 mt-6 rounded-xl border bg-white">
          <p className="text-sm mb-2">Índice de intención</p>
          <h2 className="text-4xl font-bold">{intentionScore}/100</h2>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 border bg-white rounded-xl">
          <p className="text-sm mb-2">Estado</p>
          <h2 className={`font-bold ${safeStatus}`}>
            {insights.status.toUpperCase()}
          </h2>
        </div>

        <div className="p-6 border bg-white rounded-xl">
          <p className="text-sm mb-2">Score</p>
          <h2 className="text-3xl font-bold">{insights.score}/100</h2>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Visitas" value={totalVisitsReal} />
        <Stat label="Usuarios únicos" value={uniqueUsersReal} />
        <Stat label="Usuarios que vuelven" value={usersWhoRevisit} />
        <Stat label="Revisitas" value={revisitsReal} />
      </div>

      <div className="p-6 border bg-white rounded-xl">
        <h3>Intensidad</h3>
        <p className="text-3xl font-bold">
          {intensityReal.toFixed(2)}
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Stat label="Tiempo" value={`${(avgTime / 1000).toFixed(1)}s`} />
        <Stat label="Secciones" value={avgReach.toFixed(1)} />
        <Stat label="Contacto" value={`${reachContactRate.toFixed(0)}%`} />
        <Stat label="Alta intención" value={highIntentUsers.length} />
      </div>

      <div className="p-6 border bg-white rounded-xl">
        <Bar label="Web" value={webPercent} />
        <Bar label="QR" value={qrPercent} />
      </div>

      {/* 🔥 LEADS (FIX CORRECTO) */}
      <div className="p-6 border bg-white rounded-xl">
        <h3 className="font-semibold mb-4">Personas interesadas</h3>

        {leads.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aún no hay contactos
          </p>
        ) : (
          <div className="space-y-3">
            {[...leads]
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .map((lead: any) => (
                <div
                  key={lead.id}
                  className="p-4 border rounded-lg flex justify-between"
                >
                  <div>
                    <p className="font-medium">
                      {lead.type === "whatsapp"
                        ? "WhatsApp"
                        : "Formulario"}
                    </p>
                    {lead.contact && (
                      <p className="text-sm text-muted-foreground">
                        {lead.contact}
                      </p>
                    )}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

    </div>
  )
}

function Stat({ label, value }: any) {
  return (
    <div className="p-4 border bg-white rounded-xl">
      <p>{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  )
}

function Bar({ label, value }: any) {
  return (
    <div>
      <p>{label} {value.toFixed(0)}%</p>
      <div className="h-2 bg-gray-200 rounded">
        <div
          className="h-full bg-blue-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}
