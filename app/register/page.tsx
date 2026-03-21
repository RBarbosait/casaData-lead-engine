'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Home, Mail, Lock, User, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name || !email || !password) {
      toast.error('Por favor completa todos los campos')
      return
    }
    
    if (password.length < 6) {
      toast.error('La contrasena debe tener al menos 6 caracteres')
      return
    }
    
    setIsLoading(true)
    
    try {
      const success = await register(email, password, name)
      
      if (success) {
        toast.success('Cuenta creada exitosamente')
        router.push('/dashboard')
      } else {
        toast.error('Error al crear la cuenta')
      }
    } catch {
      toast.error('Error al registrarse')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Home className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-2xl font-bold tracking-tight">casaData</span>
      </Link>
      
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Crear cuenta</CardTitle>
          <CardDescription>
            Registrate para empezar a publicar tus propiedades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Nombre</FieldLabel>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Tu nombre"
                    className="pl-10"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </Field>
              
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </Field>
              
              <Field>
                <FieldLabel htmlFor="password">Contrasena</FieldLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Minimo 6 caracteres"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </Field>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando cuenta...
                  </>
                ) : (
                  'Crear cuenta'
                )}
              </Button>
            </FieldGroup>
          </form>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Ya tenes cuenta?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Inicia sesion
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
