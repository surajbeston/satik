use anchor_lang::prelude::*;

use super::payment_deal::PaymentDeal;

#[account]
pub struct Deal {
    pub brand_pk: Pubkey,
    pub creator_pk: Pubkey,
    pub initial_amount: u32, // in SOL
    pub payment_deals: Vec<PaymentDeal>,
    pub starts_on: i64,
    pub ends_on: Option<i64>,
    pub last_paid_on: Option<i64>,
    pub last_paid_on_reach: Option<u64>,
    pub content_reach: Option<u64>,
    pub content_url: String,
    pub id_seed: Vec<u8>,
    pub bump: u8,
}

impl Deal {
    pub const SEED: &'static [u8] = b"deal_seed";
    pub const FIXED_SIZE: usize = 32 + 32 + 32 + 64 + 64 + 64 + 8;

    // pub fn creator_pks_size(&self) -> usize {
    //     self.creator_pks.len() * 32
    // }

    pub fn id_seed_size(&self) -> usize {
        self.id_seed.len() * 8
    }

    pub fn content_url_size(&self) -> usize {
        self.content_url.len() * 8
    }

    pub fn payment_deals_size(&self) -> usize {
        self.payment_deals.len() * PaymentDeal::INIT_SPACE
    }

    pub fn size(&self) -> usize {
        Deal::FIXED_SIZE + self.id_seed_size() + self.payment_deals_size() + self.content_url_size()
    }
}

#[derive(AnchorDeserialize, AnchorSerialize, Clone)]
pub struct CreateDealData {
    pub initial_amount: u32,
    pub starts_on: i64,
    pub ends_on: Option<i64>,
    pub payment_deals: Vec<PaymentDeal>,
    pub creator_pk: Pubkey,
    pub content_url: String,
    pub id_seed: Vec<u8>,
}

impl CreateDealData {
    // pub fn creator_pks_size(&self) -> usize {
    //     self.creator_pks.len() * 32
    // }
    pub fn content_url_size(&self) -> usize {
        self.content_url.len() * 8
    }

    pub fn id_seed_size(&self) -> usize {
        self.id_seed.len() * 8
    }

    pub fn payment_deals_size(&self) -> usize {
        self.payment_deals.len() * PaymentDeal::INIT_SPACE
    }

    pub fn dynamic_size(&self) -> usize {
        self.payment_deals_size() + self.id_seed_size() + self.content_url_size()
    }
}
