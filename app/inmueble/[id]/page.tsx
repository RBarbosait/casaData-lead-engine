"use client"

import { useState, useRef, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Eye, Home, Building, Car, ArrowLeft, Copy, QrCode, Download, Printer } from "lucide-react"
import { getPropertyById } from "@/lib/properties"

// 🔥 session persistente
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

const [showContact, setShowContact] = useState(false)
const [copied, setCopied] = useState(false)
const [showQR, setShowQR] = useState(false)
const qrRef = useRef<HTMLDivElement>(null)

const propertyId = params.id as string

const [property, setProperty] = useState<any>(null)

// 🔥 URL con tracking QR
const getPropertyUrl = () => {
if (typeof window !== "undefined") {
const origin = window.location.origin
return `${origin}/inmueble/${propertyId}?src=qr`
}
return ""
}

const propertyUrl = getPropertyUrl()

useEffect(() => {
  const loadProperty = async () => {
    const res = await fetch(`/api/property/${propertyId}`)
    const data = await res.json()
    setProperty(data)
  }

  loadProperty()
}, [propertyId])

// 🔥 TRACKING REAL
useEffect(() => {
if (!property) return


const sessionId = getSessionId()

fetch("/api/track", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    propertyId: propertyId.toString(),
    source: new URLSearchParams(window.location.search).get("src") || "web",
    sessionId,
  }),
})


}, [propertyId, property])

const copyLink = async () => {
try {
await navigator.clipboard.writeText(propertyUrl)
setCopied(true)
setTimeout(() => setCopied(false), 2000)
} catch (err) {
console.error("Failed to copy: ", err)
}
}

const handleBackClick = () => {
router.push(`/inmuebles?scrollTo=${propertyId}`)
}

// 🔥 LEAD TRACKING
const handleCall = async () => {
await fetch("/api/lead", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
propertyId: propertyId.toString(),
type: "whatsapp",
}),
})

window.open(`tel:${property.agentPhone}`)

}

const printQR = () => {
if (qrRef.current) {
const printWindow = window.open("", "_blank")
if (printWindow) {
printWindow.document.write(`           <html>             <head>               <title>QR - ${property?.title}</title>               <style>
                body { font-family: Arial; text-align: center; padding: 20px; }
                .box { border: 2px solid #000; padding: 20px; max-width: 400px; margin: auto; }               </style>             </head>             <body>               <div class="box">                 <h2>${property?.title}</h2>                 <p>${property?.address}</p>                 <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(propertyUrl)}" />                 <p>${propertyUrl}</p>               </div>             </body>           </html>
        `)
printWindow.document.close()
printWindow.print()
}
}
}

const getTypeIcon = (type: string) => {
switch (type) {
case "Casa":
return <Home className="w-5 h-5" />
case "Apartamento":
return <Building className="w-5 h-5" />
case "Local Comercial":
return <Building className="w-5 h-5" />
case "Cochera":
return <Car className="w-5 h-5" />
default:
return <Home className="w-5 h-5" />
}
}

if (!property) {
return ( <div className="min-h-screen flex items-center justify-center"> <div className="text-center"> <h1 className="text-2xl font-bold">Propiedad no encontrada</h1>
<Button onClick={() => router.push("/inmuebles")}>Volver</Button> </div> </div>
)
}

return ( <div className="min-h-screen bg-background">


  {/* HEADER */}
  <header className="border-b sticky top-0 bg-white z-40">
    <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between">
      <Button variant="ghost" onClick={handleBackClick}>
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

      {/* 🔥 NUEVO MENSAJE CLAVE */}
      <div className="text-emerald-600 font-medium">
        🔥 Esta propiedad está generando interés
      </div>

      <p>{property.description}</p>
    </div>

    {/* SIDEBAR */}
    <div className="space-y-4">

      {/* CONTACTO */}
      <Card>
        <CardHeader>
          <CardTitle>Contacto</CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={handleCall}>
            <Phone className="w-4 h-4 mr-2" />
            Contactar
          </Button>
        </CardContent>
      </Card>

      {/* QR SOLO SI ES DEL USUARIO */}
      {property.isUserGenerated && (
        <Card>
          <CardHeader>
            <CardTitle>QR</CardTitle>
          </CardHeader>
          <CardContent ref={qrRef}>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(propertyUrl)}`}
              className="mx-auto"
            />

            <div className="grid grid-cols-2 gap-2 mt-3">
              <Button size="sm" onClick={printQR}>
                <Printer className="w-3 h-3 mr-1" />
                Imprimir
              </Button>

              <Button
                size="sm"
                onClick={() => {
                  const link = document.createElement("a")
                  link.href = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(propertyUrl)}`
                  link.download = "qr.png"
                  link.click()
                }}
              >
                <Download className="w-3 h-3 mr-1" />
                Descargar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  </div>
</div>


)
}
