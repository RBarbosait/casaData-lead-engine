import Link from 'next/link'
import { Home } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Home className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">casaData</span>
            </Link>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              Transformamos la cartelería inmobiliaria tradicional en canales digitales de generación de leads medibles y efectivos.
            </p>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-semibold">Producto</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/inmuebles" className="transition-colors hover:text-foreground">
                  Ver propiedades
                </Link>
              </li>
              <li>
                <Link href="/dashboard/publish" className="transition-colors hover:text-foreground">
                  Publicar propiedad
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="transition-colors hover:text-foreground">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-semibold">Legal</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="transition-colors hover:text-foreground">
                  Términos de uso
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-foreground">
                  Privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            {new Date().getFullYear()} casaData. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
