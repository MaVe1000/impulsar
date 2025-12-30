import { Router } from 'express';
import { CrossmintWallets, createCrossmint } from '@crossmint/wallets-sdk';

const router = Router();

// Initialize Crossmint SDK
function getCrossmintClient() {
  if (!process.env.CROSSMINT_API_KEY) {
    throw new Error('CROSSMINT_API_KEY is not set');
  }

  const crossmint = createCrossmint({
    apiKey: process.env.CROSSMINT_API_KEY,
  });

  return CrossmintWallets.from(crossmint);
}

// POST /api/crossmint/wallet/create-or-get
// Create or get Stellar wallet for user
router.post('/wallet/create-or-get', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: 'email is required'
      });
    }

    console.log('🔧 Creating or getting Stellar wallet for:', email);

    const crossmintWallets = getCrossmintClient();

    // Create or get wallet for user on Stellar testnet
    const wallet = await crossmintWallets.getOrCreateWallet({
      chain: 'stellar-testnet',
      signer: { type: 'email', email },
    });

    console.log('✅ Stellar wallet created/retrieved:', {
      address: wallet.address,
      chain: wallet.chain,
    });

    return res.json({
      address: wallet.address,
      chain: wallet.chain,
      type: wallet.type,
    });

  } catch (error: any) {
    console.error('❌ Error creating Stellar wallet:', error);

    return res.status(500).json({
      error: 'Error creating Stellar wallet',
      details: error.message
    });
  }
});

// POST /api/crossmint/wallet/balance
// Get wallet balance using Crossmint SDK
router.post('/wallet/balance', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: 'email is required'
      });
    }

    console.log('📊 Getting balance for:', email);

    const crossmintWallets = getCrossmintClient();

    // Get wallet
    const wallet = await crossmintWallets.getOrCreateWallet({
      chain: 'stellar-testnet',
      signer: { type: 'email', email },
    });

    // Get balances using Crossmint SDK
    const balances = await wallet.balances();

    console.log('✅ Balance retrieved:', {
      address: wallet.address,
      nativeToken: balances.nativeToken?.amount || '0',
    });

    return res.json({
      address: wallet.address,
      chain: wallet.chain,
      nativeToken: {
        amount: balances.nativeToken?.amount || '0',
        rawAmount: balances.nativeToken?.rawAmount || '0',
      },
      // Include custom tokens if any
      customTokens: balances.customTokens || [],
    });

  } catch (error: any) {
    console.error('❌ Error getting balance:', error);

    return res.status(500).json({
      error: 'Error getting balance',
      details: error.message
    });
  }
});

export default router;
