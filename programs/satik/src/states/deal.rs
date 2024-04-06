use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Deal {
    pub brand: Pubkey,
    pub influencer: Pubkey,
    pub deal_usdc_ata: Pubkey,
    pub brand_ata: Pubkey,
    pub influencer_ata: Pubkey,
    pub initial_amount: Option<u64>,
    pub initial_amount_on_reach: Option<u64>,
    pub starts_on: i64,
    pub starts_on_reach: u64,
    pub ends_on: i64,
    pub ends_on_reach: u64,
    pub cpm: u64,
    pub last_paid_on: Option<i64>,
    pub last_paid_on_reach: Option<u64>,
    #[max_len(200)]
    pub content_url: Option<String>,
    pub initial_amount_paid: bool,
    pub feed_scheduled: bool,
    pub influencer_accepted: bool,
    pub deal_ended: bool,
    pub returned_remaining_token: bool,
    #[max_len(100)]
    pub id_seed: String,
    pub bump: u8,
}

impl Deal {
    pub const SEED: &'static [u8] = b"deal_seed";
    // pub const FIXED_SIZE: usize =
    //     32 + 32 + 32 + 64 + 64 + 8 + 8 + 8 + 8 + 8 + 64 + 64 + 64 + 64 + 64 + 64 + 64 + 8;

    // pub fn id_seed_size(&self) -> usize {
    //     self.id_seed.len() * 8
    // }

    // pub fn content_url_size(&self) -> usize {
    //     self.content_url.len() * 8
    // }

    // pub fn size(&self) -> usize {
    //     Deal::FIXED_SIZE + self.id_seed_size() + self.content_url_size()
    // }
}

#[derive(AnchorDeserialize, AnchorSerialize, Clone)]
pub struct CreateDealData {
    pub initial_amount: Option<u64>,
    pub initial_amount_on_reach: Option<u64>,
    pub starts_on: i64,
    pub starts_on_reach: u64,
    pub ends_on: i64,
    pub ends_on_reach: u64,
    pub cpm: u64,
    pub id_seed: String,
}
