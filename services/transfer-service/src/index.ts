// CRITICAL: Load environment variables first (from .env file if present)
import { config as loadEnv } from 'dotenv';
import { resolve } from 'node:path';

// CRITICAL: All imports must be at the top in ESM/TypeScript
import express from 'express';
import cors from 'cors';
import { validateTransferEnv } from '@impulsar/config';
import walletRoutes from './routes/wallet.js';
import cerRoutes from './routes/cer.js';

const rootEnvPath = resolve(process.cwd(), '../../.env');
const localEnvPath = resolve(process.cwd(), '.env');

loadEnv({ path: rootEnvPath });
loadEnv({ path: localEnvPath, override: true });

// CRITICAL: Validate environment FIRST before any other setup
// Transfer service validates: SUPABASE_*, STELLAR_OPERATIONAL_SECRET_KEY, TRANSFER_SERVICE_PORT
// Does NOT require: JWT_SECRET (auth-service responsibility)
// Production-aligned principle: "Service secrets are required, not optional"
// Missing secrets = service fails to start (even in dev)
const env = validateTransferEnv(process.env);

const app = express();
const PORT = env.TRANSFER_SERVICE_PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    service: 'transfer-service',
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// ARU-related routes (wallet balance, CER)
app.use('/api/wallet', walletRoutes);
app.use('/api/cer', cerRoutes);

// Transfer domain routes
app.get('/api/transfers', (req, res) => {
  res.json({ message: 'List transfers endpoint - to be implemented' });
});

app.post('/api/transfers', (req, res) => {
  res.json({ message: 'Create transfer endpoint - to be implemented' });
});

app.get('/api/transfers/:id', (req, res) => {
  res.json({ message: `Get transfer ${req.params.id} - to be implemented` });
});

app.listen(PORT, () => {
  // NOTE: For production, replace console.log with structured logging (pino or winston)
  // This placeholder is acceptable for development/learning purposes
  console.log(`🚀 Transfer Service running on http://localhost:${PORT}`);
});
