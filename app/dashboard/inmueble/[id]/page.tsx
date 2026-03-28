import { prisma } from "@/lib/prisma";
import { getInsights } from "@/lib/analytics";

export default async function Page({ params }: { params: { id: string } }) {
const propertyId = params.id;

const property = await prisma.property.findUnique({
where: { id: propertyId },
include: {
visits: true,
leads: true,
},
});

if (!property) {
return <div className="p-6">Inmueble no encontrado</div>;
}

const insights = getInsights(property.visits, property.leads);

return ( <div className="p-8 space-y-6">


  <h1 className="text-2xl font-bold">{property.title}</h1>

  {/* 🔥 ESTADO */}
  <div className="p-4 rounded-lg bg-muted">
    <p className="text-lg font-semibold">
      Estado: {insights.status}
    </p>
  </div>

  {/* 📊 MÉTRICAS */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

    <div className="p-4 border rounded-lg">
      <p className="text-sm text-muted-foreground">Visitas</p>
      <p className="text-xl font-bold">{insights.totalVisits}</p>
    </div>

    <div className="p-4 border rounded-lg">
      <p className="text-sm text-muted-foreground">Revisitas</p>
      <p className="text-xl font-bold">{insights.revisits}</p>
    </div>

    <div className="p-4 border rounded-lg">
      <p className="text-sm text-muted-foreground">Leads</p>
      <p className="text-xl font-bold">{insights.leadsCount}</p>
    </div>

    <div className="p-4 border rounded-lg">
      <p className="text-sm text-muted-foreground">Conversión</p>
      <p className="text-xl font-bold">
        {(insights.conversionRate * 100).toFixed(1)}%
      </p>
    </div>

  </div>

</div>


);
}
