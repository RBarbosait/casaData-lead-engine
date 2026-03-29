import { prisma } from "@/lib/prisma";
import { getInsights } from "@/lib/analytics";
import QRCard from "@/components/dashboard/qr-card";


export const runtime = 'edge'
export default async function Page({ params }: { params: { id: string } }) {
const property = await prisma.property.findUnique({
where: { id: params.id },
include: {
visits: true,
leads: true,
},
});

if (!property) {
return <div className="p-6">Inmueble no encontrado</div>;
}

const insights = getInsights(property.visits, property.leads);

const statusColor = {
alta_demanda: "text-green-600",
interes_activo: "text-yellow-600",
baja_demanda: "text-red-600",
nuevo: "text-gray-500",
};

// 🔥 usar totalVisits como base real
const total = insights.totalVisits;
const qrPercent = total ? (insights.qrVisits / total) * 100 : 0;
const webPercent = total ? (insights.webVisits / total) * 100 : 0;

return ( <div className="p-8 space-y-8 bg-gray-50 min-h-screen max-w-5xl mx-auto">


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

  {/* 🔥 ESTADO + SCORE */}
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

  {/* 📊 MÉTRICAS */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

    <div className="p-4 border rounded-xl bg-white">
      <p className="text-sm text-muted-foreground">Visitas</p>
      <p className="text-2xl font-bold">{insights.totalVisits}</p>
    </div>

    <div className="p-4 border rounded-xl bg-white">
      <p className="text-sm text-muted-foreground">Revisitas</p>
      <p className="text-2xl font-bold">{insights.revisits}</p>
    </div>

    <div className="p-4 border rounded-xl bg-white">
      <p className="text-sm text-muted-foreground">Leads</p>
      <p className="text-2xl font-bold">{insights.leadsCount}</p>
    </div>

    <div className="p-4 border rounded-xl bg-white">
      <p className="text-sm text-muted-foreground">Conversión</p>
      <p className="text-2xl font-bold">
        {(insights.conversionRate * 100).toFixed(1)}%
      </p>
    </div>

  </div>

  {/* 🔥 QR vs WEB */}
  <div className="p-6 rounded-xl border bg-white">
    <h3 className="font-semibold mb-6">Origen del interés</h3>

    {/* Barra Web */}
    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-2">
      <div
        className="h-full bg-blue-500"
        style={{ width: `${webPercent}%` }}
      />
    </div>

    {/* Barra QR */}
    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-6">
      <div
        className="h-full bg-green-500"
        style={{ width: `${qrPercent}%` }}
      />
    </div>

    <div className="grid grid-cols-2 gap-6">

      <div className="p-4 border rounded-xl text-center">
        <p className="text-sm text-muted-foreground">Web</p>
        <p className="text-2xl font-bold">{insights.webVisits}</p>
        <p className="text-xs">{webPercent.toFixed(0)}%</p>
      </div>

      <div className="p-4 border rounded-xl text-center">
        <p className="text-sm text-muted-foreground">QR</p>
        <p className="text-2xl font-bold">{insights.qrVisits}</p>
        <p className="text-xs">{qrPercent.toFixed(0)}%</p>
      </div>

    </div>

    <div className="mt-4 text-sm text-muted-foreground">
      {insights.qrVisits > insights.webVisits && (
        <p>📍 El cartel está funcionando mejor que la web</p>
      )}

      {insights.webVisits > insights.qrVisits && (
        <p>🌐 La propiedad se está moviendo más online</p>
      )}
    </div>

  </div>

  {/* 🧠 INSIGHTS */}
  <div className="p-6 rounded-xl border bg-white">
    <h3 className="font-semibold mb-4">Insights</h3>

    <ul className="space-y-2 text-sm">

      {insights.totalVisits > 50 && insights.leadsCount === 0 && (
        <li>⚠️ Mucho interés pero sin leads → revisar contacto</li>
      )}

      {insights.revisits > insights.totalVisits * 0.3 && (
        <li>🔥 Usuarios vuelven → alto interés real</li>
      )}

      {insights.totalVisits < 10 && (
        <li>📉 Baja visibilidad → compartir más</li>
      )}

      {insights.conversionRate > 0.1 && (
        <li>🚀 Buena conversión → publicación fuerte</li>
      )}

    </ul>
  </div>

  {/* 🔥 LEADS REALES */}
  <div className="p-6 rounded-xl border bg-white">
    <h3 className="font-semibold mb-4">Personas interesadas</h3>

    {property.leads.length === 0 ? (
      <p className="text-sm text-muted-foreground">
        Aún no hay contactos generados
      </p>
    ) : (
      <div className="space-y-3">

        {[...property.leads]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map((lead) => (
            <div
              key={lead.id}
              className="p-4 border rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-medium capitalize">
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
  <div> <p className="text-sm text-muted-foreground">Total</p> <p className="text-xl font-bold"> {(insights.conversionRate * 100).toFixed(1)}% </p> </div> <div> <p className="text-sm text-muted-foreground">Formulario</p> <p className="text-xl font-bold"> {(insights.formConversion * 100).toFixed(1)}% </p> </div>
</div>


);

}