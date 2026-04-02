type PropertyStatus =
  | "alta_demanda"
  | "interes_activo"
  | "baja_demanda"
  | "nuevo";

type Insights = {
  totalVisits: number;
  uniqueUsers: number;
  revisits: number;
  leadsCount: number;

  formLeads: number;
  whatsappLeads: number;

  conversionRate: number;
  formConversion: number;
  whatsappConversion: number;

  qrVisits: number;
  webVisits: number;

  status: PropertyStatus;
  score: number;

  // 🔥 NUEVO
  avgTime: number;
  reach: Record<string, number>;
};

export function getInsights(
  visits: any[],
  leads: any[],
  analytics: any[] = [] // 👈 NUEVO
): Insights {
  const totalVisits = visits.length;

  // 🔥 usuarios únicos
  const sessionsMap: Record<string, number> = {};

  visits.forEach((v) => {
    sessionsMap[v.sessionId] = (sessionsMap[v.sessionId] || 0) + 1;
  });

  const uniqueUsers = Object.keys(sessionsMap).length;
  const sessions = Object.values(sessionsMap);

  const usersWhoRevisit = sessions.filter((c) => c > 1).length;

  const hotLeads = Object.entries(sessionsMap)
    .filter(([_, count]) => count >= 3)
    .map(([sessionId]) => {
      const userVisits = visits.filter((v) => v.sessionId === sessionId);

      return {
        sessionId,
        visits: userVisits.length,
        lastVisit: userVisits[userVisits.length - 1].createdAt,
        source: userVisits[0].source,
      };
    });

  const revisits = sessions
    .map((c) => c - 1)
    .reduce((a, b) => a + b, 0);

  const intensity = uniqueUsers ? revisits / uniqueUsers : 0;

  const leadsCount = leads.length;

  // 🔥 LEADS
  const formLeads = leads.filter((l) => l.type === "form").length;
  const whatsappLeads = leads.filter((l) => l.type === "whatsapp").length;

  // 🔥 CONVERSIONES
  const conversionRate = uniqueUsers ? leadsCount / uniqueUsers : 0;
  const formConversion = uniqueUsers ? formLeads / uniqueUsers : 0;
  const whatsappConversion = uniqueUsers
    ? whatsappLeads / uniqueUsers
    : 0;

  // 🔥 QR vs WEB
  const qrVisits = visits.filter((v) => v.source === "qr").length;
  const webVisits = visits.filter((v) => v.source === "web").length;

  // =========================
  // 🔥 NUEVO: TIEMPO EN FICHA
  // =========================

  const totalTime = analytics.reduce(
    (acc, a) => acc + (a.timeSpent || 0),
    0
  );

  const timeBySession: Record<string, number> = {};

analytics.forEach((a) => {
  if (!a.sessionId) return;

  timeBySession[a.sessionId] =
    (timeBySession[a.sessionId] || 0) + (a.timeSpent || 0);
});

const totalUserTime = Object.values(timeBySession).reduce(
  (a, b) => a + b,
  0
);

const avgTime = Object.keys(timeBySession).length
  ? totalUserTime / Object.keys(timeBySession).length
  : 0;

  // =========================
  // 🔥 NUEVO: REACH
  // =========================

const reachMap: Record<string, Set<string>> = {};

analytics.forEach((a) => {
  if (!a.sessionId) return;

  const sections = a.sections || [];

  sections.forEach((section: string) => {
    if (!reachMap[section]) {
      reachMap[section] = new Set();
    }
    reachMap[section].add(a.sessionId);
  });
});

const reach: Record<string, number> = {};

Object.entries(reachMap).forEach(([section, set]) => {
  reach[section] = set.size;
});

  // =========================
  // 🔥 SCORE (mejorado)
  // =========================

const avgTimeSeconds = avgTime / 1000;

let rawScore =
  totalVisits * 3 +
  uniqueUsers * 5 +
  revisits * 10 +
  leadsCount * 30 +
  conversionRate * 100 * 8 +
  Math.min(avgTimeSeconds, 120) * 0.5;

  let status: PropertyStatus = "nuevo";

  if (score >= 70) status = "alta_demanda";
  else if (score >= 40) status = "interes_activo";
  else if (score > 0) status = "baja_demanda";
  else status = "nuevo";

  return {
    totalVisits,
    uniqueUsers,
    revisits,
    leadsCount,

    formLeads,
    whatsappLeads,

    conversionRate,
    formConversion,
    whatsappConversion,

    qrVisits,
    webVisits,

    status,
    score,

    // 🔥 NUEVO
    avgTime,
    reach,
  };
}
