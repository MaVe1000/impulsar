#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, contracterror, symbol_short, vec,
    Address, Env, String, Symbol
};

const ADMIN: Symbol = symbol_short!("admin");
const LATEST_CER: Symbol = symbol_short!("cer");
const ATTESTATION_MGR: Symbol = symbol_short!("att_mgr");  // ← NUEVO

#[derive(Clone)]
#[contracttype]
pub struct CERSnapshot {
    pub date: String,
    pub cer_value: i128,
    pub publisher: Address,
    pub timestamp: u64,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    PublisherNotAttested = 1,
    AlreadyInitialized = 2,
}

#[contract]
pub struct CEROracle;

#[contractimpl]
impl CEROracle {
    /// Inicializa el contrato con admin y AttestationManager contract
    pub fn initialize(
        env: Env,
        admin: Address,
        attestation_manager: Address,  // ← NUEVO
    ) -> Result<(), Error> {
        if env.storage().instance().has(&ADMIN) {
            return Err(Error::AlreadyInitialized);
        }

        env.storage().instance().set(&ADMIN, &admin);
        env.storage().instance().set(&ATTESTATION_MGR, &attestation_manager);
        Ok(())
    }

    /// Publica un nuevo valor de CER (CON MULTI-SIG VALIDATION)
    pub fn publish_cer(
        env: Env,
        date: String,
        cer_value: i128,
        publisher: Address,
    ) -> Result<CERSnapshot, Error> {
        publisher.require_auth();

        // Verificar attestation del publisher
        let attestation_mgr: Address = env
            .storage()
            .instance()
            .get(&ATTESTATION_MGR)
            .unwrap();

        // Call attestation manager contract (max 9 chars for symbol)
        use soroban_sdk::IntoVal;
        let is_attested: bool = env.invoke_contract(
            &attestation_mgr,
            &symbol_short!("is_attest"),
            vec![&env, publisher.clone().into_val(&env)],
        );

        if !is_attested {
            return Err(Error::PublisherNotAttested);
        }

        // Resto de la lógica (igual que antes)
        let snapshot = CERSnapshot {
            date: date.clone(),
            cer_value,
            publisher,
            timestamp: env.ledger().timestamp(),
        };

        env.storage()
            .persistent()
            .set(&(symbol_short!("cer"), date.clone()), &snapshot);

        env.storage().instance().set(&LATEST_CER, &snapshot);

        Ok(snapshot)
    }

    /// Obtiene el CER más reciente
    pub fn get_current_cer(env: Env) -> Option<CERSnapshot> {
        env.storage().instance().get(&LATEST_CER)
    }

    /// Obtiene el CER de una fecha específica
    pub fn get_cer_at_date(env: Env, date: String) -> Option<CERSnapshot> {
        env.storage()
            .persistent()
            .get(&(symbol_short!("cer"), date))
    }
}

mod test;