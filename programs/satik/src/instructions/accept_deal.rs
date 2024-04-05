use anchor_lang::prelude::*;

use crate::states::{Deal, Influencer};

#[derive(Accounts)]
pub struct AcceptDeal<'info> {
    // check if influencer is created by signer
    #[account(constraint = influencer.created_by == signer.key())]
    pub influencer: Account<'info, Influencer>,
    // check if influencer in this deal matches the provided influencer
    #[account(mut, constraint = deal.influencer == influencer.key())]
    pub deal: Account<'info, Deal>,

    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handle_accept_deal(ctx: Context<AcceptDeal>, content_url: String) -> Result<()> {
    ctx.accounts.deal.influencer_accepted = true;
    ctx.accounts.deal.content_url = Some(content_url);

    Ok(())
}
