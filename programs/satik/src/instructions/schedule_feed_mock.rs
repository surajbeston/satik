use anchor_lang::prelude::*;

use crate::states::Deal;

// Just to test

#[derive(Accounts)]
pub struct ScheduleFeedMock<'info> {
    #[account(mut)]
    pub deal: Account<'info, Deal>,

    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handle_schedule_feed_mock(ctx: Context<ScheduleFeedMock>) -> Result<()> {
    ctx.accounts.deal.feed_scheduled = true;

    Ok(())
}
