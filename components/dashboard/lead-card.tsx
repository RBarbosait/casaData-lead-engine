"use client"

import { useRouter } from "next/navigation"

export default function LeadCard({ lead }: any) {
  const router = useRouter()

  const isNew = !lead.seen

  const markAsSeen = async () => {
    await fetch(
      `https://casadata-api-production.up.railway.app/lead/${lead.id}/seen`,
      { method: "PATCH" }
    )

    router.refresh() // 🔥 CLAVE
  }

  const createdAt = new Date(lead.createdAt)

  return (
    <div
      onClick={markAsSeen}
      className={`p-4 border rounded-lg flex justify-between cursor-pointer transition ${
        isNew
          ? "bg-green-50 border-green-300"
          : "bg-white hover:bg-gray-50"
      }`}
    >
      <div>
        <div className="flex items-center gap-2">
          <p className="font-medium">
            {lead.type === "whatsapp" ? "WhatsApp" : "Formulario"}
          </p>

          <span
            className={`text-xs px-2 py-1 rounded ${
              isNew
                ? "bg-green-200 text-green-800"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {isNew ? "Nuevo" : "Visto"}
          </span>
        </div>

        {lead.name && (
          <p className="text-sm font-medium mt-1">{lead.name}</p>
        )}

        {lead.contact && (
          <p className="text-sm text-muted-foreground">
            {lead.contact}
          </p>
        )}

        {lead.sessionId && (
          <p className="text-xs text-gray-400">
            session: {lead.sessionId.slice(0, 8)}...
          </p>
        )}
      </div>

      <div className="text-xs text-muted-foreground">
        {createdAt.toLocaleString()}
      </div>
    </div>
  )
}
