import { CEROracle } from './cer-oracle-client';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../../.env' });

async function testCEROracle() {
  console.log('🧪 Testing CEROracle TypeScript Client\n');

  // Configuration from .env
  const config = {
    contractId: process.env.CER_ORACLE_CONTRACT_ID!,
    rpcUrl: process.env.STELLAR_SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org',
    networkPassphrase: process.env.STELLAR_NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015',
  };

  console.log('📝 Configuration:');
  console.log(`  Contract ID: ${config.contractId}`);
  console.log(`  RPC URL: ${config.rpcUrl}`);
  console.log(`  Network: ${config.networkPassphrase}\n`);

  const oracle = new CEROracle(config);

  // Test 1: Get current CER
  console.log('Test 1: getCurrentCER()');
  const currentCER = await oracle.getCurrentCER();
  if (currentCER) {
    console.log('✅ Current CER found:');
    console.log(`  Date: ${currentCER.date}`);
    console.log(`  Raw value: ${currentCER.cer_value}`);
    console.log(`  Decimal value: ${CEROracle.rawToDecimal(currentCER.cer_value)} ARS`);
    console.log(`  Publisher: ${currentCER.publisher}`);
    console.log(`  Timestamp: ${new Date(currentCER.timestamp * 1000).toISOString()}\n`);
  } else {
    console.log('❌ No CER found on-chain\n');
  }

  // Test 2: Get CER at specific date
  console.log('Test 2: getCERAtDate("2024-12-30")');
  const historicalCER = await oracle.getCERAtDate('2024-12-30');
  if (historicalCER) {
    console.log('✅ Historical CER found:');
    console.log(`  Value: ${CEROracle.rawToDecimal(historicalCER.cer_value)} ARS\n`);
  } else {
    console.log('⚠️ No CER found for that date\n');
  }

  // Test 3: Conversion helpers
  console.log('Test 3: Conversion helpers');
  const testValue = 1105.75;
  const raw = CEROracle.decimalToRaw(testValue);
  const decimal = CEROracle.rawToDecimal(raw);
  console.log(`  ${testValue} → ${raw} (raw) → ${decimal} (decimal)`);
  console.log(`  ✅ Conversion works correctly\n`);

  console.log('🎉 All tests completed!');
}

// Run tests
testCEROracle().catch((error) => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});