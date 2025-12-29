import {
  Keypair,
  Asset,
  Operation,
  TransactionBuilder,
  Networks,
  Horizon,
  Memo,
} from '@stellar/stellar-sdk';
import { createClient } from '@supabase/supabase-js';

// STEP 0: Configure Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// STEP 1: Configure connection to Stellar Testnet
const server = new Horizon.Server('https://horizon-testnet.stellar.org');
const networkPassphrase = Networks.TESTNET;

// STEP 2: Load keypairs (GOVERNMENT must keep these keys secure)
const issuerKeypair = Keypair.fromSecret(
  process.env.STELLAR_ISSUER_SECRET_KEY!
);

const distributionKeypair = Keypair.fromSecret(
  process.env.STELLAR_DISTRIBUTION_SECRET_KEY!
);

// STEP 3: Create ARU asset
// CRITICAL: ARU represents CER UNITS, not nominal pesos
const ARU = new Asset('ARU', issuerKeypair.publicKey());

console.log('🏦 ARU Asset created');
console.log('   Code: ARU');
console.log('   Semantics: 1 ARU = 1 CER Unit (indexed)');
console.log('   Issuer:', issuerKeypair.publicKey());

// STEP 4: Configure asset flags (AUTH_REQUIRED + CLAWBACK)
async function configureAruAsset() {
  console.log('\n🔧 Configuring asset flags...');

  const account = await server.loadAccount(issuerKeypair.publicKey());

  const transaction = new TransactionBuilder(account, {
    fee: '100',
    networkPassphrase,
  })
    .addOperation(
      Operation.setOptions({
        setFlags: 1, // AUTH_REQUIRED: Only authorized accounts
      })
    )
    .addOperation(
      Operation.setOptions({
        setFlags: 8, // CLAWBACK_ENABLED: Recovery in case of fraud
      })
    )
    // Explanatory memo of semantics
    .addMemo(Memo.text('ARU=CER_units'))
    .setTimeout(30)
    .build();

  transaction.sign(issuerKeypair);

  try {
    const result = await server.submitTransaction(transaction);
    console.log('✅ Asset configured successfully');
    console.log('   TX Hash:', result.hash);
    console.log('   Flags: AUTH_REQUIRED ✅ | CLAWBACK_ENABLED ✅');
  } catch (error) {
    console.error('❌ Error configuring asset:', error);
    throw error;
  }
}

// STEP 5: Issue initial ARU supply (INDEXED BY CER)
async function issueInitialSupply(
  totalPesos: number,    // Amount in pesos to back
  currentCER: number     // CER at time of issuance
) {
  console.log(`\n💰 Issuing ARU based on:`);
  console.log(`   Total in pesos: $${totalPesos.toLocaleString()}`);
  console.log(`   Current CER: ${currentCER}`);
  
  // CRITICAL CALCULATION: ARU Units = Pesos / CER
  const aruUnits = totalPesos / currentCER;
  
  console.log(`   ARU units to issue: ${aruUnits.toLocaleString()}`);
  console.log(`   Verification: ${aruUnits} ARU × ${currentCER} = $${(aruUnits * currentCER).toLocaleString()}`);

  // Distribution account establishes trustline
  const distAccount = await server.loadAccount(
    distributionKeypair.publicKey()
  );

  const trustlineTransaction = new TransactionBuilder(distAccount, {
    fee: '100',
    networkPassphrase,
  })
    .addOperation(
      Operation.changeTrust({
        asset: ARU,
        source: distributionKeypair.publicKey(),
      })
    )
    .setTimeout(30)
    .build();

  trustlineTransaction.sign(distributionKeypair);
  await server.submitTransaction(trustlineTransaction);

  console.log('✅ Trustline established for Distribution Account');

  // Issuer AUTHORIZES distribution account
  const issuerAccount = await server.loadAccount(issuerKeypair.publicKey());

  const authorizeTransaction = new TransactionBuilder(issuerAccount, {
    fee: '100',
    networkPassphrase,
  })
    .addOperation(
      Operation.setTrustLineFlags({
        trustor: distributionKeypair.publicKey(),
        asset: ARU,
        flags: {
          authorized: true,
        },
      })
    )
    .setTimeout(30)
    .build();

  authorizeTransaction.sign(issuerKeypair);
  await server.submitTransaction(authorizeTransaction);

  console.log('✅ Distribution Account authorized');

  // Issuer ISSUES ARU (CER units, NOT pesos)
  const issuerAccount2 = await server.loadAccount(issuerKeypair.publicKey());

  const paymentTransaction = new TransactionBuilder(issuerAccount2, {
    fee: '100',
    networkPassphrase,
  })
    .addOperation(
      Operation.payment({
        destination: distributionKeypair.publicKey(),
        asset: ARU,
        amount: aruUnits.toString(), // CER units
      })
    )
    // IMPORTANT: Memo documents CER at issuance
    .addMemo(Memo.text(`CER=${currentCER}`))
    .setTimeout(30)
    .build();

  paymentTransaction.sign(issuerKeypair);

  const result = await server.submitTransaction(paymentTransaction);

  console.log('✅ ARU issued successfully');
  console.log(`   ARU units: ${aruUnits.toLocaleString()}`);
  console.log(`   CER at issuance: ${currentCER}`);
  console.log(`   Equivalent in pesos: $${totalPesos.toLocaleString()}`);
  console.log('   Recipient: Distribution Account');
  console.log('   TX Hash:', result.hash);
  
  // Save metadata in database for audit trail
  const { error } = await supabase.from('aru_emissions').insert({
    tx_hash: result.hash,
    aru_units: aruUnits,
    cer_at_emission: currentCER,
    pesos_equivalent: totalPesos,
    emission_date: new Date().toISOString(),
  });

  if (error) {
    console.error('⚠️  Warning: Could not save to database:', error);
  } else {
    console.log('✅ Emission data saved to database');
  }
}

// RUN SETUP
async function main() {
  console.log('🚀 STARTING ARU ASSET SETUP (CER-INDEXED)\n');

  await configureAruAsset();
  
  // Example: Issue $1B pesos when CER = 1050.23
  await issueInitialSupply(
    1_000_000_000,  // $1 billion pesos
    1050.23         // Current CER (query BCRA)
  );

  console.log('\n✅ SETUP COMPLETE');
  console.log('\n📊 SUMMARY:');
  console.log('   Asset: ARU (CER-indexed units)');
  console.log('   Issuer:', issuerKeypair.publicKey());
  console.log('   Distribution:', distributionKeypair.publicKey());
  console.log('   Supply: 952,400 ARU (≈ $1B pesos @ CER 1050.23)');
  console.log('   Flags: AUTH_REQUIRED + CLAWBACK_ENABLED');
  console.log('\n🔗 View on Stellar Explorer:');
  console.log(
    `   https://stellar.expert/explorer/testnet/asset/ARU-${issuerKeypair.publicKey()}`
  );
}

main().catch(console.error);