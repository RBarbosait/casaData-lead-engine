import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  QrCode, 
  MessageCircle, 
  BarChart3, 
  Share2, 
  ArrowRight,
  Eye,
  Users,
  TrendingUp,
  Zap,
  Target,
  Smartphone
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-background to-muted/30">
          <div className="container mx-auto px-4 py-20 md:py-32">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm">
                <span className="flex h-2 w-2 rounded-full bg-accent" />
                <span className="text-muted-foreground">PropTech para inmobiliarias modernas</span>
              </div>
              
              <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Converti tus carteles inmobiliarios en{' '}
                <span className="text-primary">generadores de clientes</span>
              </h1>
              
              <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
                Medi cuantas personas ven tus propiedades, generan interes y te contactan en tiempo real. 
                Transforma la carteleria tradicional en datos accionables.
              </p>
              
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" className="h-12 px-8 text-base" asChild>
                  <Link href="/create-property">
                    Publicar mi propiedad
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
                  <Link href="/properties">Ver propiedades</Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Background decoration */}
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
          </div>
        </section>

        {/* Problem Section */}
        <section className="border-b border-border py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-2xl font-bold md:text-3xl">
                El problema de la carteleria tradicional
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Hoy la carteleria inmobiliaria no tiene metricas. No sabes cuantas personas ven tu cartel, 
                quien esta interesado, ni como optimizar tu inversion en marketing. Estas trabajando a ciegas.
              </p>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="border-b border-border bg-muted/30 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-2xl font-bold md:text-3xl">La solucion casaData</h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Conectamos el mundo fisico con el digital para darte visibilidad total
              </p>
            </div>
            
            <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: QrCode,
                  title: 'QR en cada cartel',
                  description: 'Codigo unico para cada propiedad'
                },
                {
                  icon: Smartphone,
                  title: 'Ficha digital',
                  description: 'Informacion completa al instante'
                },
                {
                  icon: MessageCircle,
                  title: 'WhatsApp en 1 click',
                  description: 'Contacto directo sin fricciones'
                },
                {
                  icon: BarChart3,
                  title: 'Metricas reales',
                  description: 'Datos de interes en tiempo real'
                }
              ].map((item) => (
                <Card key={item.title} className="border-border bg-card">
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-2 font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="border-b border-border py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-2xl font-bold md:text-3xl">Beneficios clave</h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Todo lo que necesitas para potenciar tu marketing inmobiliario
              </p>
            </div>
            
            <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
              {[
                {
                  icon: Target,
                  title: 'Genera mas consultas',
                  description: 'Convierte mas visitas en leads calificados con CTAs optimizados'
                },
                {
                  icon: Share2,
                  title: 'Comparte facilmente',
                  description: 'Links directos para compartir en redes y WhatsApp'
                },
                {
                  icon: TrendingUp,
                  title: 'Medi el rendimiento',
                  description: 'Dashboard con metricas de cada publicacion'
                }
              ].map((item) => (
                <div key={item.title} className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
                    <item.icon className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Demo Visual Section */}
        <section className="border-b border-border bg-muted/30 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-2xl font-bold md:text-3xl">Resultados en tiempo real</h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Asi se ve tu dashboard con metricas reales de tus propiedades
              </p>
            </div>
            
            <div className="mx-auto max-w-4xl">
              <Card className="overflow-hidden border-border shadow-xl">
                <CardContent className="p-0">
                  <div className="border-b border-border bg-card p-4">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-400" />
                      <div className="h-3 w-3 rounded-full bg-yellow-400" />
                      <div className="h-3 w-3 rounded-full bg-green-400" />
                      <span className="ml-4 text-sm text-muted-foreground">dashboard.casadata.com</span>
                    </div>
                  </div>
                  <div className="bg-card p-6 md:p-8">
                    <div className="mb-6 flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Casa moderna en Carrasco</h3>
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                        Alta demanda
                      </span>
                    </div>
                    <div className="grid gap-4 md:grid-cols-4">
                      {[
                        { label: 'Visitas', value: '120', icon: Eye },
                        { label: 'Contactos', value: '18', icon: Users },
                        { label: 'Guardados', value: '25', icon: Zap },
                        { label: 'Conversion', value: '15%', icon: TrendingUp }
                      ].map((stat) => (
                        <div key={stat.label} className="rounded-xl bg-muted/50 p-4">
                          <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                            <stat.icon className="h-4 w-4" />
                            <span className="text-sm">{stat.label}</span>
                          </div>
                          <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                Empieza a generar leads hoy
              </h2>
              <p className="mb-10 text-lg text-muted-foreground">
                Crea tu primera propiedad gratis y descubri el poder de la carteleria inteligente
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" className="h-12 px-8 text-base" asChild>
                  <Link href="/register">
                    Empezar gratis
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="ghost" className="h-12 px-8 text-base" asChild>
                  <Link href="/properties">Explorar propiedades</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
