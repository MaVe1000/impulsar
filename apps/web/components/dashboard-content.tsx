"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownLeft, TrendingUp, Wallet, LogOut, Zap } from "lucide-react"
import Image from "next/image"
import { BalanceDisplay } from "@/components/BalanceDisplay"

interface WalletData {
  pulsBalance: number
  arsBalance: number
  dailyYield: number
  totalEarned: number
  lastUpdate: string
}

export function DashboardContent() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [walletData, setWalletData] = useState<WalletData>({
    pulsBalance: 15420.5,
    arsBalance: 0,
    dailyYield: 0.85,
    totalEarned: 1240.3,
    lastUpdate: new Date().toISOString(),
  })

  useEffect(() => {
    const userData = localStorage.getItem("impulsAR_user")
    if (!userData) {
      router.push("/")
      return
    }
    setUser(JSON.parse(userData))

    // Load wallet data
    const savedWallet = localStorage.getItem("impulsAR_wallet")
    if (savedWallet) {
      setWalletData(JSON.parse(savedWallet))
    }

    // Simulate daily yield increase
    const interval = setInterval(() => {
      setWalletData((prev) => {
        const yieldAmount = (prev.pulsBalance * (prev.dailyYield / 100)) / 86400 // per second
        const newData = {
          ...prev,
          pulsBalance: prev.pulsBalance + yieldAmount,
          totalEarned: prev.totalEarned + yieldAmount,
          lastUpdate: new Date().toISOString(),
        }
        localStorage.setItem("impulsAR_wallet", JSON.stringify(newData))
        return newData
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("impulsAR_user")
    router.push("/")
  }

  const formatPULS = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const formatARS = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount)
  }

  if (!user) return null

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <Image src="/images/img-20251227-120843-641.jpg" alt="ImpulsAR" fill className="object-contain" />
              </div>
              <div>
                <h1 className="font-bold text-lg">ImpulsAR</h1>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Harcoded Balance Card */}
      {/* <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">        
        <Card className="border-border/40 bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <CardDescription>Balance Total</CardDescription>
            <CardTitle className="text-4xl font-bold flex items-baseline gap-2">
              <Zap className="w-8 h-8 text-cyan-400" />
              {formatPULS(walletData.pulsBalance)}
              <span className="text-2xl font-normal text-muted-foreground">PULS</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-green-500 font-medium">+{walletData.dailyYield}% diario</span>
              <span className="text-muted-foreground">≈ {formatARS(walletData.pulsBalance * 850)}</span>
            </div>
          </CardContent>
        </Card> */}

        {/* Balance Card - REAL DATA */}
        <BalanceDisplay showCERDetails={false} />

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button size="lg" className="h-auto py-6 flex-col gap-2" onClick={() => router.push("/convert")}>
            <ArrowUpRight className="w-6 h-6" />
            <span>Convertir</span>
            <span className="text-xs opacity-80">PULS a ARS</span>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-auto py-6 flex-col gap-2 bg-transparent"
            onClick={() => router.push("/transfer")}
          >
            <ArrowDownLeft className="w-6 h-6" />
            <span>Retirar</span>
            <span className="text-xs opacity-80">A tu cuenta</span>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-border/40">
            <CardHeader className="pb-3">
              <CardDescription>Rendimiento Total</CardDescription>
              <CardTitle className="text-2xl">
                <span className="text-green-500">+{formatPULS(walletData.totalEarned)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">PULS acumulados</p>
            </CardContent>
          </Card>
          <Card className="border-border/40">
            <CardHeader className="pb-3">
              <CardDescription>Saldo en Pesos</CardDescription>
              <CardTitle className="text-2xl">{formatARS(walletData.arsBalance)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Listo para retirar</p>
            </CardContent>
          </Card>
        </div>

        {/* Government Benefits */}
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Beneficios del Gobierno
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium">Asignación Universal por Hijo</p>
                <p className="text-sm text-muted-foreground">Acreditado el 15/12/2024</p>
              </div>
              <p className="font-bold text-green-500">+8,500 PULS</p>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium">Programa ImpulsAR Comunitario</p>
                <p className="text-sm text-muted-foreground">Acreditado el 10/12/2024</p>
              </div>
              <p className="font-bold text-green-500">+5,000 PULS</p>
            </div>
          </CardContent>
        </Card>

        {/* Info Banner */}
        <Card className="border-cyan-500/20 bg-cyan-500/5">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Zap className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium text-sm">¿Qué es PULS?</p>
                <p className="text-sm text-muted-foreground">
                  PULS es la criptomoneda del programa ImpulsAR. Genera rendimientos diarios automáticamente y podés
                  convertirla a pesos argentinos en cualquier momento.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    //</div>
  )
}
