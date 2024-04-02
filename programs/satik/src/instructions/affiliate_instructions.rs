use anchor_lang::prelude::*;

use crate::states::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{Mint, Token, TokenAccount};


#[derive(Accounts)]
#[instruction(username: String)]
pub struct InitializeBrand<'info> {
    #[account(init, payer = signer, space = 800, seeds=[username.as_bytes().as_ref()], bump)]
    pub brand: Account<'info, Brand>,
    pub usdc_ata: Account<'info, TokenAccount>,

    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
#[instruction(username: String)]
pub struct InitializeInfluencer<'info> {
    #[account(init, payer = signer, space = 8 + Influencer::INIT_SPACE, seeds=[username.as_bytes().as_ref()], bump)]
    pub influencer: Account<'info, Influencer>,
    pub usdc_ata: Account<'info, TokenAccount>,

    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>
}


#[derive(Accounts)]
pub struct  InitializeProposal<'info> {
    #[account(init, payer = signer, space = 8 + Proposal::INIT_SPACE)]
    pub proposal: Account<'info, Proposal>,

    pub brand: Account<'info, Brand>,
    pub influencer: Account<'info, Influencer>,

    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct InitializeProduct<'info> {
    #[account(init, payer = signer, space = 8 + Product::INIT_SPACE)]
    pub product: Account<'info, Product>,

    pub proposal: Account<'info, Proposal>,

    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct AcceptProposal<'info> {
    #[account(mut)]
    pub proposal: Account<'info, Proposal>,

    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>

}

#[derive(Accounts)]
#[instruction(id: String)]
pub struct InitializePurchase<'info> {
    #[account(init, payer = signer, space = 8 + Purchase::INIT_SPACE, seeds = [id.as_bytes().as_ref()], bump)]
    pub purchase: Box<Account<'info, Purchase>>,

    pub proposal: Box<Account<'info, Proposal>>,
    pub product: Box<Account<'info, Product>>,
    #[account(mut)]
    pub brand_ata: Box<Account<'info, TokenAccount>>,
    #[account(mut)]
    pub influencer_ata: Box<Account<'info, TokenAccount>>,
    #[account(mut)]
    pub customer_ata: Box<Account<'info, TokenAccount>>,

    #[account(init, payer = signer, associated_token::mint = mint, associated_token::authority = purchase)]
    pub usdc_token_account: Account<'info, TokenAccount>,
    pub mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct RedeemPurchase<'info> {
    #[account(init, payer = signer, space = 8 + RedeemDatetime::INIT_SPACE)]
    pub redeem_datetime: Account<'info, RedeemDatetime>,
    #[account(mut)]
    pub purchase: Account<'info, Purchase>,

    #[account(mut)]
    pub brand_receiver: Account<'info, TokenAccount>,
    #[account(mut)]
    pub influencer_receiver: Account<'info, TokenAccount>,
    #[account(mut)]
    pub satik_receiver: Account<'info, TokenAccount>,

    #[account(mut)]
    pub escrow: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub mint: Account<'info, Mint>,

    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>
}


