"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@crossmint/client-sdk-react-ui"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownLeft, Wallet, LogOut, Info } from "lucide-react"
import Image from "next/image"
import { BalanceDisplay } from "@/components/BalanceDisplay"

export function DashboardContent() {
  const router = useRouter()
  const { logout } = useAuth()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem("impulsAR_user")
    if (!userData) {
      router.push("/")
      return
    }
    const userObj = JSON.parse(userData)
    setUser(userObj)
  }, [router])

  const handleLogout = async () => {
    try {
      console.log("🚪 Logging out user:", user?.email)
      await logout()
      localStorage.removeItem("impulsAR_user")
      localStorage.removeItem("impulsAR_wallet")
      console.log("✅ Session cleared")
      router.push("/")
    } catch (error) {
      console.error("❌ Error during logout:", error)
      localStorage.removeItem("impulsAR_user")
      localStorage.removeItem("impulsAR_wallet")
      router.push("/")
    }
  }

  if (!user) return null

  {/* Style-only: Enhanced institutional dashboard layout */}
  return (
    <div className="min-h-screen bg-background flex justify-center pb-16">
      <div className="w-full max-w-[600px]">

        {/* Header - Style-only: Refined with brand gradient accent */}
        <header className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border/60 shadow-sm">
          <div className="px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Image
                  src="/images/iconoLogo.png"
                  alt="ImpulsAR"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-base font-semibold text-primary leading-tight">
                  ImpulsAR
                </h1>
                <p className="text-[11px] text-muted-foreground truncate max-w-[200px] leading-tight">
                  {user.email}
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleLogout}
              className="hover:bg-secondary"
            >
              <LogOut className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </Button>
          </div>
          {/* Style-only: Subtle brand gradient accent line */}
          <div className="h-0.5 gradient-brand opacity-60"></div>
        </header>

        {/* Content */}
        <main className="px-4 py-6 space-y-5">

          {/* Balance Principal */}
          <BalanceDisplay showCERDetails={true} />

          {/* Actions - Style-only: Single transfer button */}
          <Button
            className="w-full h-20 flex items-center justify-center gap-2 gradient-brand text-white border-0 shadow-brand hover:shadow-brand-hover"
            onClick={() => router.push("/transfer")}
          >
            <ArrowUpRight className="w-5 h-5" />
            <span className="text-base font-medium">Transferir a tu banco</span>
          </Button>

          {/* Beneficios Recibidos - Style-only: Using design tokens */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-primary text-base">
                <Wallet className="w-5 h-5 text-accent" />
                Beneficios Recibidos
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
              <div className="flex justify-between items-center rounded-lg bg-gradient-to-r from-muted to-accent/5 border border-border/40 p-3 hover:border-accent/30 transition-colors">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Asignación Universal por Hijo
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Acreditado el 15/12/2024
                  </p>
                </div>
                <span className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[var(--brand-medium)] to-[var(--brand-light)]">
                  +181,625197 ARU
                </span>
              </div>

              <div className="flex justify-between items-center rounded-lg bg-gradient-to-r from-muted to-accent/5 border border-border/40 p-3 hover:border-accent/30 transition-colors">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Programa ImpulsAR Comunitario
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Acreditado el 10/12/2024
                  </p>
                </div>
                <span className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[var(--brand-medium)] to-[var(--brand-light)]">
                  +5,000 ARU
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Info ARU - Style-only: Using design tokens */}
          <div className="rounded-lg bg-gradient-to-br from-accent/10 via-accent/5 to-muted border border-accent/20 p-4 flex gap-3 hover:border-accent/40 transition-all">
            <Info className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-primary mb-1">
                ¿Qué es ARU?
              </p>
              <p className="text-sm text-foreground/80 leading-relaxed">
                ARU es la unidad de cuenta digital del programa ImpulsAR, ajustada diariamente por el CER (base 02/02/2002 = 1).
                Esto significa que tu saldo se mantiene en valor real frente a la inflación y podés convertirlo a pesos argentinos en cualquier momento al valor CER del día.
              </p>
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}
