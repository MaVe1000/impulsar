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
import { ArrowLeft, ArrowDownUp, Zap, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export function ConvertContent() {
  const router = useRouter();
  const [pulsAmount, setPulsAmount] = useState("");
  const [arsAmount, setArsAmount] = useState("");
  const [exchangeRate] = useState(850); // 1 PULS = 850 ARS
  const [isConverting, setIsConverting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [walletData, setWalletData] = useState({
    pulsBalance: 0,
    arsBalance: 0,
  });

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

  const handlePulsChange = (value: string) => {
    setPulsAmount(value);
    const numValue = Number.parseFloat(value) || 0;
    setArsAmount((numValue * exchangeRate).toFixed(2));
  };

  const handleArsChange = (value: string) => {
    setArsAmount(value);
    const numValue = Number.parseFloat(value) || 0;
    setPulsAmount((numValue / exchangeRate).toFixed(2));
  };

  const handleConvert = async () => {
    const puls = Number.parseFloat(pulsAmount) || 0;
    const ars = Number.parseFloat(arsAmount) || 0;

    if (puls <= 0 || puls > walletData.pulsBalance) return;

    setIsConverting(true);

    setTimeout(() => {
      const savedWallet = localStorage.getItem("impulsAR_wallet");
      if (savedWallet) {
        const wallet = JSON.parse(savedWallet);
        wallet.pulsBalance -= puls;
        wallet.arsBalance += ars;
        localStorage.setItem("impulsAR_wallet", JSON.stringify(wallet));
        setWalletData(wallet);
      }

      setIsConverting(false);
      setShowSuccess(true);

      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    }, 1500);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
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
              <h2 className="text-2xl font-bold">¡Conversión Exitosa!</h2>
              <p className="text-muted-foreground mt-2">
                Convertiste {pulsAmount} ARU a ${arsAmount} ARS
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
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
      <div className="text-center mt-6 mb-2">
        <h2 className="text-xl font-semibold text-blue-900">Convertir ARU</h2>
      </div>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Balance Card */}
        <Card className="border-border/40">
          <CardHeader>
            <CardDescription>Balance Disponible</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Zap className="w-6 h-6 text-cyan-400" />
              {formatNumber(walletData.pulsBalance)} ARU
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Conversion Card */}
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Convertir a Pesos Argentinos</CardTitle>
            <CardDescription>
              Tipo de cambio: 1 ARU = ${exchangeRate} ARS
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* From Amount */}
            <div className="space-y-2">
              <Label htmlFor="puls">Desde (ARU)</Label>
              <div className="relative">
                <Input
                  id="puls"
                  type="number"
                  placeholder="0.00"
                  value={pulsAmount}
                  onChange={(e) => handlePulsChange(e.target.value)}
                  className="text-lg h-14 pr-20"
                  step="0.01"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span className="font-medium">ARU</span>
                </div>
              </div>
            </div>

            {/* Swap Icon */}
            <div className="flex justify-center">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <ArrowDownUp className="w-5 h-5" />
              </div>
            </div>

            {/* To Amount */}
            <div className="space-y-2">
              <Label htmlFor="ars">A (ARS)</Label>
              <div className="relative">
                <Input
                  id="ars"
                  type="number"
                  placeholder="0.00"
                  value={arsAmount}
                  onChange={(e) => handleArsChange(e.target.value)}
                  className="text-lg h-14 pr-16"
                  step="0.01"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <span className="font-medium">ARS</span>
                </div>
              </div>
            </div>

            {/* Convert Button */}
            <Button
              className="w-full h-12 text-base"
              size="lg"
              onClick={handleConvert}
              disabled={
                isConverting ||
                !pulsAmount ||
                Number.parseFloat(pulsAmount) <= 0 ||
                Number.parseFloat(pulsAmount) > walletData.pulsBalance
              }
            >
              {isConverting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Convirtiendo...
                </span>
              ) : (
                "Convertir Ahora"
              )}
            </Button>

            {Number.parseFloat(pulsAmount) > walletData.pulsBalance && (
              <p className="text-sm text-destructive text-center">
                Saldo insuficiente
              </p>
            )}
          </CardContent>
        </Card>

        {/* Info */}
        <Card className="border-cyan-500/20 bg-cyan-500/5">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Zap className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div className="space-y-2 text-sm">
                <p className="font-medium font-semibold text-blue-900">
                  Conversión instantánea
                </p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Sin comisiones ocultas</li>
                  <li>• Tipo de cambio actualizado</li>
                  <li>• Los pesos quedan disponibles para retirar</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
