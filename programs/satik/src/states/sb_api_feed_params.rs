use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct SbApiFeedParams {
    pub program_id: Pubkey,
    pub deal_pk: Pubkey,
    pub url: String,
}
