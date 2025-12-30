"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { EmbeddedAuthForm, useAuth, useWallet } from "@crossmint/client-sdk-react-ui"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export function LoginPage() {
  const router = useRouter()
  const { status: authStatus, user } = useAuth()
  const { wallet, status: walletStatus } = useWallet()
  const isLoggedIn = authStatus === "logged-in"
  const isWalletReady = walletStatus === "loaded"

  useEffect(() => {
    if (!isLoggedIn) return

    const email = user?.email ?? "usuario@impulsar.app"
    const name = email.split("@")[0] || "Usuario ImpulsAR"

    // Save current user session (always update with current login)
    localStorage.setItem(
      "impulsAR_user",
      JSON.stringify({
        email,
        name,
        loginDate: new Date().toISOString(),
      }),
    )

    if (isWalletReady) {
      console.log("💾 Saving wallet to localStorage for user:", email);
      console.log("💾 Wallet address:", wallet?.address);

      // MULTI-USER WALLET STORAGE
      // Get existing wallets object (all users' wallets)
      const existingWalletsStr = localStorage.getItem("impulsAR_wallets")
      const existingWallets = existingWalletsStr ? JSON.parse(existingWalletsStr) : {}

      // Save this user's wallet data under their email
      existingWallets[email] = {
        aruBalance: 15420.5,
        arsBalance: 0,
        dailyYield: 0.85,
        totalEarned: 1240.3,
        lastUpdate: new Date().toISOString(),
        address: wallet?.address ?? "",
      }

      // Save back to localStorage
      localStorage.setItem("impulsAR_wallets", JSON.stringify(existingWallets))

      // Also save current user's wallet to impulsAR_wallet for backwards compatibility
      localStorage.setItem("impulsAR_wallet", JSON.stringify(existingWallets[email]))

      router.push("/dashboard")
    }
  }, [isLoggedIn, isWalletReady, router, user?.email, wallet?.address])

  const statusMessage =
    authStatus === "in-progress"
      ? "Iniciando sesión..."
      : isLoggedIn && walletStatus === "in-progress"
        ? "Creando tu billetera Crossmint..."
        : isLoggedIn && walletStatus !== "loaded"
          ? "Conectando tu billetera..."
          : walletStatus === "error"
            ? "No pudimos cargar tu billetera."
            : ""

  return (
    <div className="min-h-screen flex items-center justify-center pb-4">
      <Card className="w-full max-w-md border-border/40">
        <CardHeader className="space-y-6 text-center pb-8">
          <div className="flex justify-center mt-4">
            <div className="relative w-32 h-32 ">
              <Image
                src="/images/iconoLogo.png"
                alt="ImpulsAR Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-bold">ImpulsAR</CardTitle>
            <p className="text-sm text-secondary-foreground mt-2">Infraestructura Pública Digital</p>
          </div>
          <CardDescription className="text-base text-neutral-400">
            Accedé a tus beneficios del gobierno y gestioná tu billetera digital
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoggedIn ? (
            <div className="flex flex-col items-center justify-center gap-3 py-4 text-sm text-secondary-foreground">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span>{statusMessage || "Cargando tu sesión..."}</span>
            </div>
          ) : (
            <div className="rounded-lg border  border-border/20 bg-foreground/5  p-4">
              <EmbeddedAuthForm />
            </div>
          )}
          <p className="text-xs text-center text-muted-foreground mt-6">
            Al continuar, aceptás los términos y condiciones del programa ImpulsAR
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
