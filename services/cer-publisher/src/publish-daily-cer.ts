import { 
  Keypair, 
  Contract, 
  TransactionBuilder,
  Account,
  Networks,
  xdr,
  nativeToScVal,
} from '@stellar/stellar-sdk';
import * as SorobanClient from '@stellar/stellar-sdk/rpc';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

// Configure Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const rpcUrl = process.env.STELLAR_SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org';
const server = new SorobanClient.Server(rpcUrl);
const CER_ORACLE_CONTRACT_ID = process.env.CER_ORACLE_CONTRACT_ID!;

// Authorized signer keypairs
const bcraKeypair = Keypair.fromSecret(process.env.BCRA_SECRET_KEY!);
const ansesKeypair = Keypair.fromSecret(process.env.ANSES_SECRET_KEY!);

/**
 * Gets current CER from BCRA API
 * 
 * Official endpoint: https://api.bcra.gob.ar/estadisticas/v1.0/principalesvariables
 * Variable 31 = CER
 */
async function getCERFromBCRA(): Promise<number> {
  try {
    console.log('📡 Querying CER from BCRA...');
    
    const response = await axios.get(
      'https://api.bcra.gob.ar/estadisticas/v1.0/principalesvariables'
    );
    
    const cerVariable = response.data.results.find(
      (v: any) => v.idVariable === 31
    );
    
    if (!cerVariable) {
      throw new Error('Variable CER (31) not found in BCRA response');
    }
    
    const cerValue = parseFloat(cerVariable.valor);
    
    console.log(`✅ CER obtained: ${cerValue}`);
    console.log(`   Date: ${cerVariable.fecha}`);
    
    return cerValue;
  } catch (error) {
    console.error('❌ Error obtaining CER from BCRA:', error);
    throw error;
  }
}

/**
 * Creates multi-signature attestation (BCRA + ANSES)
 * 
 * Hash = SHA256(date + cer_value)
 * Signatures = [BCRA_sig, ANSES_sig]
 */
async function createMultisigAttestation(
  date: string,
  cerValue: number
): Promise<string> {
  const crypto = require('crypto');
  
  // Create payload hash
  const payload = `${date}:${cerValue}`;
  const hash = crypto.createHash('sha256').update(payload).digest('hex');
  
  // Signature 1: BCRA
  const bcraSignature = bcraKeypair.sign(Buffer.from(hash, 'hex')).toString('hex');
  
  // Signature 2: ANSES
  const ansesSignature = ansesKeypair.sign(Buffer.from(hash, 'hex')).toString('hex');
  
  // Combine signatures
  const attestation = `${hash}:${bcraSignature}:${ansesSignature}`;
  
  console.log('🔐 Multi-signature attestation created');
  console.log(`   Hash: ${hash}`);
  console.log(`   Signers: BCRA + ANSES`);
  
  return attestation;
}

/**
 * Publishes CER on blockchain (CEROracle contract)
 */
async function publishCEROnChain(
  date: string,
  cerValue: number,
  attestation: string
): Promise<string> {
  console.log(`📝 Publishing CER on-chain...`);
  console.log(`   Date: ${date}`);
  console.log(`   CER: ${cerValue}`);
  
  const contract = new Contract(CER_ORACLE_CONTRACT_ID);
  
  // Convert CER to blockchain format (6 decimals)
  // Example: 1050.23 → 1050230000
  const cerBlockchain = Math.round(cerValue * 1_000_000);
  
  const operation = contract.call(
    'publish_cer',
    nativeToScVal(date, { type: 'string' }),
    nativeToScVal(cerBlockchain, { type: 'i128' }),
    nativeToScVal(attestation, { type: 'string' })
  );
  
  // Build and sign transaction
  const sourceAccount = await server.getAccount(ansesKeypair.publicKey());
  
  const transaction = new TransactionBuilder(sourceAccount, {
    fee: '100',
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(operation)
    .setTimeout(30)
    .build();
  
  transaction.sign(ansesKeypair);
  
  // Simulate and send
  const simulated = await server.simulateTransaction(transaction);
  
  if (SorobanClient.Api.isSimulationError(simulated)) {
    throw new Error(`Simulation failed: ${simulated.error}`);
  }
  
  const preparedTx = SorobanClient.assembleTransaction(
    transaction,
    simulated
  ).build();
  
  preparedTx.sign(ansesKeypair);
  
  const result = await server.sendTransaction(preparedTx);
  
  // Wait for confirmation
  let status = await server.getTransaction(result.hash);
  while (status.status === 'NOT_FOUND') {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    status = await server.getTransaction(result.hash);
  }
  
  if (status.status !== 'SUCCESS') {
    throw new Error(`Transaction failed: ${status.status}`);
  }
  
  console.log('✅ CER published successfully on-chain');
  console.log(`   TX Hash: ${result.hash}`);
  
  return result.hash;
}

/**
 * Sends alert email to technical team
 */
async function sendAlertEmail(params: { subject: string; body: string }) {
  // TODO: Implement email notification
  console.error(`📧 ALERT EMAIL: ${params.subject}`);
  console.error(params.body);
}

/**
 * Complete daily CER publication process
 * Run via cron: every day at 11:00 AM
 */
export async function publishDailyCER() {
  try {
    const today = new Date().toISOString().split('T')[0]; // "2025-01-15"
    
    console.log(`\n🚀 DAILY CER PUBLICATION - ${today}\n`);
    
    // STEP 1: Check if CER already exists for today
    const { data: existing } = await supabase
      .from('cer_publications')
      .select('*')
      .eq('date', today)
      .single();
    
    if (existing) {
      console.log('⚠️  CER already published for today, aborting');
      return;
    }
    
    // STEP 2: Get CER from BCRA
    const cerValue = await getCERFromBCRA();
    
    // STEP 3: Create multi-signature attestation
    const attestation = await createMultisigAttestation(today, cerValue);
    
    // STEP 4: Publish on-chain
    const txHash = await publishCEROnChain(today, cerValue, attestation);
    
    // STEP 5: Save to database for caching
    const { error } = await supabase.from('cer_publications').insert({
      date: today,
      cer_value: cerValue,
      tx_hash: txHash,
      attestation,
      published_at: new Date().toISOString(),
    });
    
    if (error) {
      console.error('⚠️ Warning: Could not save to database:', error);
    }
    
    console.log('\n✅ PUBLICATION COMPLETE');
    console.log(`   CER ${cerValue} registered immutably on blockchain`);
    console.log(`   Anyone can verify at: https://stellar.expert/explorer/testnet/tx/${txHash}`);
    
  } catch (error) {
    console.error('\n❌ ERROR IN CER PUBLICATION:', error);
    
    // Notify technical team
    await sendAlertEmail({
      subject: 'ERROR: CER publication failed',
      body: `Error publishing CER: ${(error as Error).message}`,
    });
    
    throw error;
  }
}

// Execute (normally via cron, here manual for testing)
if (require.main === module) {
  publishDailyCER().catch(console.error);
}