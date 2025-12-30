#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, String, Symbol};

const ADMIN: Symbol = symbol_short!("admin");
const LATEST_CER: Symbol = symbol_short!("cer");

#[derive(Clone)]
#[contracttype]
pub struct CERSnapshot {
    pub date: String,
    pub cer_value: i128,  // 6 decimales: 1050230000 = 1050.23 pesos
    pub publisher: Address,
    pub timestamp: u64,
}

#[contract]
pub struct CEROracle;

#[contractimpl]
impl CEROracle {
    /// Inicializa el contrato con un admin
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&ADMIN) {
            panic!("Ya inicializado");
        }
        env.storage().instance().set(&ADMIN, &admin);
    }

    /// Publica un nuevo valor de CER
    /// @param date - Fecha en formato "YYYY-MM-DD"
    /// @param cer_value - Valor CER con 6 decimales (ej: 1050230000 = 1050.23)
    pub fn publish_cer(
        env: Env,
        date: String,
        cer_value: i128,
        publisher: Address,
    ) -> CERSnapshot {
        publisher.require_auth();

        let snapshot = CERSnapshot {
            date: date.clone(),
            cer_value,
            publisher,
            timestamp: env.ledger().timestamp(),
        };

        // Guardar en persistent storage
        env.storage()
            .persistent()
            .set(&(symbol_short!("cer"), date.clone()), &snapshot);

        // Actualizar "latest CER"
        env.storage()
            .instance()
            .set(&LATEST_CER, &snapshot);

        snapshot
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
