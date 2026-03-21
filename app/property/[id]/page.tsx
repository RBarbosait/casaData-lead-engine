import { notFound } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PropertyDetail } from '@/components/property-detail'
import { getPropertyById, getMetricsByPropertyId } from '@/lib/data'

interface PropertyPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ source?: string }>
}

export async function generateMetadata({ params }: PropertyPageProps) {
  const { id } = await params
  const property = getPropertyById(id)
  
  if (!property) {
    return { title: 'Propiedad no encontrada - casaData' }
  }
  
  return {
    title: `${property.title} - casaData`,
    description: property.description,
    openGraph: {
      title: property.title,
      description: property.description,
      images: property.images,
    }
  }
}

export default async function PropertyPage({ params, searchParams }: PropertyPageProps) {
  const { id } = await params
  const { source } = await searchParams
  const property = getPropertyById(id)
  
  if (!property) {
    notFound()
  }
  
  const metrics = getMetricsByPropertyId(id)
  const isFromQR = source === 'qr'
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <PropertyDetail 
          property={property} 
          metrics={metrics} 
          isFromQR={isFromQR}
        />
      </main>
      <Footer />
    </div>
  )
}
