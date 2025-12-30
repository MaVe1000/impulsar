"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@crossmint/client-sdk-react-ui"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownLeft, TrendingUp, Wallet, LogOut, Zap } from "lucide-react"
import Image from "next/image"
import { BalanceDisplay } from "@/components/BalanceDisplay"

interface WalletData {
  aruBalance: number
  arsBalance: number
  dailyYield: number
  totalEarned: number
  lastUpdate: string
}

export function DashboardContent() {
  const router = useRouter()
  const { logout } = useAuth()
  const [user, setUser] = useState<any>(null)
  const [walletData, setWalletData] = useState<WalletData>({
    aruBalance: 15420.5,
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
    const userObj = JSON.parse(userData)
    setUser(userObj)

    // Load wallet data for THIS specific user
    const walletsStr = localStorage.getItem("impulsAR_wallets")
    if (walletsStr) {
      const allWallets = JSON.parse(walletsStr)
      const userWallet = allWallets[userObj.email]

      if (userWallet) {
        setWalletData(userWallet)
        console.log("📂 Loaded wallet for user:", userObj.email, userWallet)
      } else {
        console.log("⚠️ No wallet found for user:", userObj.email)
      }
    } else {
      // Fallback to old single-wallet format for backwards compatibility
      const savedWallet = localStorage.getItem("impulsAR_wallet")
      if (savedWallet) {
        setWalletData(JSON.parse(savedWallet))
      }
    }

    // Simulate daily yield increase
    const interval = setInterval(() => {
      setWalletData((prev) => {
        const yieldAmount = (prev.aruBalance * (prev.dailyYield / 100)) / 86400 // per second
        const newData = {
          ...prev,
          aruBalance: prev.aruBalance + yieldAmount,
          totalEarned: prev.totalEarned + yieldAmount,
          lastUpdate: new Date().toISOString(),
        }

        // Update both single wallet and multi-user wallet storage
        localStorage.setItem("impulsAR_wallet", JSON.stringify(newData))

        const walletsStr = localStorage.getItem("impulsAR_wallets")
        if (walletsStr) {
          const allWallets = JSON.parse(walletsStr)
          allWallets[userObj.email] = newData
          localStorage.setItem("impulsAR_wallets", JSON.stringify(allWallets))
        }

        return newData
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [router])

  const handleLogout = async () => {
    try {
      console.log("🚪 Logging out user:", user?.email)

      // Logout from Crossmint
      await logout()

      // ONLY clear current session data
      // DO NOT delete impulsAR_wallets - this preserves all users' wallets
      localStorage.removeItem("impulsAR_user")
      localStorage.removeItem("impulsAR_wallet")

      console.log("✅ Session cleared, wallet data preserved for future logins")

      // Redirect to login
      router.push("/")
    } catch (error) {
      console.error("❌ Error during logout:", error)
      // Even if Crossmint logout fails, clear session data and redirect
      localStorage.removeItem("impulsAR_user")
      localStorage.removeItem("impulsAR_wallet")
      router.push("/")
    }
  }

  const formatARU = (amount: number) => {
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
  <div className="min-h-screen bg-slate-100 flex justify-center pb-16">
    <div className="w-full max-w-[600px]">
      
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/images/iconoLogo.png"
              alt="ImpulsAR"
              width={36}
              height={36}
              className="object-contain"
            />
            <div>
              <h1 className="text-base font-semibold text-blue-900">
                ImpulsAR
              </h1>
              <p className="text-xs text-slate-500 truncate max-w-[200px]">
                {user.email}
              </p>
            </div>
          </div>

          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="w-4 h-4 text-slate-500" />
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-6 space-y-6">
        
        {/* Balance */}
        <BalanceDisplay showCERDetails={false} />

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            className="h-20 flex flex-col gap-1 bg-blue-700 hover:bg-blue-800"
            onClick={() => router.push("/convert")}
          >
            <ArrowUpRight className="w-5 h-5" />
            <span className="text-sm font-medium">Convertir</span>
            <span className="text-xs opacity-80">ARU a ARS</span>
          </Button>

          <Button
            variant="outline"
            className="h-20 flex flex-col gap-1 border-blue-700 text-blue-700 hover:bg-blue-50"
            onClick={() => router.push("/transfer")}
          >
            <ArrowDownLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Retirar</span>
            <span className="text-xs opacity-80">A tu cuenta</span>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Rendimiento total</CardDescription>
              <CardTitle className="text-xl text-blue-800">
                +{formatARU(walletData.totalEarned)} ARU
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500">ARU acumulados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Saldo en pesos</CardDescription>
              <CardTitle className="text-xl">
                {formatARS(walletData.arsBalance)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500">Disponible para retirar</p>
            </CardContent>
          </Card>
        </div>

        {/* Government Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Wallet className="w-5 h-5 text-blue-700" />
              Beneficios del Gobierno
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="flex justify-between items-center rounded-md border p-3">
              <div>
                <p className="text-sm font-medium">
                  Asignación Universal por Hijo
                </p>
                <p className="text-xs text-slate-500">
                  Acreditado el 15/12/2024
                </p>
              </div>
              <span className="text-sm font-semibold text-blue-700">
                +8.500 ARU
              </span>
            </div>

            <div className="flex justify-between items-center rounded-md border p-3">
              <div>
                <p className="text-sm font-medium">
                  Programa ImpulsAR Comunitario
                </p>
                <p className="text-xs text-slate-500">
                  Acreditado el 10/12/2024
                </p>
              </div>
              <span className="text-sm font-semibold text-blue-700">
                +5.000 ARU
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Info */}
        <div className="rounded-md bg-blue-50 border border-blue-200 p-4 flex gap-3">
          <Zap className="w-5 h-5 text-blue-700 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">
              ¿Qué es ARU?
            </p>
            <p className="text-sm text-blue-800/80">
              ARU es la criptomoneda del programa ImpulsAR indexada al CER.
              Genera rendimientos diarios y puede convertirse a pesos
              argentinos en cualquier momento.
            </p>
          </div>
        </div>

      </main>
    </div>
  </div>
)
}