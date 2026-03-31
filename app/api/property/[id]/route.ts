import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: params.id },
      include: {
        visits: true,
        leads: true,
      //  sessionAnalytics: true, // 🔥 CLAVE
      },
    });

    return Response.json(property);
  } catch (error) {
    console.error("PROPERTY ERROR", error)

    return Response.json(
      { error: "Error fetching property" },
      { status: 500 }
    );
  }
}
