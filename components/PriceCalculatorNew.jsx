'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TrendingUp, Zap, Star, User } from 'lucide-react'
import { getActiveBoosters } from '@/app/actions/boosters'
import { createOrder } from '@/app/actions/orders'
import { useToast } from '@/hooks/use-toast'

const eloTiers = [
  { value: 'ferro4', label: 'Ferro IV', solo: 4.25, duo: 5.95 },
  { value: 'ferro3', label: 'Ferro III', solo: 4.46, duo: 6.25 },
  { value: 'ferro2', label: 'Ferro II', solo: 4.68, duo: 6.56 },
  { value: 'ferro1', label: 'Ferro I', solo: 4.92, duo: 6.89 },
  { value: 'bronze4', label: 'Bronze IV', solo: 5.10, duo: 6.80 },
  { value: 'bronze3', label: 'Bronze III', solo: 5.36, duo: 7.14 },
  { value: 'bronze2', label: 'Bronze II', solo: 5.63, duo: 7.50 },
  { value: 'bronze1', label: 'Bronze I', solo: 5.91, duo: 7.87 },
  { value: 'prata4', label: 'Prata IV', solo: 5.95, duo: 7.65 },
  { value: 'prata3', label: 'Prata III', solo: 6.25, duo: 8.03 },
  { value: 'prata2', label: 'Prata II', solo: 6.56, duo: 8.43 },
  { value: 'prata1', label: 'Prata I', solo: 6.89, duo: 8.86 },
  { value: 'ouro4', label: 'Ouro IV', solo: 11.05, duo: 15.30 },
  { value: 'ouro3', label: 'Ouro III', solo: 11.60, duo: 16.07 },
  { value: 'ouro2', label: 'Ouro II', solo: 12.18, duo: 16.87 },
  { value: 'ouro1', label: 'Ouro I', solo: 12.79, duo: 17.71 },
  { value: 'platina4', label: 'Platina IV', solo: 17.00, duo: 23.80 },
  { value: 'platina3', label: 'Platina III', solo: 17.85, duo: 24.99 },
  { value: 'platina2', label: 'Platina II', solo: 18.74, duo: 26.24 },
  { value: 'platina1', label: 'Platina I', solo: 19.68, duo: 27.55 },
  { value: 'esmeralda4', label: 'Esmeralda IV', solo: 23.80, duo: 33.15 },
  { value: 'esmeralda3', label: 'Esmeralda III', solo: 24.99, duo: 34.81 },
  { value: 'esmeralda2', label: 'Esmeralda II', solo: 26.24, duo: 36.54 },
  { value: 'esmeralda1', label: 'Esmeralda I', solo: 27.55, duo: 38.37 },
  { value: 'diamante4', label: 'Diamante IV', solo: 29.75, duo: 41.65 },
  { value: 'diamante3', label: 'Diamante III', solo: 31.24, duo: 43.73 },
  { value: 'diamante2', label: 'Diamante II', solo: 32.80, duo: 45.92 },
  { value: 'diamante1', label: 'Diamante I', solo: 34.44, duo: 48.21 },
]

