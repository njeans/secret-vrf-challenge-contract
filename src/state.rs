use cosmwasm_schema::cw_serde;
use secret_toolkit_storage::Item;
use cosmwasm_std::{Addr, Binary, Uint128, Env, StdResult, Storage, StdError, to_binary, from_binary};
use serde::{Deserialize, Serialize};

/// Basic configuration struct
pub static CONFIG_KEY2: Item<State> = Item::new(b"config");

pub static CONFIG_KEY: &str = "admin";
pub static ADMIN_KEY: &str = "admin";

// Requests
pub static PREFIX_REQUESTS_KEY: Item<Request> = Item::new(b"requests");
pub static PREFIX_RESPONSE_KEY: Item<ResponseState> = Item::new(b"responses");
pub static REQUEST_SEQNO_KEY: Item<Uint128> = Item::new(b"request_seqno");
pub static REQUEST_LEN_KEY: Item<Uint128> = Item::new(b"request_len");
pub static CHECKPOINT_KEY: Item<CheckPoint> = Item::new(b"checkpoint");
pub static AEAD_KEY: Item<SymmetricKey> = Item::new(b"aead_key");


pub static CONFIG_ITEM: Item<Config> = Item::new(CONFIG_KEY.as_bytes());
pub static ADMIN_ITEM: Item<Addr> = Item::new(ADMIN_KEY.as_bytes());

pub type SymmetricKey = [u8; 32];

#[cw_serde]
pub struct State {
    pub owner: Addr,
    pub key: Binary,
    pub current_hash: Binary,
    pub counter: Uint128,
}

#[cw_serde]
pub struct Request {
    pub reqtype: RequestType,
    pub from: Addr,
    pub to: Option<Addr>,
    pub amount: Uint128,
    pub memo: Option<String>
}

impl Request {
    pub fn load(store: &dyn Storage, seqno: Uint128) -> StdResult<Request> {
        let req_key = PREFIX_REQUESTS_KEY.add_suffix(&seqno.to_be_bytes());
        req_key.load(store).map_err(|_err| StdError::generic_err("Request load error"))
    }

    pub fn save(store: &mut dyn Storage, request: Request, seqno: Uint128) -> StdResult<()> {
        let req_key = PREFIX_REQUESTS_KEY.add_suffix(&seqno.to_be_bytes());
        req_key.save(store, &request)
    }
}

#[cw_serde]
pub enum RequestType {
    DEPOSIT,
    TRANSFER,
    WITHDRAW
}

#[cw_serde]
pub struct ResponseState {
    pub seqno: Uint128,
    pub status: bool,
    pub amount: Uint128,
    pub response: String
}

#[cw_serde]
pub struct AddressBalance {
    pub balance: Uint128,
    pub address: Addr
}

#[cw_serde]
pub struct CheckPoint {
    pub checkpoint: Vec<AddressBalance>,
    pub seqno: Uint128,
    pub resp_seqno: Uint128,
}

impl CheckPoint {
    pub fn load(store: &dyn Storage) -> StdResult<CheckPoint> {
        CHECKPOINT_KEY.load(store).map_err(|_err| StdError::generic_err("Checkpoint load error"))
    }

    pub fn save(store: &mut dyn Storage, checkpoint: CheckPoint) -> StdResult<()> {
        CHECKPOINT_KEY.save(store, &checkpoint)
    }

}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Config {
    pub min_bet: u64,
    pub max_bet: u64,
    pub max_total: u64,
    pub supported_denoms: Vec<String>
}

pub fn save_config(storage: &mut dyn Storage, config: &Config) -> StdResult<()> {
    CONFIG_ITEM.save(storage, config)
}

pub fn load_config(storage: &dyn Storage) -> StdResult<Config> {
    CONFIG_ITEM.load(storage)
}

pub fn save_admin(storage: &mut dyn Storage, admin: &Addr) -> StdResult<()> {
    ADMIN_ITEM.save(storage, admin)
}

pub fn load_admin(storage: &dyn Storage) -> StdResult<Addr> {
    ADMIN_ITEM.load(storage)
}