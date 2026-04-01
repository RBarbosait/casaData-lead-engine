"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LeadCard({ lead }: any) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const isNew = !lead.seen
  const createdAt = new Date(lead.createdAt)

  // 🔥 detectar tipo de contacto
  const rawContact = lead.contact || ""
  const isEmail = rawContact.includes("@")
  const isPhone = !isEmail && rawContact.replace(/\D/g, "").length >= 7

  // 🔥 acciones
  const markAsSeen = async () => {
    await fetch(
      `https://casadata-api-production.up.railway.app/lead/${lead.id}/seen`,
      { method: "PATCH" }
    )

    setOpen(false)
    router.refresh()
  }

  const openWhatsApp = () => {
    if (!isPhone) return
    const phone = rawContact.replace(/\D/g, "")
    window.open(`https://wa.me/${phone}`, "_blank")
  }

  const callUser = () => {
    if (!isPhone) return
    window.location.href = `tel:${rawContact}`
  }

  const sendEmail = () => {
    if (!isEmail) return
    window.location.href = `mailto:${rawContact}`
  }

  const copyContact = async () => {
    if (!rawContact) return
    await navigator.clipboard.writeText(rawContact)
  }

  return (
    <>
      {/* CARD */}
      <div
        onClick={() => setOpen(true)}
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

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-end md:items-center justify-center z-50">
          <div className="bg-white w-full md:max-w-md rounded-t-xl md:rounded-xl p-6 space-y-4">

            <h2 className="text-lg font-semibold">
              {lead.type === "whatsapp" ? "WhatsApp" : "Formulario"}
            </h2>

            {lead.name && <p><strong>Nombre:</strong> {lead.name}</p>}
            {lead.contact && <p><strong>Contacto:</strong> {lead.contact}</p>}

            <p className="text-sm text-gray-500">
              {createdAt.toLocaleString()}
            </p>

            {/* 🔥 ACCIONES DINÁMICAS */}
            <div className="grid grid-cols-3 gap-2 pt-2">

              {isPhone && (
                <>
                  <button
                    onClick={openWhatsApp}
                    className="bg-green-600 text-white py-2 rounded text-sm"
                  >
                    WhatsApp
                  </button>

                  <button
                    onClick={callUser}
                    className="bg-blue-600 text-white py-2 rounded text-sm"
                  >
                    Llamar
                  </button>
                </>
              )}

              {isEmail && (
                <button
                  onClick={sendEmail}
                  className="bg-purple-600 text-white py-2 rounded text-sm col-span-2"
                >
                  Email
                </button>
              )}

              <button
                onClick={copyContact}
                className="bg-gray-200 py-2 rounded text-sm"
              >
                Copiar
              </button>

            </div>

            {/* FOOTER */}
            <div className="flex justify-between pt-4">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cerrar
              </button>

              {isNew && (
                <button
                  onClick={markAsSeen}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Marcar visto
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  )
}
