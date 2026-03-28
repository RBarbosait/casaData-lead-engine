"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Copy, Phone, X } from "lucide-react"

function getSessionId() {
let session = localStorage.getItem("session_id")
if (!session) {
session = crypto.randomUUID()
localStorage.setItem("session_id", session)
}
return session
}

export default function PropertyPage() {
const params = useParams()
const router = useRouter()
const propertyId = params.id as string

const [property, setProperty] = useState<any>(null)
const [copied, setCopied] = useState(false)

// 🔥 MODAL
const [showModal, setShowModal] = useState(false)
const [dontShowAgain, setDontShowAgain] = useState(false)

const [name, setName] = useState("")
const [contact, setContact] = useState("")
const [loading, setLoading] = useState(false)
const [sent, setSent] = useState(false)

// 🔥 FETCH PROPERTY
useEffect(() => {
const load = async () => {
const res = await fetch(`/api/property/${propertyId}`)
const data = await res.json()
setProperty(data)
}
load()
}, [propertyId])

// 🔥 TRACK + CONTROL MODAL
useEffect(() => {
if (!property) return


const sessionId = getSessionId()

fetch("/api/track", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    propertyId,
    source: new URLSearchParams(window.location.search).get("src") || "web",
    sessionId,
  }),
})

const dismissed = localStorage.getItem(`modal_dismissed_${propertyId}`)

if (!dismissed) {
  setTimeout(() => setShowModal(true), 1500)
}


}, [property])

// 🔥 MENSAJE DINÁMICO
const getMessage = () => {
if (!property) return ""


if (property.status === "nuevo")
  return "Sé el primero en interesarte en esta propiedad"

if (property.status === "alta_demanda")
  return "🔥 Hay varias personas interesadas. Llegá antes que el resto"

if (property.status === "baja_demanda")
  return "💡 Aprovechá esta oportunidad con menos competencia"

return "Esta propiedad está generando interés"


}

// 🔥 SUBMIT LEAD
const handleSubmitLead = async () => {
if (!name || !contact) return


setLoading(true)

await fetch("/api/lead", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    propertyId,
    type: "form",
    name,
    contact,
  }),
})

setLoading(false)
setSent(true)


}

// 🔥 WHATSAPP
const handleWhatsApp = async () => {
await fetch("/api/lead", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
propertyId,
type: "whatsapp",
}),
})


const msg = encodeURIComponent(
  `Hola, me interesa esta propiedad: ${property.title}`
)

window.open(`https://wa.me/${property.agentPhone}?text=${msg}`)


}

// 🔥 EMAIL
const handleEmail = async () => {
await fetch("/api/lead", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
propertyId,
type: "form",
}),
})


window.location.href = `mailto:${property.agentEmail}?subject=Consulta propiedad&body=Hola, me interesa ${property.title}`


}

// 🔥 CLOSE MODAL CON CONTROL
const handleCloseModal = () => {
if (dontShowAgain) {
localStorage.setItem(`modal_dismissed_${propertyId}`, "true")
}


setShowModal(false)


}

const copyLink = async () => {
await navigator.clipboard.writeText(window.location.href)
setCopied(true)
setTimeout(() => setCopied(false), 2000)
}

if (!property) return <div className="p-10">Cargando...</div>

return ( <div className="min-h-screen bg-background">


  {/* HEADER */}
  <header className="border-b sticky top-0 bg-white z-40">
    <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between">
      <Button variant="ghost" onClick={() => router.push("/inmuebles")}>
        <ArrowLeft className="w-4 h-4 mr-1" /> Volver
      </Button>

      <Button variant="outline" onClick={copyLink}>
        <Copy className="w-4 h-4 mr-1" />
        {copied ? "Copiado" : "Copiar link"}
      </Button>
    </div>
  </header>

  <div className="max-w-4xl mx-auto p-6 grid md:grid-cols-3 gap-6">

    {/* MAIN */}
    <div className="md:col-span-2 space-y-4">
      <img src={property.image} className="w-full h-80 object-cover rounded-lg" />

      <h1 className="text-2xl font-bold">{property.title}</h1>
      <p className="text-muted-foreground">{property.address}</p>

      <div className="text-emerald-600 font-medium">
        {getMessage()}
      </div>

      <p>{property.description}</p>
    </div>

    {/* SIDEBAR */}
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Contacto</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">

          <Button className="w-full" onClick={handleWhatsApp}>
            <Phone className="w-4 h-4 mr-2" />
            Escribir por WhatsApp
          </Button>

          <Button variant="outline" className="w-full" onClick={handleEmail}>
            Enviar email
          </Button>

          <Button
            variant="ghost"
            className="w-full"
            onClick={() => setShowModal(true)}
          >
            Dejar mis datos
          </Button>

        </CardContent>
      </Card>
    </div>
  </div>

  {/* 🔥 MODAL */}
  {showModal && (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-xl p-6 w-full max-w-md relative">

        {/* CLOSE */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-black"
          onClick={handleCloseModal}
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-semibold mb-2">
          {getMessage()}
        </h2>

        <p className="text-sm text-muted-foreground mb-4">
          Dejá tu contacto y te escriben
        </p>

        {!sent ? (
          <>
            <input
              type="text"
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-md p-2 text-sm mb-2"
            />

            <input
              type="text"
              placeholder="Email o teléfono"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full border rounded-md p-2 text-sm mb-3"
            />

            <Button
              className="w-full"
              onClick={handleSubmitLead}
              disabled={loading}
            >
              {loading ? "Enviando..." : "Quiero que me contacten"}
            </Button>

            <div className="flex items-center gap-2 mt-3">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
              />
              <span className="text-xs text-muted-foreground">
                No volver a mostrar
              </span>
            </div>
          </>
        ) : (
          <p className="text-green-600 text-sm">
            ✅ Te van a contactar pronto
          </p>
        )}

      </div>
    </div>
  )}

</div>)

}
