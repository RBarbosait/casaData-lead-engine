export default function AboutPage() {
  return (
    <div className="min-h-screen max-w-3xl mx-auto p-6 space-y-8">

      <h1 className="text-3xl font-bold">
        Sobre casaData
      </h1>

      <p className="text-gray-600 leading-relaxed">
        casaData no es un portal inmobiliario.
        Es una herramienta para entender el comportamiento real
        de los usuarios sobre una propiedad.
      </p>

      <div className="space-y-4">
        <div className="p-5 border rounded-xl">
          <h2 className="font-semibold">Problema</h2>
          <p className="text-gray-600 text-sm">
            Los portales muestran visitas, pero no intención real.
          </p>
        </div>

        <div className="p-5 border rounded-xl">
          <h2 className="font-semibold">Solución</h2>
          <p className="text-gray-600 text-sm">
            casaData mide comportamiento: tiempo, revisitas,
            interacción y contacto.
          </p>
        </div>

        <div className="p-5 border rounded-xl">
          <h2 className="font-semibold">Resultado</h2>
          <p className="text-gray-600 text-sm">
            Más cierres, menos pérdida de tiempo.
          </p>
        </div>
      </div>

    </div>
  )
}
