'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UserPlus, Mail } from 'lucide-react'
import { registerClient, verifyEmail, resendVerificationCode } from '@/app/actions/clients'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

export default function ClientRegisterPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    howFoundUs: '',
    referralCode: '',
  })
  const [verificationCode, setVerificationCode] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmitRegistration = async (e) => {
    e.preventDefault()
    
    if (formData.password.length < 6) {
      toast({
        title: 'Senha fraca',
        description: 'A senha deve ter pelo menos 6 caracteres',
        variant: 'destructive',
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Senhas não conferem',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    const result = await registerClient({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      password: formData.password,
      howFoundUs: formData.howFoundUs,
      referralCode: formData.referralCode,
    })

    if (result.success) {
      toast({
        title: 'Conta criada!',
        description: result.message,
      })
      setStep(2)
      
      if (result.verificationCode) {
        toast({
          title: 'Código (DEV)',
          description: `Seu código: ${result.verificationCode}`,
        })
      }
    } else {
      toast({
        title: 'Erro',
        description: result.error,
        variant: 'destructive',
      })
    }

    setLoading(false)
  }

  const handleSubmitVerification = async (e) => {
    e.preventDefault()
    setLoading(true)

    const result = await verifyEmail(formData.email, verificationCode)

    if (result.success) {
      toast({
        title: 'Email verificado!',
      })
      router.push('/client-login')
    } else {
      toast({
        title: 'Erro',
        description: result.error,
        variant: 'destructive',
      })
    }

    setLoading(false)
  }

  if (step === 2) {
    return (
      <div className="container py-20">
        <div className="max-w-md mx-auto">
          <Card className="glass-card border-primary-500/20">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary-500/20 flex items-center justify-center">
                <Mail className="h-8 w-8 text-primary-500" />
              </div>
              <CardTitle>Verifique seu Email</CardTitle>
              <CardDescription>
                Código enviado para {formData.email}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitVerification} className="space-y-4">
                <div>
                  <Label>Código de 4 dígitos</Label>
                  <Input
                    type="text"
                    maxLength={4}
                    placeholder="1234"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    className="text-center text-2xl"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading || verificationCode.length !== 4}>
                  Verificar
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-20">
      <div className="max-w-2xl mx-auto">
        <Card className="glass-card">
          <CardHeader className="text-center">
            <UserPlus className="h-12 w-12 mx-auto mb-4" />
            <CardTitle>Criar Conta</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitRegistration} className="space-y-4">
              <Input name="name" placeholder="Nome" value={formData.name} onChange={handleInputChange} required />
              <Input name="phone" placeholder="Telefone" value={formData.phone} onChange={handleInputChange} required />
              <Input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required />
              <Input name="password" type="password" placeholder="Senha" value={formData.password} onChange={handleInputChange} required />
              <Input name="confirmPassword" type="password" placeholder="Confirmar Senha" value={formData.confirmPassword} onChange={handleInputChange} required />
              
              <Select value={formData.howFoundUs} onValueChange={(value) => setFormData(prev => ({ ...prev, howFoundUs: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Como conheceu o site?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="anuncios">Anúncios</SelectItem>
                  <SelectItem value="convite">Convite (10% desconto)</SelectItem>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="discord">Discord</SelectItem>
                </SelectContent>
              </Select>

              <Button type="submit" className="w-full" disabled={loading}>
                Criar Conta
              </Button>

              <div className="text-center">
                <Link href="/client-login" className="text-sm text-primary-500">
                  Já tem conta? Fazer login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
