'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@crossmint/client-sdk-react-ui';
import { useCER } from '@/hooks/useCER';
import { TrendingUp } from 'lucide-react';

interface BalanceDisplayProps {
  showCERDetails?: boolean;
}

export function BalanceDisplay({ showCERDetails = false }: BalanceDisplayProps) {
  const { wallet } = useWallet();

  // CER hook (blockchain/cache/mock + metadata)
  const { cer, loading: cerLoading, source, lastUpdate } = useCER();

  const [aruUnits, setAruUnits] = useState<number>(0);
  const [currentCER, setCurrentCER] = useState<number>(0);
  const [pesoValue, setPesoValue] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet]);

  // When CER updates (from hook), recompute values
  useEffect(() => {
    const cerValue = cer ?? 0;
    setCurrentCER(cerValue);
    setPesoValue(aruUnits * cerValue);

    // If CER hook is still loading, overall loading should reflect that
    setLoading((prev) => {
      // keep spinner if balance still loading OR CER still loading
      // prev is "balance loading" state; we merge with cerLoading outside
      return prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cer, aruUnits]);

  async function loadBalance() {
    try {
      setLoading(true);

      if (!wallet?.address) {
        console.log('⏳ Esperando wallet...');
        return;
      }

      // PASO 1: Obtener balance desde Crossmint Smart Wallet
      console.log('🔍 Consultando balance para Smart Wallet:', wallet.address);
      console.log('🔍 Chain:', wallet.chain);

      const balances = (await wallet.balances()) as any;
      console.log('📊 Balances from Crossmint:', balances);

      // DEMO: Valor en pesos hardcodeado (simulación de beneficios recibidos)
      const DEMO_PESOS = 100_000;

      // PASO 2: CER hardcodeado con el valor on-chain
      const cerValue = 676.2663;
      setCurrentCER(cerValue);

      // PASO 3: Calcular ARU basado en pesos y CER del blockchain
      // Formula: ARU = Pesos / CER
      const calculatedARU = cerValue > 0 ? DEMO_PESOS / cerValue : 0;

      setAruUnits(calculatedARU);
      setPesoValue(DEMO_PESOS);

      console.log('💰 Balance calculado:');
      console.log(`   Wallet address: ${wallet?.address}`);
      console.log(`   Pesos (hardcoded): $${DEMO_PESOS.toLocaleString()}`);
      console.log(`   CER (blockchain): ${cerValue}`);
      console.log(`   ARU calculado: ${calculatedARU.toFixed(2)} ARU`);
    } catch (error) {
      console.error('❌ Error loading balance:', error);
      setAruUnits(0);
      setCurrentCER(0);
      setPesoValue(0);
    } finally {
      setLoading(false);
    }
  }

  const isLoading = loading || cerLoading;

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-md border border-slate-200/60 p-6 animate-pulse">
        <div className="h-10 bg-gradient-to-r from-slate-200 to-slate-100 rounded-lg w-48 mb-3"></div>
        <div className="h-6 bg-slate-100 rounded w-32 mb-4"></div>
        <div className="h-4 bg-slate-100 rounded w-40"></div>
      </div>
    );
  }

  const cerValue = currentCER || 1100.5;
  const calculatedPesos = aruUnits * cerValue;

  // Source badge
  const sourceBadge = source === 'blockchain'
    ? { icon: '🔗', text: 'Blockchain', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' }
    : source === 'cache'
    ? { icon: '💾', text: 'Cache', color: 'text-blue-600 bg-blue-50 border-blue-200' }
    : { icon: '⚠️', text: 'Mock', color: 'text-amber-600 bg-amber-50 border-amber-200' };

  {/* Style-only: Refined BalanceDisplay with design tokens */}
  return (
    <div className="relative bg-card rounded-2xl shadow-brand border border-border/60 p-6 hover:shadow-brand-hover transition-all overflow-hidden">
      {/* Style-only: Subtle glow overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent/5 pointer-events-none"></div>

      <div className="relative z-10">
        {/* Valor principal en Pesos */}
        <div className="mb-1">
          <div className="text-xs font-medium text-muted-foreground mb-1">Tu saldo total</div>
          <div className="text-4xl font-bold text-primary mb-1">
            ${calculatedPesos.toLocaleString('es-AR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <div className="text-sm text-foreground/70 font-medium">
            {aruUnits.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ARU
          </div>
        </div>

        {/* CER Badge - Style-only: Using design tokens */}
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 bg-gradient-to-r from-muted to-accent/10 border border-border/60 rounded-lg px-3 py-1.5">
            <TrendingUp className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-primary">
              CER: {cerValue.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
            </span>
          </div>
        </div>

        {/* Detalles técnicos - Style-only: Using design tokens */}
        {showCERDetails && (
          <div className="mt-4 pt-4 border-t border-border/60 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">CER actual</span>
              <span className="font-mono font-medium text-accent">
                {cerValue.toFixed(4)}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Cálculo</span>
              <span className="font-mono text-foreground/70">
                {aruUnits.toFixed(2)} × {cerValue.toFixed(2)}
              </span>
            </div>

            {lastUpdate && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Actualizado</span>
                <span className="font-mono text-foreground/70">
                  {lastUpdate.toLocaleDateString('es-AR')} {lastUpdate.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            )}

            <button
              onClick={() =>
                window.open(
                  `https://www.bcra.gob.ar/PublicacionesEstadisticas/Principales_variables_datos.asp`,
                  '_blank'
                )
              }
              className="mt-2 text-xs text-accent hover:text-primary font-medium transition-colors inline-flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring/60 rounded"
            >
              Verificar CER en BCRA
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
