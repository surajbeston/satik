use anchor_lang::prelude::*;
// use anchor_spl::token_interface::TokenAccount;

use crate::states::{ApiFeedData, Deal};

#[derive(Accounts)]
pub struct ScheduledFeedCallback<'info> {
    #[account(mut)]
    pub deal: Account<'info, Deal>,
    // #[account(mut)]
    // pub deal_usdc_ata: Account<'info, TokenAccount>,
    // #[account(mut)]
    // pub influencer_usdc_ata: Account<'info, TokenAccount>,
    pub enclave_signer: Signer<'info>,
    // pub token_program: Program<'info, Token>,
    // pub system_program: Program<'info, System>,
}

pub fn handle_scheduled_feed_callback(
    ctx: Context<ScheduledFeedCallback>,
    data: ApiFeedData,
) -> Result<()> {
    msg!("Received callback {:?}", data);

    let deal = &mut ctx.accounts.deal;

    // handle initial amount
    if !deal.initial_amount_paid {
        if deal.initial_amount.is_none() {
            deal.initial_amount_paid = true;
        }
        if deal.initial_amount_on_reach.unwrap() < data.reach {
            // ***** transfer initial_amount to creator pk

            deal.initial_amount_paid = true;
        }
    }

    // handle cpm
    let current_time = Clock::get()?.unix_timestamp;
    let last_paid_on_reach = deal.last_paid_on_reach.or(Some(0)).unwrap();

    let meet_condition_for_cpm_payment: bool = deal.starts_on < current_time
        && deal.starts_on_reach < data.reach
        && (deal.ends_on > current_time)
        && (deal.ends_on_reach > last_paid_on_reach);

    if !meet_condition_for_cpm_payment {
        return Ok(());
    }

    let mut reach_or_max_reach: u64 = data.reach;
    if deal.ends_on_reach < data.reach {
        reach_or_max_reach = deal.ends_on_reach;
    }
    let reach_to_be_paid_for = reach_or_max_reach - last_paid_on_reach;
    msg!("Reach to be paid for {}", reach_to_be_paid_for);

    // ***** pay for for reach

    deal.last_paid_on = Some(current_time);
    deal.last_paid_on_reach = Some(last_paid_on_reach);

    Ok(())
}
