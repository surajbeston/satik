use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct SbApiFeedParams {
    pub program_id: Pubkey,
    pub url: String,
}
