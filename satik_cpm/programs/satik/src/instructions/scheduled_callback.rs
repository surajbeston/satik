use anchor_lang::prelude::*;
use switchboard_solana::Token;

use crate::states::{ApiFeedData, Deal};

#[derive(Accounts)]
pub struct ScheduledCallback<'info> {
    #[account(mut)]
    pub deal: Account<'info, Deal>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn handle_scheduled_callback(ctx: Context<ScheduledCallback>, data: ApiFeedData) -> Result<()> {
    msg!("Received callback");

    Ok(())
}
