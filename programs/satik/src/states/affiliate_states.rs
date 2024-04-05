use anchor_lang::prelude::*;

// use anchor_lang::prelude::Sysvar;


#[account]
#[derive(InitSpace)]
pub struct Brand {
    #[max_len(100)]
    pub name: String,
    #[max_len(64)]
    pub created_by: Pubkey,
    #[max_len(50)]
    pub username: String,
    #[max_len(150)]
    pub profile_image: String,
    #[max_len(200)] 
    pub bio: String,
    pub usdc_ata: Pubkey
}

#[account]
#[derive(InitSpace)]
pub struct Influencer {
    #[max_len(100)]
    pub name: String,
    #[max_len(50)]
    pub username: String,
    #[max_len(150)]
    pub profile_image: String,
    #[max_len(200)]
    pub bio: String,
    pub created_by: Pubkey,
    pub usdc_ata: Pubkey
}

#[account]
#[derive(InitSpace)]
pub struct Proposal {
    pub brand: Pubkey,
    pub influencer_key: Pubkey,
    #[max_len(200)]
    pub webpage: String,
    #[max_len(100)]
    pub message: String,
    pub datetime: u64,
    pub created_by: Pubkey,
    pub accepted: bool,
    pub brand_ata: Pubkey,
    pub influencer_ata: Pubkey,
    pub brand_redeemer: Pubkey,
}

#[account]
#[derive(InitSpace)]
pub struct Product {
    pub proposal: Pubkey,
    #[max_len(60)]
    pub name: String,
    pub total_amount: u64,
    #[max_len(200)]
    pub description: String,
    pub influencer_amount: u64,
    pub satik_amount: u64,
    pub brand_amount: u64
}

#[account]
#[derive(InitSpace)]
pub struct Purchase {
    #[max_len(50)]
    pub id: String,
    pub paid_by: Pubkey,
    pub product: Pubkey,
    pub brand_receiver: Pubkey,
    pub influencer_receiver: Pubkey,
    pub satik_receiver: Pubkey,
    pub brand_created_by: Pubkey,
    pub escrow: Pubkey,
    pub total_amount: u64,
    pub brand_amount: u64,
    pub satik_amount: u64,
    pub influencer_amount: u64,
    pub purchase_datetime: i64,
    pub redeemer: Pubkey,
    pub redeemed: bool
}

#[account]
#[derive(InitSpace)]
pub struct RedeemDatetime {
    pub redeemed_on: i64
}