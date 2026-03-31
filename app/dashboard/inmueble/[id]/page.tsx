export const runtime = "edge"

import { getInsights } from "@/lib/analytics"
import QRCard from "@/components/dashboard/qr-card"

export default async function Page({ params }: { params: { id: string } }) {

  const res = await fetch(
    `https://casadata-api-production.up.railway.app/property/${params.id}`,
    { cache: "no-store" }
  )

  if (!res.ok) {
    throw new Error("Error fetching property")
  }

  const property = await res.json()

  // ✅ FIX GLOBAL (CLAVE)
  const visits = property.visits || []
  const leads = property.leads || []
  const sessionAnalytics = property.sessionAnalytics || []

  const insights = getInsights(
    visits,
    leads,
    sessionAnalytics
  )

  // =======================
  // 🔥 TIME + REACH ANALYTICS
  // =======================

  const totalSessions = sessionAnalytics.length

  const totalTime = sessionAnalytics.reduce(
    (acc: number, s: any) => acc + (s.timeSpent || 0),
    0
  )

  const avgTime = totalSessions ? totalTime / totalSessions : 0

  const avgReach = totalSessions
    ? sessionAnalytics.reduce(
        (acc: number, s: any) =>
          acc + ((s.reach as string[] | null)?.length || 0),
        0
      ) / totalSessions
    : 0

  const usersReachedContact = sessionAnalytics.filter((s: any) =>
    (s.reach as string[] | null)?.includes("contact")
  ).length

  const reachContactRate = totalSessions
    ? (usersReachedContact / totalSessions) * 100
    : 0

  const reachCounts: Record<string, number> = {}

  sessionAnalytics.forEach((s: any) => {
    const sections = (s.reach as string[] | null) || []
    sections.forEach((section) => {
      reachCounts[section] = (reachCounts[section] || 0) + 1
    })
  })

  const sortedReach = Object.entries(reachCounts).sort(
    (a, b) => b[1] - a[1]
  )

  const highIntentUsers = sessionAnalytics.filter((s: any) => {
    const time = s.timeSpent || 0
    const reach = (s.reach as string[] | null) || []
    return time > 15000 || reach.includes("contact")
  })

  // =======================
  // 🔥 INTENTION SCORE
  // =======================

  const normVisits = Math.min(visits.length / 50, 1)

  // 🔥 FIX REAL (NO MÁS BUG DE BUILD)
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

  // 🔥 MODELO REAL (basado en tiempo, no session)
  const sortedVisits = [...visits].sort(
    (a, b) =>
      new Date(a.createdAt).getTime() -
      new Date(b.createdAt).getTime()
  )

  const totalVisitsReal = visits.length

  const WINDOW = 1 * 60 * 1000

  let uniqueUsersReal = 0
  let lastClusterTime = 0

  sortedVisits.forEach((visit) => {
    const t = new Date(visit.createdAt).getTime()

    if (t - lastClusterTime > WINDOW) {
      uniqueUsersReal++
      lastClusterTime = t
    }
  })

  const totalVisits = visits.length
  const revisitsReal = totalVisits - uniqueUsersReal

  const intensityReal = uniqueUsersReal
    ? revisitsReal / uniqueUsersReal
    : 0

  const sessionsMap: Record<string, number> = {}

  visits.forEach((v: any) => {
    sessionsMap[v.sessionId] = (sessionsMap[v.sessionId] || 0) + 1
  })

  const sessions = Object.values(sessionsMap)

  const usersWhoRevisit = sessions.filter(c => c > 1).length

  const intensity = sessions.length
    ? revisitsReal / sessions.length
    : 0

  const hotLeads = Object.entries(sessionsMap)
    .filter(([_, count]) => count >= 3)

  const statusColor = {
    alta_demanda: "text-green-600",
    interes_activo: "text-yellow-600",
    baja_demanda: "text-red-600",
    nuevo: "text-gray-500",
  }

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

        {/* 🔥 NUEVO: INTENTION SCORE */}
        <div className="p-6 mt-6 rounded-xl border bg-white">
          <p className="text-sm text-muted-foreground mb-2">
            Índice de intención (beta)
          </p>
          <h2 className="text-4xl font-bold">
            {intentionScore}/100
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Combina visitas, tiempo, scroll y contacto
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border bg-white">
          <p className="text-sm text-muted-foreground mb-2">Estado</p>
          <h2 className={`text-xl font-bold ${statusColor[insights.status]}`}>
            {insights.status.replace("_", " ").toUpperCase()}
          </h2>
        </div>

        <div className="p-6 rounded-xl border bg-white">
          <p className="text-sm text-muted-foreground mb-2">Score</p>
          <h2 className="text-3xl font-bold">{insights.score}/100</h2>
        </div>
      </div>

      {/* 🔥 NUEVO: TIME + REACH */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="p-4 border rounded-xl bg-white">
          <p className="text-sm">Tiempo promedio</p>
          <p className="text-2xl font-bold">
            {(avgTime / 1000).toFixed(1)}s
          </p>
        </div>

        <div className="p-4 border rounded-xl bg-white">
          <p className="text-sm">Secciones vistas</p>
          <p className="text-2xl font-bold">
            {avgReach.toFixed(1)}
          </p>
        </div>

        <div className="p-4 border rounded-xl bg-white">
          <p className="text-sm">Llegaron a contacto</p>
          <p className="text-2xl font-bold">
            {reachContactRate.toFixed(0)}%
          </p>
        </div>

        <div className="p-4 border rounded-xl bg-white">
          <p className="text-sm">Alta intención</p>
          <p className="text-2xl font-bold">
            {highIntentUsers.length}
          </p>
        </div>
      </div>

    </div>
  )
}
