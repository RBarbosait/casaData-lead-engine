import { prisma } from "@/lib/prisma";

export const runtime = 'edge'
export async function POST(req: Request) {
try {
const body = await req.json();


const { propertyId, type, contact } = body;

if (!propertyId || !type) {
  return Response.json({ error: "Missing data" }, { status: 400 });
}

await prisma.lead.create({
  data: {
    propertyId,
    type,
    contact: contact || null,
  },
});

return Response.json({ ok: true });


} catch (error) {
console.error("LEAD ERROR:", error);
return Response.json({ error: "Server error" }, { status: 500 });
}
}
