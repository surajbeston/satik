use ::anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

use crate::states::{Brand, CreateDealData, CustomError, Deal, Influencer};

#[derive(Accounts)]
#[instruction(data: CreateDealData)]
pub struct CreateDeal<'info> {
    #[account(
        init,
        space = Deal::INIT_SPACE + 8,
        payer = payer,
        seeds = [
            Deal::SEED,
            data.id_seed.as_bytes().as_ref(),
            brand.key().as_ref(),
            influencer.key().as_ref(),
        ],
        bump,
    )]
    deal: Account<'info, Deal>,
    #[account(init, payer = payer, associated_token::mint = mint, associated_token::authority = deal)]
    deal_usdc_ata: Account<'info, TokenAccount>,
    #[account(constraint = payer.key() == brand.created_by)]
    brand: Account<'info, Brand>,
    #[account(mut, constraint = brand.usdc_ata == brand_usdc_ata.key())]
    brand_usdc_ata: Account<'info, TokenAccount>,
    influencer: Account<'info, Influencer>,
    mint: Account<'info, Mint>,

    #[account(mut)]
    payer: Signer<'info>,
    token_program: Program<'info, Token>,
    associated_token_program: Program<'info, AssociatedToken>,
    system_program: Program<'info, System>,
}

pub fn handle_create_deal(ctx: Context<CreateDeal>, data: CreateDealData) -> Result<()> {
    let total_amount_to_pay_to_influencer = data.initial_amount.or(Some(0)).unwrap()
        + (data.ends_on_reach - data.starts_on_reach) * data.cpm;
    msg!("Total amount to pay {}", total_amount_to_pay_to_influencer);
    msg!("Brand USDC amount {}", ctx.accounts.brand_usdc_ata.amount);

    if ctx.accounts.brand_usdc_ata.amount < total_amount_to_pay_to_influencer {
        return err!(CustomError::InsufficientToken);
    }

    let cpi_accounts = Transfer {
        from: ctx.accounts.brand_usdc_ata.to_account_info().clone(),
        to: ctx.accounts.deal_usdc_ata.to_account_info().clone(),
        authority: ctx.accounts.payer.to_account_info().clone(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    token::transfer(
        CpiContext::new(cpi_program, cpi_accounts),
        total_amount_to_pay_to_influencer,
    )?;

    ctx.accounts.deal.brand = ctx.accounts.brand.key();
    ctx.accounts.deal.influencer = ctx.accounts.influencer.key();
    ctx.accounts.deal.deal_usdc_ata = ctx.accounts.deal_usdc_ata.key();
    ctx.accounts.deal.brand_ata = ctx.accounts.brand_usdc_ata.key();
    ctx.accounts.deal.influencer_ata = ctx.accounts.influencer.usdc_ata;
    ctx.accounts.deal.initial_amount = data.initial_amount;
    ctx.accounts.deal.initial_amount_on_reach = data.initial_amount_on_reach;
    ctx.accounts.deal.initial_amount_paid = false;
    ctx.accounts.deal.starts_on = data.starts_on;
    ctx.accounts.deal.starts_on_reach = data.starts_on_reach;
    ctx.accounts.deal.ends_on = data.ends_on;
    ctx.accounts.deal.ends_on_reach = data.ends_on_reach;
    ctx.accounts.deal.cpm = data.cpm;
    ctx.accounts.deal.feed_scheduled = false;
    ctx.accounts.deal.deal_ended = false;
    ctx.accounts.deal.returned_remaining_token = false;
    ctx.accounts.deal.id_seed = data.id_seed;
    ctx.accounts.deal.bump = ctx.bumps.deal;

    Ok(())
}
