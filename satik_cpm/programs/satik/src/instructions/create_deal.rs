use ::anchor_lang::prelude::*;

use crate::states::{ CreateDealData, Deal };

#[derive(Accounts)]
#[instruction(data: CreateDealData)]
pub struct CreateDeal<'info> {
    #[account(
        init,
        space = Deal::FIXED_SIZE + 8 + data.dynamic_size(),
        payer = payer,
        seeds = [
            Deal::SEED,
            &data.id_seed,
            payer.key().as_ref(), 
            data.creator_pk.key().as_ref(),
        ],
        bump,
    )]
    deal: Account<'info, Deal>,
    #[account(mut)]
    payer: Signer<'info>,
    system_program: Program<'info, System>,
}

pub fn handle_create_deal(ctx: Context<CreateDeal>, data: CreateDealData) -> Result<()> {

    ctx.accounts.deal.brand_pk = ctx.accounts.payer.key.clone();
    ctx.accounts.deal.starts_on = data.starts_on;
    ctx.accounts.deal.ends_on = data.ends_on;
    ctx.accounts.deal.payment_deals = data.payment_deals;
    ctx.accounts.deal.creator_pk = data.creator_pk;
    ctx.accounts.deal.initial_amount = data.initial_amount;
    ctx.accounts.deal.bump = ctx.bumps.deal;
    ctx.accounts.deal.id_seed = data.id_seed;
    ctx.accounts.deal.content_url = data.content_url;
    
    

    Ok(())
}

