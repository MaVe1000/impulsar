#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, BytesN, Env, Symbol};

const ADMIN: Symbol = symbol_short!("admin");

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    Attestation(Address),
}

#[derive(Clone)]
#[contracttype]
pub struct Attestation {
    pub user: Address,
    pub identity_hash: BytesN<32>,
    pub timestamp: u64,
    pub issuer: Address,
}

#[contract]
pub struct AttestationManager;

#[contractimpl]
impl AttestationManager {
    /// Inicializa el contrato con un admin
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&ADMIN) {
            panic!("Ya inicializado");
        }
        env.storage().instance().set(&ADMIN, &admin);
    }

    /// Registra una attestation para un usuario
    pub fn attest(
        env: Env,
        user: Address,
        identity_hash: BytesN<32>,
        issuer: Address,
    ) -> Attestation {
        issuer.require_auth();

        let attestation = Attestation {
            user: user.clone(),
            identity_hash,
            timestamp: env.ledger().timestamp(),
            issuer,
        };

        env.storage()
            .persistent()
            .set(&DataKey::Attestation(user), &attestation);

        attestation
    }

    /// Verifica si un usuario tiene attestation válida
    /// Renamed to is_attest (max 9 chars for Soroban symbol)
    pub fn is_attest(env: Env, user: Address) -> bool {
        env.storage()
            .persistent()
            .has(&DataKey::Attestation(user))
    }

    /// Obtiene la attestation de un usuario
    pub fn get_attestation(env: Env, user: Address) -> Option<Attestation> {
        env.storage()
            .persistent()
            .get(&DataKey::Attestation(user))
    }

    /// Revoca una attestation (solo admin)
    pub fn revoke(env: Env, user: Address) {
        let admin: Address = env.storage().instance().get(&ADMIN).unwrap();
        admin.require_auth();

        env.storage()
            .persistent()
            .remove(&DataKey::Attestation(user));
    }
}

mod test;
