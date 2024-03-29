use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub struct PaymentDeal {
    pub start_mile: u32,
    pub end_mile: Option<u32>,
    pub cpm: u32,
}
