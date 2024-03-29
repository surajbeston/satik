use anchor_lang::prelude::*;

pub mod instructions;
pub mod states;
pub mod types;

use instructions::*;
use states::CreateDealData;

declare_id!("4L1SsEXGTzAjW7ajdm5xgqsCvi1jnRHLNsqytjiKdMeK");

#[program]
pub mod satik {
    use super::*;

    pub fn create_deal(ctx: Context<CreateDeal>, data: CreateDealData) -> Result<()> {
        handle_create_deal(ctx, data)
    }
}
