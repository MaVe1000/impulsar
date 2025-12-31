"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Building2, Banknote, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export function TransferContent() {
  const router = useRouter();
  const [transferAmount, setTransferAmount] = useState("");
  const [cbu, setCbu] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [walletData, setWalletData] = useState({ arsBalance: 0 });
  const [activeTab, setActiveTab] = useState("bank");

  useEffect(() => {
    const userData = localStorage.getItem("impulsAR_user");
    if (!userData) {
      router.push("/");
      return;
    }

    const savedWallet = localStorage.getItem("impulsAR_wallet");
    if (savedWallet) {
      setWalletData(JSON.parse(savedWallet));
    }
  }, [router]);

  const handleTransfer = async () => {
    const amount = Number.parseFloat(transferAmount) || 0;

    if (amount <= 0 || amount > walletData.arsBalance) return;
    if (activeTab === "bank" && !cbu) return;

    setIsTransferring(true);

    setTimeout(() => {
      const savedWallet = localStorage.getItem("impulsAR_wallet");
      if (savedWallet) {
        const wallet = JSON.parse(savedWallet);
        wallet.arsBalance -= amount;
        localStorage.setItem("impulsAR_wallet", JSON.stringify(wallet));
        setWalletData(wallet);
      }

      setIsTransferring(false);
      setShowSuccess(true);

      setTimeout(() => {
        router.push("/dashboard");
      }, 2500);
    }, 1500);
  };

  const formatARS = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-green-500/20 bg-green-500/5">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold">¡Transferencia Exitosa!</h2>
              <p className="text-muted-foreground mt-2">
                {activeTab === "bank"
                  ? `Transferiste ${formatARS(
                      Number.parseFloat(transferAmount)
                    )} a tu cuenta bancaria`
                  : `Retiro de ${formatARS(
                      Number.parseFloat(transferAmount)
                    )} en Pago Fácil autorizado`}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {activeTab === "pagofacil" &&
                  "Presentá tu DNI en cualquier sucursal de Pago Fácil"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center pb-20">
      <div className="w-full max-w-[600px]">
        {/* Header */}

        <header className="sticky top-0 z-10 bg-white border-b">
          <div className="max-w-[600px] mx-auto px-4 py-3">
            <div className="flex items-center gap-3">
              {/* Back */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/dashboard")}
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </Button>

              {/* Brand */}
              <div className="flex items-center gap-2">
                <Image
                  src="/images/iconoLogo.png"
                  alt="ImpulsAR"
                  width={32}
                  height={32}
                  className="object-contain"
                />
                <span className="text-base font-semibold text-blue-900">
                  ImpulsAR
                </span>
              </div>
            </div>
          </div>
        </header>
        {/* Content */}
        <main className="px-4 py-4 space-y-6">
          {/* Page title */}
          <div className="text-center mt-4">
            <h2 className="text-xl font-semibold text-blue-900">
              Retirar Dinero
            </h2>
          </div>

          {/* Balance Card */}
          <Card className="border-border/40">
            <CardHeader>
              <CardDescription>Saldo Disponible</CardDescription>
              <CardTitle className="text-3xl">
                {formatARS(walletData.arsBalance)}
              </CardTitle>
            </CardHeader>
          </Card>

          {/* Transfer Options */}
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle>Método de Retiro</CardTitle>
              <CardDescription>
                Elegí cómo querés recibir tu dinero
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="bank" className="gap-2">
                    <Building2 className="w-4 h-4 text-blue-900" />
                    Transferencia
                  </TabsTrigger>
                  <TabsTrigger value="pagofacil" className="gap-2">
                    <Banknote className="w-4 h-4 text-blue-900" />
                    Pago Fácil
                  </TabsTrigger>
                </TabsList>

                {/* Bank Transfer */}
                <TabsContent value="bank" className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Monto a Transferir</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      className="text-lg h-12"
                      step="0.01"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cbu">CBU / CVU / Alias</Label>
                    <Input
                      id="cbu"
                      placeholder="Ingresá tu CBU, CVU o Alias"
                      value={cbu}
                      onChange={(e) => setCbu(e.target.value)}
                      className="h-12"
                    />
                  </div>

                  <Button
                    className="w-full h-12 text-base"
                    size="lg"
                    onClick={handleTransfer}
                    disabled={
                      isTransferring ||
                      !transferAmount ||
                      !cbu ||
                      Number.parseFloat(transferAmount) <= 0 ||
                      Number.parseFloat(transferAmount) > walletData.arsBalance
                    }
                  >
                    {isTransferring ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Transfiriendo...
                      </span>
                    ) : (
                      "Transferir Ahora"
                    )}
                  </Button>

                  <Card className="border-border/20 bg-muted/30">
                    <CardContent className="pt-4">
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• La transferencia es inmediata</li>
                        <li>• Sin costos adicionales</li>
                        <li>• Disponible 24/7</li>
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Pago Fácil */}
                <TabsContent value="pagofacil" className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="amount-pf">Monto a Retirar</Label>
                    <Input
                      id="amount-pf"
                      type="number"
                      placeholder="0.00"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      className="text-lg h-12"
                      step="0.01"
                    />
                  </div>

                  <Button
                    className="w-full h-12 text-base"
                    size="lg"
                    onClick={handleTransfer}
                    disabled={
                      isTransferring ||
                      !transferAmount ||
                      Number.parseFloat(transferAmount) <= 0 ||
                      Number.parseFloat(transferAmount) > walletData.arsBalance
                    }
                  >
                    {isTransferring ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Generando código...
                      </span>
                    ) : (
                      "Generar Código de Retiro"
                    )}
                  </Button>

                  <Card className="border-border/20 bg-muted/30">
                    <CardContent className="pt-4 space-y-3">
                      <p className="font-medium text-sm">¿Cómo funciona?</p>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>1. Generá tu código de retiro</li>
                        <li>2. Acercate a cualquier sucursal de Pago Fácil</li>
                        <li>3. Presentá tu DNI y el código</li>
                        <li>4. Retirá tu dinero en efectivo</li>
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {Number.parseFloat(transferAmount) > walletData.arsBalance && (
                <p className="text-sm text-destructive text-center mt-4">
                  Saldo insuficiente
                </p>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
