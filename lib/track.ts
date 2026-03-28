import { prisma } from "./prisma";

export async function trackVisit({ propertyId, source, sessionId }) {
  return prisma.visit.create({
    data: {
      propertyId,
      source,
      sessionId,
    },
  });

  
}