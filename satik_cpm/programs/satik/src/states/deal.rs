use anchor_lang::prelude::*;

#[account]
pub struct Deal {
    pub brand_pk: Pubkey,
    pub creator_pk: Pubkey,
    pub initial_amount: Option<u64>,
    pub initial_amount_on_reach: Option<u64>,
    pub initial_amount_paid: bool,
    pub starts_on: i64,
    pub starts_on_reach: u64,
    pub ends_on: Option<i64>,
    pub ends_on_reach: Option<u64>,
    pub cpm: u64,
    pub last_paid_on: Option<i64>,
    pub last_paid_on_reach: Option<u64>,
    pub content_url: String,
    pub id_seed: Vec<u8>,
    pub bump: u8,
}

impl Deal {
    pub const SEED: &'static [u8] = b"deal_seed";
    pub const FIXED_SIZE: usize = 32 + 32 + 64 + 64 + 8 + 64 + 64 + 64 + 64 + 64 + 64 + 64 + 8;

    pub fn id_seed_size(&self) -> usize {
        self.id_seed.len() * 8
    }

    pub fn content_url_size(&self) -> usize {
        self.content_url.len() * 8
    }

    pub fn size(&self) -> usize {
        Deal::FIXED_SIZE + self.id_seed_size() + self.content_url_size()
    }
}

#[derive(AnchorDeserialize, AnchorSerialize, Clone)]
pub struct CreateDealData {
    pub initial_amount: Option<u64>,
    pub initial_amount_on_reach: Option<u64>,
    pub starts_on: i64,
    pub starts_on_reach: u64,
    pub ends_on: Option<i64>,
    pub ends_on_reach: Option<u64>,
    pub cpm: u64,
    pub creator_pk: Pubkey,
    pub content_url: String,
    pub id_seed: Vec<u8>,
}

impl CreateDealData {
    pub fn content_url_size(&self) -> usize {
        self.content_url.len() * 8
    }

    pub fn id_seed_size(&self) -> usize {
        self.id_seed.len() * 8
    }

    pub fn dynamic_size(&self) -> usize {
        self.id_seed_size() + self.content_url_size()
    }
}
