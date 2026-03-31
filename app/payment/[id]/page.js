'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Copy, Check, CreditCard, ArrowLeft } from 'lucide-react'
import { getOrderById, uploadPaymentProof } from '@/app/actions/orders'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import Image from 'next/image'

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [proofUrl, setProofUrl] = useState('')

  const PIX_KEY = 'wellingtom2014.2016@gmail.com'
  const PIX_CODE = '00020126510014br.gov.bcb.pix0129wellingtom2014.2016@gmail.com5204000053039865802BR5924LIMAWELLINGTON20231009176009Sao Paulo610901227-20062240520daqr10907561874248636304E0DE'
  const QR_CODE_URL = 'https://customer-assets.emergentagent.com/job_league-boost-hub/artifacts/qkofc938_image.png'

  useEffect(() => {
    loadOrder()
  }, [params.id])

  const loadOrder = async () => {
    const result = await getOrderById(params.id)
    if (result.success) {
      setOrder(result.data)
    }
    setLoading(false)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast({ title: 'Copiado!' })
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmitProof = async () => {
    const result = await uploadPaymentProof(params.id, proofUrl)
    if (result.success) {
      toast({ title: 'Comprovante enviado!' })
      router.push('/client-dashboard')
    }
  }

  if (loading) return <div className="container py-20">Carregando...</div>
  if (!order) return null

  return (
    <div className="container py-20">
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/client-dashboard">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Link>
      </Button>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Detalhes do Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{order.current_rank} → {order.desired_rank}</p>
            <p className="text-3xl font-bold text-primary-500 mt-4">
              R$ {parseFloat(order.final_price || order.price).toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-green-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-green-500" />
              Pagamento PIX
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white p-4 rounded-lg">
              <Image src={QR_CODE_URL} alt="QR Code PIX" width={300} height={300} className="mx-auto" />
            </div>

            <div className="space-y-2">
              <Label>Chave PIX</Label>
              <div className="flex gap-2">
                <Input value={PIX_KEY} readOnly className="font-mono" />
                <Button onClick={() => copyToClipboard(PIX_KEY)} variant="outline">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Código Copia e Cola</Label>
              <div className="flex gap-2">
                <Input value={PIX_CODE} readOnly className="font-mono text-xs" />
                <Button onClick={() => copyToClipboard(PIX_CODE)} variant="outline">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2 border-t pt-4">
              <Label>Link do Comprovante (Opcional)</Label>
              <Input
                placeholder="Cole o link do print"
                value={proofUrl}
                onChange={(e) => setProofUrl(e.target.value)}
              />
            </div>

            <Button onClick={handleSubmitProof} className="w-full bg-green-500 hover:bg-green-600">
              Confirmar Pagamento
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
