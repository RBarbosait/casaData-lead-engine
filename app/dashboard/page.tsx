import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { DashboardContent } from '@/components/dashboard-content'

export const metadata = {
  title: 'Dashboard - casaData',
  description: 'Gestiona tus propiedades y mira las metricas de leads'
}

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <DashboardContent />
      </main>
      <Footer />
    </div>
  )
}
