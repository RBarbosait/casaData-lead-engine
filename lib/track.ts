import { prisma } from "./prisma"

type TrackVisitParams = {
  propertyId: string
  source?: string
  sessionId: string
}

export async function trackVisit({
  propertyId,
  source = "web",
  sessionId,
}: TrackVisitParams) {
  return prisma.visit.create({
    data: {
      propertyId,
      source,
      sessionId,
    },
  })
}