use borsh::{BorshDeserialize, BorshSerialize};

use crate::types::U8Pubkey;

#[derive(BorshDeserialize, BorshSerialize, Debug)]
pub struct SbApiFeedParams {
    pub program_id: U8Pubkey,
    pub url: String,
}

#[derive(BorshDeserialize, BorshSerialize, Debug)]
pub struct ApiFeedData {
    pub reach: u64,
}
