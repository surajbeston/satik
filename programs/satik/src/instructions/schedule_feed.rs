use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_instruction;
use anchor_lang::Result;
use anchor_spl::token::sync_native;
use anchor_spl::token::SyncNative;
use switchboard_solana::borsh::to_vec;
use switchboard_solana::prelude::*;

use crate::states::CustomError;
use crate::states::Deal;
use crate::states::SbApiFeedParams;
use crate::states::SwitchboardFunctionAuthority;

#[derive(Accounts)]
pub struct ScheduleFeed<'info> {
    #[account(mut)]
    pub deal: Account<'info, Deal>,
    pub function_authority: Account<'info, SwitchboardFunctionAuthority>,

    #[account(mut)]
    /// CHECK: Not needed
    pub routine: Signer<'info>,
    #[account(mut)]
    /// CHECK: Not needed
    pub escrow_wallet: AccountInfo<'info>,
    #[account(mut)]
    /// CHECK: Not needed
    pub escrow_token_wallet: AccountInfo<'info>,

    #[account(executable, address = SWITCHBOARD_ATTESTATION_PROGRAM_ID)]
    /// CHECK: Not dangerous
    pub switchboard_attestation: AccountInfo<'info>,
    pub switchboard_attestation_queue: AccountLoader<'info, AttestationQueueAccountData>,
    #[account(mut)]
    pub switchboard_function: AccountLoader<'info, FunctionAccountData>,
    #[account(address = anchor_spl::token::spl_token::native_mint::ID)]
    pub switchboard_mint: Account<'info, Mint>,

    #[account(mut)]
    pub payer: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn handle_schedule_feed(ctx: Context<ScheduleFeed>) -> Result<()> {
    let deal = &mut ctx.accounts.deal;

    if deal.feed_scheduled {
        return err!(CustomError::FeedAlreadyScheduled);
    }
    if !deal.influencer_accepted {
        return err!(CustomError::DealNotAccepted);
    }

    // transfer required WSOL to escrow wallet

    // Not true value
    let cost_per_call = 10000000;

    let total_routine_calls: u64 = ((deal.ends_on - deal.starts_on) / 86400 + 2) as u64;
    let total_routine_cost = total_routine_calls * cost_per_call;
    msg!("Total routine calls {}", total_routine_calls);
    msg!("Total routine cost {}", total_routine_cost);

    if ctx.accounts.payer.lamports() < total_routine_cost {
        return err!(CustomError::InsufficientSOL);
    }

    let transfer_ix = system_instruction::transfer(
        &ctx.accounts.payer.key(),
        &ctx.accounts.escrow_token_wallet.key(),
        total_routine_cost,
    );
    solana_program::program::invoke(
        &transfer_ix,
        &[
            ctx.accounts.payer.to_account_info(),
            ctx.accounts.escrow_token_wallet.clone(),
            ctx.accounts.system_program.to_account_info(),
        ],
    )?;

    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_accounts = SyncNative {
        account: ctx.accounts.escrow_token_wallet.clone(),
    };
    sync_native(CpiContext::new(cpi_program, cpi_accounts))?;

    // schedule payment
    let routine_init = FunctionRoutineInit {
        routine: ctx.accounts.routine.to_account_info(),
        authority: ctx.accounts.function_authority.to_account_info(),
        function: ctx.accounts.switchboard_function.to_account_info(),
        function_authority: None,
        escrow_wallet: ctx.accounts.escrow_wallet.clone(),
        escrow_token_wallet: ctx.accounts.escrow_token_wallet.clone(),
        escrow_wallet_authority: None,
        mint: ctx.accounts.switchboard_mint.to_account_info(),
        attestation_queue: ctx.accounts.switchboard_attestation_queue.to_account_info(),
        payer: ctx.accounts.payer.to_account_info(),
        token_program: ctx.accounts.token_program.to_account_info(),
        associated_token_program: ctx.accounts.associated_token_program.to_account_info(),
        system_program: ctx.accounts.system_program.to_account_info(),
    };

    let params = SbApiFeedParams {
        program_id: crate::id(),
        deal_pk: deal.key(),
        deal_ata: deal.deal_usdc_ata,
        influencer_ata: deal.influencer_ata,
        brand_ata: deal.brand_ata,
        url: deal.content_url.clone().unwrap(),
    };

    msg!(&deal.content_url.clone().unwrap());

    let seeds = &[
        SwitchboardFunctionAuthority::SEED,
        ctx.accounts.function_authority.name.as_bytes().as_ref(),
        &[ctx.accounts.function_authority.bump],
    ];

    let routine_params = FunctionRoutineInitParams {
        name: None,
        metadata: None,
        bounty: None,
        schedule: vec![42, 32, 42, 32, 42, 32, 49, 32, 42, 32, 42],
        max_container_params_len: Some(512),
        container_params: to_vec(&params)?,
    };

    routine_init.invoke_signed(
        ctx.accounts.switchboard_attestation.clone(),
        &routine_params,
        &[seeds],
    )?;

    deal.feed_scheduled = true;

    Ok(())
}
