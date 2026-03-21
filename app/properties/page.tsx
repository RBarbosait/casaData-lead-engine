import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PropertyCard } from '@/components/property-card'
import { mockProperties, mockMetrics } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, SlidersHorizontal } from 'lucide-react'

export const metadata = {
  title: 'Propiedades - casaData',
  description: 'Explora las propiedades disponibles en casaData'
}

export default function PropertiesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-border bg-muted/30 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h1 className="mb-4 text-3xl font-bold md:text-4xl">Propiedades</h1>
            <p className="max-w-2xl text-muted-foreground">
              Explora todas las propiedades disponibles. Cada una incluye un codigo QR para compartir facilmente.
            </p>
          </div>
        </section>

        {/* Filters Section */}
        <section className="border-b border-border py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 items-center gap-3">
                <div className="relative flex-1 md:max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por ubicacion..."
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="icon" className="shrink-0">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="sr-only">Filtros</span>
                </Button>
              </div>
              
              <div className="flex items-center gap-3">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    <SelectItem value="casa">Casas</SelectItem>
                    <SelectItem value="apartamento">Apartamentos</SelectItem>
                    <SelectItem value="terreno">Terrenos</SelectItem>
                    <SelectItem value="oficina">Oficinas</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select defaultValue="recent">
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Ordenar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Mas recientes</SelectItem>
                    <SelectItem value="price-asc">Menor precio</SelectItem>
                    <SelectItem value="price-desc">Mayor precio</SelectItem>
                    <SelectItem value="demand">Mayor demanda</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Properties Grid */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {mockProperties.length} propiedades encontradas
              </p>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {mockProperties.map((property) => {
                const metrics = mockMetrics.find(m => m.propertyId === property.id)
                return (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    metrics={metrics}
                  />
                )
              })}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