export default function PriceCalculatorNew() {
  const [currentElo, setCurrentElo] = useState('')
  const [desiredElo, setDesiredElo] = useState('')
  const [serviceType, setServiceType] = useState('solo')
  const [selectedBooster, setSelectedBooster] = useState(null)
  const [boosters, setBoosters] = useState([])
  const [clientName, setClientName] = useState('')
  const [clientContact, setClientContact] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    loadBoosters()
  }, [])

  const loadBoosters = async () => {
    const result = await getActiveBoosters()
    if (result.success) {
      setBoosters(result.data)
    }
  }

  const calculateBasePrice = () => {
    if (!currentElo || !desiredElo) return 0
    
    const currentIndex = eloTiers.findIndex(e => e.value === currentElo)
    const desiredIndex = eloTiers.findIndex(e => e.value === desiredElo)
    
    if (currentIndex === -1 || desiredIndex === -1 || desiredIndex <= currentIndex) return 0
    
    let totalPrice = 0
    for (let i = currentIndex; i < desiredIndex; i++) {
      totalPrice += serviceType === 'duo' ? eloTiers[i].duo : eloTiers[i].solo
    }
    
    return totalPrice
  }

  const calculateFinalPrice = () => {
    const basePrice = calculateBasePrice()
    if (!selectedBooster) return basePrice
    
    const modifier = parseFloat(selectedBooster.price_modifier || 1)
    return basePrice * modifier
  }

  const price = calculateFinalPrice()

  const handleSubmit = async () => {
    if (!clientName.trim()) {
      toast({
        title: 'Erro',
        description: 'Por favor, informe seu nome',
        variant: 'destructive',
      })
      return
    }

    if (!selectedBooster) {
      toast({
        title: 'Erro',
        description: 'Por favor, selecione um booster',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    const orderData = {
      clientName: clientName.trim(),
      clientContact: clientContact.trim() || null,
      currentRank: eloTiers.find(e => e.value === currentElo)?.label,
      desiredRank: eloTiers.find(e => e.value === desiredElo)?.label,
      serviceType,
      price: price.toFixed(2),
      boosterId: selectedBooster.id,
      boosterName: selectedBooster.name,
    }

    const result = await createOrder(orderData)

    if (result.success) {
      toast({
        title: 'Pedido criado!',
        description: 'Redirecionando para o chat...',
      })
      
      // Redirecionar para o chat do pedido
      setTimeout(() => {
        router.push(`/order/${result.data.id}`)
      }, 1000)
    } else {
      toast({
        title: 'Erro',
        description: result.error,
        variant: 'destructive',
      })
    }

    setLoading(false)
  }

  return (
    <Card className="glass-card border-primary-500/20">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-orange-500" />
          Calculadora de Preço
        </CardTitle>
        <CardDescription>
          Calcule o preço do seu boost e escolha seu booster
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Informações do Cliente */}
        <div className="space-y-4 p-4 bg-primary-500/5 border border-primary-500/20 rounded-lg">
          <h3 className="font-semibold flex items-center gap-2">
            <User className="h-4 w-4" />
            Suas Informações
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Seu Nome *</Label>
              <Input
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Como deseja ser chamado?"
                className="bg-white/50 dark:bg-black/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientContact">Contato (Opcional)</Label>
              <Input
                id="clientContact"
                value={clientContact}
                onChange={(e) => setClientContact(e.target.value)}
                placeholder="WhatsApp, Discord, etc"
                className="bg-white/50 dark:bg-black/50"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Elo Atual</label>
          <Select value={currentElo} onValueChange={setCurrentElo}>
            <SelectTrigger className="bg-white/50 dark:bg-black/50">
              <SelectValue placeholder="Selecione seu elo atual" />
            </SelectTrigger>
            <SelectContent>
              {eloTiers.map((elo) => (
                <SelectItem key={elo.value} value={elo.value}>
                  {elo.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Elo Desejado</label>
          <Select value={desiredElo} onValueChange={setDesiredElo}>
            <SelectTrigger className="bg-white/50 dark:bg-black/50">
              <SelectValue placeholder="Selecione seu elo desejado" />
            </SelectTrigger>
            <SelectContent>
              {eloTiers.map((elo) => (
                <SelectItem key={elo.value} value={elo.value}>
                  {elo.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tipo de Serviço</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setServiceType('solo')}
              className={`p-4 rounded-lg border-2 transition-all ${
                serviceType === 'solo'
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <Zap className="h-6 w-6 mx-auto mb-2 text-primary-500" />
              <p className="font-bold">Solo Boost</p>
              <p className="text-xs text-muted-foreground">Preço padrão</p>
            </button>
            <button
              onClick={() => setServiceType('duo')}
              className={`p-4 rounded-lg border-2 transition-all ${
                serviceType === 'duo'
                  ? 'border-orange-500 bg-orange-500/10'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-orange-500" />
              <p className="font-bold">Duo Boost</p>
              <p className="text-xs text-muted-foreground">+30% no preço</p>
            </button>
          </div>
        </div>

        {/* Seleção de Booster */}
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center gap-2">
            <Star className="h-4 w-4 text-orange-500" />
            Escolha seu Booster
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
            {boosters.map((booster) => (
              <button
                key={booster.id}
                onClick={() => setSelectedBooster(booster)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  selectedBooster?.id === booster.id
                    ? 'border-orange-500 bg-orange-500/10'
                    : 'border-gray-200 dark:border-gray-700 hover:border-orange-500/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="font-bold">{booster.name}</p>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: booster.rating }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-orange-500 text-orange-500" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{booster.rank}</p>
                {booster.price_modifier !== 1 && (
                  <Badge variant="outline" className="mt-2 text-xs">
                    {booster.price_modifier > 1 ? '+' : ''}{((booster.price_modifier - 1) * 100).toFixed(0)}% no preço
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div>

        {price > 0 && selectedBooster && (
          <div className="bg-gradient-to-r from-primary-500/10 to-orange-500/10 border border-primary-500/20 rounded-lg p-6 text-center animate-slide-in">
            <p className="text-sm text-muted-foreground mb-2">Preço Total</p>
            <p className="text-4xl font-bold gamer-gradient bg-clip-text text-transparent">
              R$ {price.toFixed(2)}
            </p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <Badge variant="outline">
                {serviceType === 'duo' ? 'Duo Boost' : 'Solo Boost'}
              </Badge>
              <Badge variant="outline">
                Booster: {selectedBooster.name}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              ✅ Entrega em até 7 dias | 🎁 +R$100 = Coach grátis
            </p>
          </div>
        )}

        <Button
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold"
          disabled={price === 0 || !selectedBooster || !clientName.trim() || loading}
          onClick={handleSubmit}
        >
          {loading ? 'Processando...' : 'Solicitar Boost'}
        </Button>
      </CardContent>
    </Card>
  )
}
