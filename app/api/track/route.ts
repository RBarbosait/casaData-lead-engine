import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
try {
const body = await req.json();

const { propertyId, source, sessionId } = body;

if (!propertyId || !sessionId) {
  return Response.json({ error: "Missing data" }, { status: 400 });
}

await prisma.visit.create({
  data: {
    propertyId,
    source: source || "web",
    sessionId,
  },
});

return Response.json({ ok: true });

} catch (error) {
console.error("TRACK ERROR:", error);
return Response.json({ error: "Server error" }, { status: 500 });
}
}
