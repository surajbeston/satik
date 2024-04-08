use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

use crate::states::{ApiFeedData, Deal};

#[derive(Accounts)]
pub struct ScheduledFeedCallback<'info> {
    #[account(mut)]
    pub deal: Account<'info, Deal>,
    #[account(mut)]
    pub deal_usdc_ata: Account<'info, TokenAccount>,
    #[account(mut)]
    pub influencer_usdc_ata: Account<'info, TokenAccount>,
    #[account(mut)]
    pub brand_usdc_ata: Account<'info, TokenAccount>,
    // ******* check if signer is function
    pub enclave_signer: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn handle_scheduled_feed_callback(
    ctx: Context<ScheduledFeedCallback>,
    data: ApiFeedData,
) -> Result<()> {
    msg!("Received callback {:?}", data);

    // ******* remaining to close function routine account after deal ends ********

    let deal = &mut ctx.accounts.deal;

    // deal has ended and remaining token has been transfered
    if deal.returned_remaining_token {
        return Ok(());
    }

    let brand_key = deal.brand.key();
    let influencer_key = deal.influencer.key();

    let deal_id_seed = deal.id_seed.clone();

    let seeds = &[
        Deal::SEED,
        deal_id_seed.as_bytes().as_ref(),
        brand_key.as_ref(),
        influencer_key.as_ref(),
        &[deal.bump],
    ];

    let signer_seeds = &[&seeds[..]];

    // if deal is ended return usdc to brand ATA
    if deal.deal_ended {
        // return if no amount in deal ata
        if ctx.accounts.deal_usdc_ata.amount == 0 {
            return Ok(());
        }
        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.deal_usdc_ata.to_account_info(),
                    to: ctx.accounts.brand_usdc_ata.to_account_info(),
                    authority: deal.to_account_info(),
                },
                signer_seeds,
            ),
            ctx.accounts.deal_usdc_ata.amount,
        )?;
        ctx.accounts.deal.returned_remaining_token = true;
        return Ok(());
    }

    // handle initial amount
    // check if initial amount is paid
    if !deal.initial_amount_paid {
        // check if initial amount is not none
        if deal.initial_amount.is_none() {
            deal.initial_amount_paid = true;

        // check if reach goal is reached for initial amount
        } else if deal.initial_amount_on_reach.unwrap() <= data.reach {
            // ***** transfer initial_amount to creator pk
            token::transfer(
                CpiContext::new_with_signer(
                    ctx.accounts.token_program.to_account_info(),
                    Transfer {
                        from: ctx.accounts.deal_usdc_ata.to_account_info(),
                        to: ctx.accounts.influencer_usdc_ata.to_account_info(),
                        authority: deal.to_account_info(),
                    },
                    signer_seeds,
                ),
                deal.initial_amount.unwrap(),
            )?;

            deal.initial_amount_paid = true;
        }
    }

    // handle cpm
    let current_time = Clock::get()?.unix_timestamp;

    // if not paid last time set last_paid_reach to starts_on_reach
    let last_paid_on_reach = deal
        .last_paid_on_reach
        .or(Some(deal.starts_on_reach))
        .unwrap();

    let meet_condition_for_cpm_payment: bool = deal.starts_on <= current_time
        && deal.starts_on_reach < data.reach
        && (deal.ends_on > current_time)
        && (deal.ends_on_reach > last_paid_on_reach);

    // check if conditions does not meet for cpm payment
    if !meet_condition_for_cpm_payment {
        return Ok(());
    }

    let mut reach_or_max_reach: u64 = data.reach;
    // check if current reach exceeded deal max reach
    if deal.ends_on_reach < data.reach {
        reach_or_max_reach = deal.ends_on_reach;
        deal.deal_ended = true;
    }

    // if last_paid_on_reach is none its set to starts_on_reach
    // to not pay for reach before start_reach
    let reach_to_be_paid_for = reach_or_max_reach - last_paid_on_reach;
    msg!("Reach to be paid for {}", reach_to_be_paid_for);
    msg!("Paying {}", reach_to_be_paid_for * deal.cpm);

    // ***** pay for for reach
    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.deal_usdc_ata.to_account_info(),
                to: ctx.accounts.influencer_usdc_ata.to_account_info(),
                authority: deal.to_account_info(),
            },
            signer_seeds,
        ),
        reach_to_be_paid_for * deal.cpm,
    )?;

    if deal.ends_on < current_time {
        deal.deal_ended = true;
    }

    deal.last_paid_on = Some(current_time);
    deal.last_paid_on_reach = Some(data.reach);

    Ok(())
}
