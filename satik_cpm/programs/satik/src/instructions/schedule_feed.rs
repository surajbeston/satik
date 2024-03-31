use anchor_lang::prelude::*;
use anchor_lang::Result;
use switchboard_solana::borsh::to_vec;
use switchboard_solana::prelude::*;

use crate::states::Deal;
use crate::states::SbApiFeedParams;
use crate::states::UserPDA;

#[derive(Accounts)]
pub struct ScheduleFeed<'info> {
    #[account(mut, constraint = payer.key() == deal.brand_pk)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub paying_account: Account<'info, UserPDA>,
    pub deal: Account<'info, Deal>,
    #[account(executable, address = SWITCHBOARD_ATTESTATION_PROGRAM_ID)]
    /// CHECK: Not dangerous
    pub switchboard_attestation: AccountInfo<'info>,
    pub switchboard_attestation_state: AccountLoader<'info, AttestationProgramState>,
    pub switchboard_attestation_queue: AccountLoader<'info, AttestationQueueAccountData>,
    #[account(mut)]
    pub switchboard_function: AccountLoader<'info, FunctionAccountData>,
    #[account(mut, signer)]
    /// CHECK: Not dangerous
    pub switchboard_request: AccountInfo<'info>,
    #[account(mut)]
    /// CHECK: Not dangerous
    pub switchboard_request_escrow: AccountInfo<'info>,
    #[account(address = anchor_spl::token::spl_token::native_mint::ID)]
    pub switchboard_mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn handle_schedule_feed(ctx: Context<ScheduleFeed>) -> Result<()> {
    let request_init = FunctionRequestInitAndTrigger {
        request: ctx.accounts.switchboard_request.clone(),
        authority: ctx.accounts.paying_account.to_account_info(),
        function: ctx.accounts.switchboard_function.to_account_info(),
        function_authority: None,
        escrow: ctx.accounts.switchboard_request_escrow.to_account_info(),
        state: ctx.accounts.switchboard_attestation_state.to_account_info(),
        mint: ctx.accounts.switchboard_mint.to_account_info(),
        attestation_queue: ctx.accounts.switchboard_attestation_queue.to_account_info(),
        payer: ctx.accounts.payer.to_account_info(),
        token_program: ctx.accounts.token_program.to_account_info(),
        associated_token_program: ctx.accounts.associated_token_program.to_account_info(),
        system_program: ctx.accounts.system_program.to_account_info(),
    };

    let params = SbApiFeedParams {
        program_id: crate::id(),
        deal_pk: ctx.accounts.deal.key(),
        url: ctx.accounts.deal.content_url.clone(),
    };

    msg!(&ctx.accounts.deal.content_url);

    let payer_key = ctx.accounts.payer.key();
    let seeds = &[
        UserPDA::SEED,
        payer_key.as_ref(),
        &[ctx.accounts.paying_account.bump],
    ];

    request_init.invoke_signed(
        ctx.accounts.switchboard_attestation.clone(),
        None,
        None,
        Some(512),
        Some(to_vec(&params)?),
        None,
        None,
        &[seeds],
    )?;

    Ok(())
}
