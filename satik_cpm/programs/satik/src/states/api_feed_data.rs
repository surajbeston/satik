use anchor_lang::prelude::*;

#[derive(AnchorDeserialize, AnchorSerialize, Debug)]
pub struct ApiFeedData {
    pub reach: u64,
}
