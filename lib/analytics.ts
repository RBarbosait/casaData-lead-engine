export function getInsights(visits, leads) {
  const totalVisits = visits.length;

  const uniqueSessions = new Set(visits.map(v => v.sessionId));
  const revisits = totalVisits - uniqueSessions.size;

  const leadsCount = leads.length;

  const revisitRate = totalVisits ? revisits / totalVisits : 0;
  const conversionRate = totalVisits ? leadsCount / totalVisits : 0;

  let status = "nuevo";

  if (totalVisits > 50 && revisitRate > 0.3) {
    status = "alta_demanda";
  } else if (totalVisits > 20) {
    status = "interes_activo";
  } else if (totalVisits < 10) {
    status = "baja_demanda";
  }

  return {
    totalVisits,
    revisits,
    leadsCount,
    status,
    revisitRate,
    conversionRate,
  };
}