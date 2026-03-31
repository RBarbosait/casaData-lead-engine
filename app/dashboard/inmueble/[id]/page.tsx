export const runtime="edge"
export const dynamic="force-dynamic"
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

  const insights = getInsights(
  property.visits,
  property.leads,
  property.sessionAnalytics
)

  // 🔥 MODELO REAL (basado en tiempo, no session)
  const sortedVisits = [...property.visits].sort(
    (a, b) =>
      new Date(a.createdAt).getTime() -
      new Date(b.createdAt).getTime()
  )
   // 🔥 VISITAS REALES (RAW, sin agrupar)
  const totalVisitsReal = property.visits.length
  //
  
  const WINDOW = 1 * 60 * 1000 // 1 minuto
 
  let uniqueUsersReal = 0
  let lastClusterTime = 0

  sortedVisits.forEach((visit) => {
    const t = new Date(visit.createdAt).getTime()

    if (t - lastClusterTime > WINDOW) {
      uniqueUsersReal++
      lastClusterTime = t
    }
  })

  // ✅ FIX REAL (NO agrupar visitas)
  const totalVisits = property.visits.length
  const revisitsReal = totalVisits - uniqueUsersReal

  const intensityReal = uniqueUsersReal
    ? revisitsReal / uniqueUsersReal
    : 0

  // 🔥 lógica original (NO SE TOCA)
  const sessionsMap: Record<string, number> = {}

  property.visits.forEach((v: any) => {
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

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">{property.title}</h1>
        <p className="text-muted-foreground">{property.location}</p>

        <QRCard
          propertyId={property.id}
          title={property.title}
          address={property.location}
        />
      </div>

      {/* ESTADO + SCORE */}
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

      {/* MÉTRICAS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <div className="p-4 border rounded-xl bg-white">
          <p className="text-sm">Visitas</p>
          <p className="text-2xl font-bold">{totalVisitsReal}</p>
        </div>

        <div className="p-4 border rounded-xl bg-white">
          <p className="text-sm">Usuarios únicos</p>
          <p className="text-2xl font-bold">{uniqueUsersReal}</p>
        </div>

        <div className="p-4 border rounded-xl bg-white">
          <p className="text-sm">Usuarios que vuelven</p>
          <p className="text-2xl font-bold">{usersWhoRevisit}</p>
        </div>

        <div className="p-4 border rounded-xl bg-white">
          <p className="text-sm">Revisitas totales</p>
          <p className="text-2xl font-bold">{revisitsReal}</p>
        </div>

      </div>

      {/* INTENSIDAD */}
      <div className="p-6 rounded-xl border bg-white">
        <h3 className="font-semibold mb-4">Intensidad de interés</h3>
        <p className="text-3xl font-bold">{intensityReal.toFixed(2)}</p>
        <p className="text-sm text-muted-foreground">
          Promedio de revisitas por usuario
        </p>
      </div>

      {/* QR vs WEB */}
      <div className="p-6 rounded-xl border bg-white">
        <h3 className="font-semibold mb-6">Origen del interés</h3>

        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-blue-500"
            style={{ width: `${webPercent}%` }}
          />
        </div>

        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-green-500"
            style={{ width: `${qrPercent}%` }}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">

          <div className="p-4 border rounded-xl text-center">
            <p className="text-sm">Web</p>
            <p className="text-2xl font-bold">{insights.webVisits}</p>
            <p className="text-xs">{webPercent.toFixed(0)}%</p>
          </div>

          <div className="p-4 border rounded-xl text-center">
            <p className="text-sm">QR</p>
            <p className="text-2xl font-bold">{insights.qrVisits}</p>
            <p className="text-xs">{qrPercent.toFixed(0)}%</p>
          </div>

        </div>
      </div>

      {/* HOT LEADS */}
      <div className="p-6 rounded-xl border bg-white">
        <h3 className="font-semibold mb-4">🔥 Alta intención detectada</h3>

        {hotLeads.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No hay usuarios con comportamiento fuerte aún
          </p>
        ) : (
          <div className="space-y-3">
            {hotLeads.map(([sessionId, count]) => {
              const visits = property.visits.filter(
                (v: any) => v.sessionId === sessionId
              )
              const lastVisit = visits[visits.length - 1]

              return (
                <div key={sessionId} className="p-4 border rounded-lg flex justify-between">
                  <div>
                    <p className="font-medium">🔥 Usuario altamente interesado</p>
                    <p className="text-sm text-muted-foreground">
                      {count} visitas
                    </p>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {new Date(lastVisit.createdAt).toLocaleDateString()}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* LEADS */}
      <div className="p-6 rounded-xl border bg-white">
        <h3 className="font-semibold mb-4">Personas interesadas</h3>

        {property.leads.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aún no hay contactos
          </p>
        ) : (
          <div className="space-y-3">
            {[...property.leads]
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((lead: any) => (
                <div
                  key={lead.id}
                  className="p-4 border rounded-lg flex justify-between"
                >
                  <div>
                    <p className="font-medium">
                      {lead.type === "whatsapp" ? "WhatsApp" : "Formulario"}
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
