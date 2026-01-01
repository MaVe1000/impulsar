#!/bin/bash

# Script para fondear una wallet de Stellar testnet con XLM y simular ARU

WALLET_ADDRESS="$1"

if [ -z "$WALLET_ADDRESS" ]; then
  echo "❌ Error: Debes proporcionar la dirección de la wallet"
  echo "Uso: ./fund-wallet.sh GXXXXX..."
  exit 1
fi

echo "🚀 Fondeando wallet: $WALLET_ADDRESS"
echo ""

# 1. Fondear con XLM usando Friendbot
echo "📡 Solicitando 10,000 XLM de Friendbot..."
curl -X POST "https://friendbot.stellar.org?addr=$WALLET_ADDRESS"
echo ""
echo ""

# 2. Verificar balance
echo "✅ Verificando balance..."
sleep 2
curl -s "https://horizon-testnet.stellar.org/accounts/$WALLET_ADDRESS" | grep -o '"balance":"[^"]*"' | head -5

echo ""
echo "✅ Wallet fondeada exitosamente!"
echo ""
echo "📋 Próximos pasos:"
echo "   1. La wallet ahora tiene ~10,000 XLM"
echo "   2. El frontend mostrará este XLM como ARU (placeholder)"
echo "   3. El CER del blockchain (676.27) se multiplicará por el balance XLM"
