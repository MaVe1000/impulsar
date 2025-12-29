'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@crossmint/client-sdk-react-ui';

interface BalanceDisplayProps {
  showCERDetails?: boolean;
}

export function BalanceDisplay({ showCERDetails = false }: BalanceDisplayProps) {
  const { wallet } = useWallet();
  
  const [aruUnits, setAruUnits] = useState<number>(0);
  const [currentCER, setCurrentCER] = useState<number>(0);
  const [pesoValue, setPesoValue] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBalanceAndCER();
  }, [wallet]);

  async function loadBalanceAndCER() {
    try {
      setLoading(true);

      // PASO 0: Verificar que tenemos una wallet
      if (!wallet?.address) {
        console.log('⏳ Esperando wallet de Crossmint...');
        setAruUnits(0);
        setCurrentCER(0);
        setPesoValue(0);
        return;
      }

      // PASO 0.5: Validar que es una dirección Stellar válida
      const isStellarAddress = wallet.address.startsWith('G') && wallet.address.length === 56;

      console.log('🔍 Consultando balance para wallet:', wallet.address);
      console.log('🔍 Es dirección Stellar válida?', isStellarAddress);

      if (!isStellarAddress) {
        console.error('❌ ERROR: Wallet address NO es de Stellar');
        console.error('❌ Address recibida:', wallet.address);
        console.error('❌ Longitud:', wallet.address.length, '(debe ser 56)');
        console.error('❌ Primer carácter:', wallet.address[0], '(debe ser "G")');
        console.error('');
        console.error('🔧 SOLUCIÓN: Crossmint creó una wallet de otra blockchain (Ethereum/Solana)');
        console.error('🔧 Verificá que NEXT_PUBLIC_CHAIN=stellar-testnet en apps/web/.env.local');
        console.error('🔧 Verificá que apiKey de Crossmint esté configurado para Stellar');

        setAruUnits(0);
        setCurrentCER(0);
        setPesoValue(0);
        return;
      }

      // PASO 1: Obtener balance ARU desde blockchain (unidades)
      const balanceResponse = await fetch('/api/wallet/balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          publicKey: wallet?.address,
          assetCode: 'ARU',
        }),
      });

      if (!balanceResponse.ok) {
        throw new Error(`Balance API error: ${balanceResponse.status}`);
      }

      const balanceData = await balanceResponse.json();
      console.log('📊 Balance response:', balanceData);

      const aruUnitsFromChain = parseFloat(balanceData.balance || '0');

      setAruUnits(aruUnitsFromChain);

      // PASO 2: Obtener CER actual desde backend (cache)
      const cerResponse = await fetch('/api/cer/current');

      if (!cerResponse.ok) {
        throw new Error(`CER API error: ${cerResponse.status}`);
      }

      const cerData = await cerResponse.json();
      console.log('📈 CER response:', cerData);

      setCurrentCER(cerData.cer);

      // PASO 3: Calcular valor en pesos (LOCAL, sin costo)
      const calculatedPesos = aruUnitsFromChain * cerData.cer;

      setPesoValue(calculatedPesos);

      console.log('💰 Balance calculado:');
      console.log(`   Wallet address: ${wallet?.address}`);
      console.log(`   ARU units: ${aruUnitsFromChain}`);
      console.log(`   CER actual: ${cerData.cer}`);
      console.log(`   Valor en pesos: $${calculatedPesos.toLocaleString()}`);

    } catch (error) {
      console.error('❌ Error loading balance:', error);
      // Set default values on error
      setAruUnits(0);
      setCurrentCER(0);
      setPesoValue(0);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Valor principal: Pesos (lo que ve el usuario) */}
      <div className="text-3xl font-bold text-gray-900 mb-2">
        ${pesoValue.toLocaleString('es-AR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </div>
      
      <div className="text-sm text-gray-600">
        Tu saldo ARU
      </div>
      
      {/* Detalles técnicos (opcional, para usuarios avanzados) */}
      {showCERDetails && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Unidades ARU:</span>
            <span className="font-mono">{aruUnits.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>CER actual:</span>
            <span className="font-mono">{currentCER.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>Cálculo:</span>
            <span className="font-mono">
              {aruUnits.toFixed(2)} × {currentCER.toFixed(2)}
            </span>
          </div>
          
          <button
            onClick={() => window.open(`https://www.bcra.gob.ar/PublicacionesEstadisticas/Principales_variables_datos.asp`, '_blank')}
            className="mt-2 text-xs text-blue-600 hover:text-blue-800"
          >
            Verificar CER en BCRA →
          </button>
        </div>
      )}
      
      {/* Indicador de última actualización CER */}
      <div className="mt-4 flex items-center text-xs text-gray-400">
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
        <span>
          CER actualizado hoy {new Date().toLocaleDateString('es-AR')}
        </span>
      </div>
    </div>
  );
}