"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  Bath,
  BedDouble,
  CalendarDays,
  Copy,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Ruler,
  X,
} from "lucide-react"

export const runtime = "edge"

const API_URL = "https://casadata-api-production.up.railway.app"

// =========================
// 🔥 SEND SAFE (FIX REAL)
// =========================
function sendData(url: string, data: any) {
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    keepalive: true,
  })
}

function getSessionId() {
  if (typeof window === "undefined") return "server"

  let session = localStorage.getItem("session")

  if (!session) {
    session =
      crypto.randomUUID() +
      "_" +
      Math.floor(Date.now() / 1000000)

    localStorage.setItem("session", session)
  }

  return session
}

function formatPrice(value: any) {
  const num = Number(value)
  if (!Number.isFinite(num) || num <= 0) return null

  return new Intl.NumberFormat("es-UY", {
    maximumFractionDigits: 0,
  }).format(num)
}

function toStringArray(value: any) {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => String(item).trim())
    .filter(Boolean)
}

export default function PropertyPage() {
  const params = useParams()
  const router = useRouter()
  const propertyId = params.id as string

  const [property, setProperty] = useState<any>(null)
  const [copied, setCopied] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState("")
  const [contact, setContact] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [selectedImage, setSelectedImage] = useState("")

  const gallery: string[] = Array.from(
    new Set(
      [
        property?.image,
        ...(Array.isArray(property?.images) ? property.images : []),
      ].filter(Boolean)
    )
  )

  const priceFormatted = formatPrice(property?.price)

  const highlights = toStringArray(
    property?.highlights || property?.amenities || property?.features
  )

  const services = toStringArray(property?.services || property?.serviceList)

  const extras = toStringArray(property?.extras || property?.detailsList)

  // =========================
  // LOAD PROPERTY
  // =========================
  useEffect(() => {
    fetch(`${API_URL}/property/${propertyId}`)
      .then((r) => r.json())
      .then(setProperty)
  }, [propertyId])

  useEffect(() => {
    if (gallery.length > 0) {
      setSelectedImage(gallery[0])
    }
  }, [propertyId, property?.image, property?.images])

  // =========================
  // VISIT TRACK
  // =========================
  useEffect(() => {
    if (!property) return

    const sessionId = getSessionId()
    const key = `last_visit_${propertyId}_${sessionId}`
    const lastVisit = Number(localStorage.getItem(key) || 0)

    if (!lastVisit || Date.now() - lastVisit > 15000) {
      localStorage.setItem(key, String(Date.now()))

      sendData(`${API_URL}/track`, {
        propertyId,
        source:
          new URLSearchParams(window.location.search).get("src") || "web",
        sessionId,
      })
    }

    const timer = window.setTimeout(() => setShowModal(true), 1500)

    return () => window.clearTimeout(timer)
  }, [property, propertyId])

  // =========================
  // 🔥 TIME TRACK (PRO)
  // =========================
  useEffect(() => {
    if (!propertyId) return

    const sessionId = getSessionId()
    let last = Date.now()

    const interval = setInterval(() => {
      if (document.hidden) return

      const now = Date.now()
      const delta = now - last
      last = now

      if (delta < 500) return

      sendData(`${API_URL}/track-time`, {
        propertyId,
        sessionId,
        timeSpent: delta,
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [propertyId])

  // =========================
  // 🔥 REACH TRACK
  // =========================
  useEffect(() => {
    if (!propertyId) return

    const sessionId = getSessionId()

    const sections = ["hero", "details", "features", "contact"]
    const seen = new Set<string>()

    let timeout: any

    const send = () => {
      sendData(`${API_URL}/track-reach`, {
        propertyId,
        sessionId,
        sections: Array.from(seen),
      })
    }

    const onScroll = () => {
      let changed = false

      sections.forEach((id) => {
        const el = document.getElementById(id)
        if (!el) return

        const rect = el.getBoundingClientRect()

        if (rect.top < window.innerHeight * 0.7) {
          if (!seen.has(id)) {
            seen.add(id)
            changed = true
          }
        }
      })

      if (changed) {
        clearTimeout(timeout)
        timeout = setTimeout(send, 800)
      }
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", onScroll)
    }
  }, [propertyId])

  // =========================
  // CONTACT TRACK
  // =========================
  const trackContact = () => {
    sendData(`${API_URL}/track-reach`, {
      propertyId,
      sessionId: getSessionId(),
      sections: ["contact"],
    })
  }

  // =========================
  // LEADS
  // =========================
  const handleSubmitLead = async () => {
    const safeName = name.trim()
    const safeContact = contact.trim()

    if (!safeName || !safeContact) return

    trackContact()
    setLoading(true)

    await fetch(`${API_URL}/lead`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        propertyId,
        type: "form",
        name: safeName,
        contact: safeContact, // email o celular
        sessionId: getSessionId(),
      }),
    })

    setLoading(false)
    setSent(true)
  }

  const handleWhatsApp = async () => {
    if (!property?.agentPhone) return

    const phone = String(property.agentPhone).replace(/\D/g, "")
    const url = `https://wa.me/${phone}`

    trackContact()

    fetch(`${API_URL}/lead`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        propertyId,
        type: "whatsapp",
        sessionId: getSessionId(),
      }),
    }).catch(() => {})

    window.open(url, "_blank", "noopener,noreferrer")
  }

  const handleEmail = async () => {
    if (!property?.agentEmail) return

    trackContact()

    await fetch(`${API_URL}/lead`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        propertyId,
        type: "form",
        sessionId: getSessionId(),
      }),
    })

    window.location.href = `mailto:${property.agentEmail}`
  }

  const copyPropertyLink = async () => {
    if (typeof window === "undefined") return
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  // =========================
  // UI
  // =========================
  if (!property) return <div className="p-10">Cargando...</div>

  const quickFacts: Array<{
    label: string
    value: string
    icon: any
  }> = [
    property.operationType
      ? { label: "Operación", value: property.operationType, icon: CalendarDays }
      : null,
    priceFormatted
      ? { label: "Precio", value: `$${priceFormatted}`, icon: CalendarDays }
      : null,
    property.bedrooms
      ? { label: "Dormitorios", value: String(property.bedrooms), icon: BedDouble }
      : null,
    property.bathrooms
      ? { label: "Baños", value: String(property.bathrooms), icon: Bath }
      : null,
    property.area
      ? { label: "Superficie", value: `${property.area} m²`, icon: Ruler }
      : null,
  ].filter(Boolean) as any

  return (
    <div className="min-h-screen bg-gray-50">
      {/* TOP BAR */}
      <div className="border-b bg-white/90 backdrop-blur sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>

          <button
            onClick={copyPropertyLink}
            className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg border bg-white hover:bg-gray-50"
          >
            <Copy className="w-4 h-4" />
            {copied ? "Copiado" : "Compartir"}
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        <div className="grid lg:grid-cols-[minmax(0,1.55fr)_380px] gap-8 items-start">
          {/* LEFT */}
          <div className="space-y-6">
            {/* TITLE / CONTEXT */}
            <section className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider text-gray-500">
                <span>Ficha del inmueble</span>
                {property.operationType && (
                  <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                    {property.operationType}
                  </span>
                )}
                {property.code && (
                  <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                    Código {property.code}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900">
                {property.title}
              </h1>

              <div className="flex items-start gap-2 text-gray-600">
                <MapPin className="w-4 h-4 mt-1 shrink-0" />
                <p className="text-sm md:text-base">
                  {property.address || property.location}
                </p>
              </div>
            </section>

            {/* HERO */}
            <section id="hero">
              <Card className="overflow-hidden shadow-sm">
                <div className="relative">
                  <img
                    src={selectedImage || property.image}
                    alt={property.title}
                    className="w-full aspect-[16/11] object-cover"
                  />

                  <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    {property.operationType && (
                      <span className="rounded-full bg-black/70 text-white px-3 py-1 text-xs backdrop-blur">
                        {property.operationType}
                      </span>
                    )}

                    {priceFormatted && (
                      <span className="rounded-full bg-white/90 text-gray-900 px-3 py-1 text-xs font-medium">
                        ${priceFormatted}
                      </span>
                    )}
                  </div>
                </div>

                {gallery.length > 1 && (
                  <div className="p-4 border-t bg-white">
                    <div className="flex gap-3 overflow-x-auto pb-1">
                      {gallery.map((img: string, idx: number) => (
                        <button
                          key={`${img}-${idx}`}
                          onClick={() => setSelectedImage(img)}
                          className={`shrink-0 rounded-lg overflow-hidden border-2 transition ${
                            selectedImage === img
                              ? "border-gray-900"
                              : "border-transparent opacity-70 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={img}
                            alt={`${property.title} ${idx + 1}`}
                            className="w-24 h-16 object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </section>

            {/* QUICK FACTS */}
            {quickFacts.length > 0 && (
              <section>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {quickFacts.map((fact) => {
                    const Icon = fact.icon
                    return (
                      <div
                        key={fact.label}
                        className="rounded-xl border bg-white p-4 shadow-sm"
                      >
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                          <Icon className="w-4 h-4" />
                          <span>{fact.label}</span>
                        </div>
                        <p className="font-medium text-gray-900">{fact.value}</p>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {/* DETAILS */}
            <section id="details">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Detalles clave</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  {property.createdAt && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <CalendarDays className="w-4 h-4" />
                      <span>
                        Publicado{" "}
                        {new Date(property.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-3">
                    {property.floor && (
                      <div className="rounded-xl bg-gray-50 border p-4">
                        <p className="text-sm font-medium text-gray-900">Piso</p>
                        <p className="text-sm text-gray-700 mt-1">
                          {property.floor}
                        </p>
                      </div>
                    )}

                    {property.expenses && (
                      <div className="rounded-xl bg-gray-50 border p-4">
                        <p className="text-sm font-medium text-gray-900">
                          Gastos comunes
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          ${property.expenses}
                        </p>
                      </div>
                    )}

                    {property.parking && (
                      <div className="rounded-xl bg-gray-50 border p-4">
                        <p className="text-sm font-medium text-gray-900">
                          Garage
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          {property.parking}
                        </p>
                      </div>
                    )}

                    {property.orientation && (
                      <div className="rounded-xl bg-gray-50 border p-4">
                        <p className="text-sm font-medium text-gray-900">
                          Orientación
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          {property.orientation}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* DESCRIPTION */}
            <section id="features">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Descripción</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  {property.description ? (
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {property.description}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Aún no hay descripción cargada.
                    </p>
                  )}

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="rounded-xl bg-green-50 border border-green-100 p-4">
                      <p className="text-sm font-medium text-green-900">
                        Vista rápida
                      </p>
                      <p className="text-sm text-green-800 mt-1">
                        La información clave está arriba; esta sección ayuda a
                        vender mejor la intención.
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 border p-4">
                      <p className="text-sm font-medium text-slate-900">
                        Siguiente paso
                      </p>
                      <p className="text-sm text-slate-700 mt-1">
                        Abrí contacto, dejá datos o continuá navegando.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* HIGHLIGHTS */}
            {highlights.length > 0 && (
              <section>
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>Características destacadas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {highlights.map((item) => (
                        <span
                          key={item}
                          className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* SERVICES */}
            {services.length > 0 && (
              <section>
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>Amenities / servicios</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {services.map((item) => (
                        <div
                          key={item}
                          className="rounded-xl border bg-white px-3 py-2 text-sm text-gray-700"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* EXTRAS */}
            {extras.length > 0 && (
              <section>
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>Información adicional</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-2">
                      {extras.map((item) => (
                        <div
                          key={item}
                          className="rounded-xl border bg-gray-50 px-3 py-2 text-sm text-gray-700"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}
          </div>

          {/* RIGHT / CONTACT */}
          <div id="contact" className="lg:sticky lg:top-24 space-y-4">
            <Card className="shadow-sm border-2 border-slate-200">
              <CardHeader>
                <CardTitle>Contacto</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                {property.agentPhone && (
                  <Button
                    onClick={handleWhatsApp}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                )}

                {property.agentPhone && (
                  <Button
                    onClick={() =>
                      (window.location.href = `tel:${property.agentPhone}`)
                    }
                    variant="outline"
                    className="w-full"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Llamar
                  </Button>
                )}

                {property.agentEmail && (
                  <Button
                    onClick={handleEmail}
                    variant="outline"
                    className="w-full"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                )}

                <Button
                  onClick={() => setShowModal(true)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                >
                  Dejar datos
                </Button>

                <button
                  onClick={copyPropertyLink}
                  className="w-full text-sm text-gray-600 hover:text-black inline-flex items-center justify-center gap-2 py-2"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? "Enlace copiado" : "Copiar enlace"}
                </button>

                <div className="rounded-xl bg-slate-50 border p-4 text-sm text-slate-700">
                  <p className="font-medium text-slate-900">Respuesta rápida</p>
                  <p className="mt-1">
                    Dejá tu email o celular y te contactamos. El mismo input
                    acepta cualquiera de los dos.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Resumen de la ficha</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-700">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Título</span>
                  <span className="text-right font-medium">{property.title}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Ubicación</span>
                  <span className="text-right font-medium">
                    {property.address || property.location}
                  </span>
                </div>
                {priceFormatted && (
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Precio</span>
                    <span className="text-right font-medium">
                      ${priceFormatted}
                    </span>
                  </div>
                )}
                {property.operationType && (
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Operación</span>
                    <span className="text-right font-medium">
                      {property.operationType}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 p-3"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white w-full max-w-md rounded-2xl p-6 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>

            {!sent ? (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Dejá tus datos</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Podés dejar tu email o tu celular en el mismo campo.
                  </p>
                </div>

                <input
                  className="w-full border rounded-xl p-3"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nombre"
                />

                <input
                  className="w-full border rounded-xl p-3"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Email o celular"
                />

                <Button
                  onClick={handleSubmitLead}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                >
                  {loading ? "Enviando..." : "Enviar"}
                </Button>
              </div>
            ) : (
              <div className="py-8 text-center space-y-3">
                <p className="text-2xl">✅</p>
                <h2 className="text-xl font-semibold">Enviado</h2>
                <p className="text-sm text-gray-500">
                  Ya recibimos tus datos.
                </p>
                <Button
                  onClick={() => setShowModal(false)}
                  variant="outline"
                  className="mt-2"
                >
                  Cerrar
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
