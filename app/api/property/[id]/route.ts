import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: params.id },
    });

    return Response.json(property);
  } catch (error) {
    return Response.json({ error: "Error" }, { status: 500 });
  }
}