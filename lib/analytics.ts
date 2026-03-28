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
};

export function getInsights(visits: any[], leads: any[]): Insights {
const totalVisits = visits.length;

// 🔥 usuarios únicos
const sessionsMap: Record<string, number> = {};

visits.forEach((v) => {
sessionsMap[v.sessionId] = (sessionsMap[v.sessionId] || 0) + 1;
});

const uniqueUsers = Object.keys(sessionsMap).length;

const revisits = Object.values(sessionsMap).filter(
(count) => count > 1
).length;

const leadsCount = leads.length;

// 🔥 LEADS
const formLeads = leads.filter((l) => l.type === "form").length;
const whatsappLeads = leads.filter((l) => l.type === "whatsapp").length;

// 🔥 CONVERSIONES
const conversionRate = uniqueUsers ? leadsCount / uniqueUsers : 0;
const formConversion = uniqueUsers ? formLeads / uniqueUsers : 0;
const whatsappConversion = uniqueUsers ? whatsappLeads / uniqueUsers : 0;

// 🔥 QR vs WEB (FIX CLAVE)
const qrVisits = visits.filter((v) => v.source === "qr").length;
const webVisits = visits.filter((v) => v.source === "web").length;

// 🔥 SCORE
let rawScore =
uniqueUsers * 1 +
revisits * 2 +
leadsCount * 10 +
conversionRate * 100 * 5;

let score = Math.min(100, rawScore);

let status: PropertyStatus = "nuevo";

if (score > 70) status = "alta_demanda";
else if (score > 40) status = "interes_activo";
else if (score < 20) status = "baja_demanda";

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


};
}
