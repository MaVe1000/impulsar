import {
  Contract,
  Address,
  nativeToScVal,
  scValToNative,
  Keypair,
  TransactionBuilder,
  BASE_FEE,
} from '@stellar/stellar-sdk';
import { Server as SorobanServer, Api } from '@stellar/stellar-sdk/rpc';

/**
 * CERSnapshot structure (matches Rust contract)
 */
export interface CERSnapshot {
  date: string;
  cer_value: number; // Raw value with 6 decimals (e.g., 1100500000 = 1100.50)
  publisher: string; // Stellar address
  timestamp: number;
}

/**
 * CEROracle Client Configuration
 */
export interface CEROracleConfig {
  contractId: string;
  rpcUrl: string;
  networkPassphrase: string;
}

/**
 * TypeScript client for CEROracle Soroban contract
 * Connects to Stellar testnet and reads CER values
 */
export class CEROracle {
  private contract: Contract;
  private server: SorobanServer;
  private networkPassphrase: string;

  constructor(config: CEROracleConfig) {
    this.contract = new Contract(config.contractId);
    this.server = new SorobanServer(config.rpcUrl, {
      allowHttp: config.rpcUrl.startsWith('http://'),
    });
    this.networkPassphrase = config.networkPassphrase;
  }

  /**
   * Get current CER from blockchain
   * @returns CERSnapshot or null if not found
   */
  async getCurrentCER(): Promise<CERSnapshot | null> {
    try {
      console.log('📡 Fetching current CER from blockchain...');


        const readSource = process.env.SOROBAN_READ_SOURCE_ADDRESS;
        if (!readSource) throw new Error("Missing SOROBAN_READ_SOURCE_ADDRESS");
        const account = await this.server.getAccount(readSource);


      const transaction = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(
          this.contract.call('get_current_cer')
        )
        .setTimeout(30)
        .build();

      // Simulate transaction (read-only, no fees)
      const response = await this.server.simulateTransaction(transaction);

      if (Api.isSimulationSuccess(response) && response.result) {
        const resultValue = response.result.retval;

        // Parse Option<CERSnapshot>
        if (resultValue.switch().name === 'scvVoid') {
          console.log('⚠️ No CER found on-chain (None)');
          return null;
        }

        // Extract CERSnapshot from Some(...)
        const snapshot = scValToNative(resultValue);

        console.log('✅ CER fetched from blockchain:', snapshot);

        return {
          date: snapshot.date,
          cer_value: Number(snapshot.cer_value),
          publisher: snapshot.publisher,
          timestamp: Number(snapshot.timestamp),
        };
      } else {
        console.error('❌ Contract simulation failed:', response);
        return null;
      }
    } catch (error) {
      console.error('❌ Error fetching CER from blockchain:', error);
      return null;
    }
  }

  /**
   * Get CER for a specific date
   * @param date - Date in YYYY-MM-DD format
   * @returns CERSnapshot or null if not found
   */
  async getCERAtDate(date: string): Promise<CERSnapshot | null> {
    try {
      console.log(`📡 Fetching CER for date ${date} from blockchain...`);

      const readSource = process.env.SOROBAN_READ_SOURCE_ADDRESS;
      if (!readSource) throw new Error("Missing SOROBAN_READ_SOURCE_ADDRESS");
      const account = await this.server.getAccount(readSource);


      const transaction = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(
          this.contract.call(
            'get_cer_at_date',
            nativeToScVal(date, { type: 'string' })
          )
        )
        .setTimeout(30)
        .build();

      const response = await this.server.simulateTransaction(transaction);

      if (Api.isSimulationSuccess(response) && response.result) {
        const resultValue = response.result.retval;

        if (resultValue.switch().name === 'scvVoid') {
          console.log(`⚠️ No CER found for date ${date}`);
          return null;
        }

        const snapshot = scValToNative(resultValue);

        return {
          date: snapshot.date,
          cer_value: Number(snapshot.cer_value),
          publisher: snapshot.publisher,
          timestamp: Number(snapshot.timestamp),
        };
      } else {
        console.error('❌ Contract simulation failed');
        return null;
      }
    } catch (error) {
      console.error(`❌ Error fetching CER for date ${date}:`, error);
      return null;
    }
  }

  /**
   * Publish new CER value (requires authentication)
   * @param date - Date in YYYY-MM-DD format
   * @param cerValue - CER value with 6 decimals (e.g., 1100500000)
   * @param publisherKeypair - Keypair of attested publisher
   * @returns CERSnapshot on success
   */
  async publishCER(
    date: string,
    cerValue: number,
    publisherKeypair: Keypair
  ): Promise<CERSnapshot> {
    try {
      console.log(`📤 Publishing CER for ${date}: ${cerValue}`);

      const publisherAddress = publisherKeypair.publicKey();
      const account = await this.server.getAccount(publisherAddress);

      const transaction = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(
          this.contract.call(
            'publish_cer',
            nativeToScVal(date, { type: 'string' }),
            nativeToScVal(cerValue, { type: 'i128' }),
            new Address(publisherAddress).toScVal()
          )
        )
        .setTimeout(30)
        .build();

      // Prepare transaction
      const prepared = await this.server.prepareTransaction(transaction);
      prepared.sign(publisherKeypair);

      // Submit transaction
      const result = await this.server.sendTransaction(prepared);

      // Wait for confirmation
      let status = await this.server.getTransaction(result.hash);
      while (status.status === Api.GetTransactionStatus.NOT_FOUND) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        status = await this.server.getTransaction(result.hash);
      }

      if (status.status === Api.GetTransactionStatus.SUCCESS && 'returnValue' in status && status.returnValue) {
        const snapshot = scValToNative(status.returnValue);
        console.log('✅ CER published successfully:', snapshot);

        return {
          date: snapshot.date,
          cer_value: Number(snapshot.cer_value),
          publisher: snapshot.publisher,
          timestamp: Number(snapshot.timestamp),
        };
      } else {
        throw new Error(`Transaction failed: ${status.status}`);
      }
    } catch (error) {
      console.error('❌ Error publishing CER:', error);
      throw error;
    }
  }

  /**
   * Convert raw CER value to decimal (e.g., 1100500000 → 1100.50)
   */
  static rawToDecimal(rawValue: number): number {
    return rawValue / 1_000_000;
  }

  /**
   * Convert decimal CER to raw value (e.g., 1100.50 → 1100500000)
   */
  static decimalToRaw(decimal: number): number {
    return Math.round(decimal * 1_000_000);
  }
}