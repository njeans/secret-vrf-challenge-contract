use cosmwasm_std::{Addr, Coin, Uint128};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use crate::types::Bet;
use crate::state::RequestType;
use cosmwasm_schema::cw_serde;

#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
    pub min_bet: Option<u64>,
    pub max_bet: Option<u64>,
    pub max_total: Option<u64>,
    pub supported_denoms: Option<Vec<String>>,
    pub admin: Option<Addr>
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    SubmitDeposit {        
    },
    SubmitTransfer {
        to: Addr,
        amount: Uint128,
        memo: String,
    },

    SubmitWithdraw {
        amount: Uint128
    },

    Bet {
        bets: Vec<Bet>
    },
    AdminWithdraw {
        coin: Coin
    },
    ChangeAdmin {
        admin: Addr
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    // User that wants to read their share (todo: authentication)
    // ReadShare {
    //     user_index: u32
    // }
}
