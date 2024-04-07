use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct SbApiFeedParams {
    pub program_id: Pubkey,
    pub deal_pk: Pubkey,
    pub deal_ata: Pubkey,
    pub influencer_ata: Pubkey,
    pub brand_ata: Pubkey,
    pub url: String,
}
