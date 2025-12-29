// apps/backend/src/routes/wallet.ts
import { Router } from 'express';
import { Horizon } from '@stellar/stellar-sdk'; // Or @impulsar/stellar-sdk if wrapper exists

const router = Router();

const STELLAR_NETWORK = process.env.STELLAR_NETWORK || 'testnet';
const HORIZON_URL = STELLAR_NETWORK === 'testnet'
  ? 'https://horizon-testnet.stellar.org'
  : 'https://horizon.stellar.org';

const server = new Horizon.Server(HORIZON_URL);

/**
 * POST /api/wallet/balance
 *
 * Gets ARU units balance from Stellar blockchain
 *
 * Body:
 *   - publicKey: string (Stellar public key)
 *   - assetCode: string (default: 'ARU')
 *
 * Response:
 *   - balance: string (ARU units, e.g.: "133.31")
 *   - assetCode: string
 *   - publicKey: string
 */
router.post('/balance', async (req, res) => {
  try {
    const { publicKey, assetCode = 'ARU' } = req.body;

    if (!publicKey) {
      return res.status(400).json({
        error: 'publicKey required'
      });
    }

    // Load account from Stellar
    const account = await server.loadAccount(publicKey);

    // Find ARU asset balance
    const aruBalance = account.balances.find((balance) => {
      if (balance.asset_type === 'credit_alphanum4' ||
          balance.asset_type === 'credit_alphanum12') {
        return balance.asset_code === assetCode;
      }
      return false;
    });

    if (!aruBalance) {
      // If no ARU, return 0
      return res.json({
        balance: '0',
        assetCode,
        publicKey,
      });
    }

    // Return balance in ARU UNITS (not pesos)
    // Type guard to ensure we're accessing asset_code safely
    const responseAssetCode = 
      (aruBalance.asset_type === 'credit_alphanum4' || 
       aruBalance.asset_type === 'credit_alphanum12')
        ? aruBalance.asset_code 
        : assetCode;

    return res.json({
      balance: aruBalance.balance,
      assetCode: responseAssetCode,
      publicKey,
    });

  } catch (error: any) {
    console.error('Error getting balance:', error);

    // If account doesn't exist on Stellar, return balance 0
    if (error?.response?.status === 404) {
      return res.json({
        balance: '0',
        assetCode: 'ARU',
        publicKey: req.body.publicKey,
      });
    }

    return res.status(500).json({
      error: 'Error getting balance',
      details: error.message
    });
  }
});

export default router;