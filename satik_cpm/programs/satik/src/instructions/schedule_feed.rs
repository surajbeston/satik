use anchor_lang::prelude::*;
use anchor_lang::Result;
use switchboard_solana::borsh::to_vec;
use switchboard_solana::prelude::*;

use crate::states::Deal;
use crate::states::SbApiFeedParams;

#[derive(Accounts)]
pub struct ScheduleFeed<'info> {
    #[account(mut, constraint = payer.key() == deal.brand_pk)]
    pub payer: Signer<'info>,
    pub deal: Account<'info, Deal>,
    #[account(executable, address = SWITCHBOARD_ATTESTATION_PROGRAM_ID)]
    /// CHECK: Not dangerous
    pub switchboard_attestation: AccountInfo<'info>,
    pub switchboard_attestation_state: AccountLoader<'info, AttestationProgramState>,
    pub switchboard_attestation_queue: AccountLoader<'info, AttestationQueueAccountData>,
    #[account(mut)]
    pub switchboard_function: AccountLoader<'info, FunctionAccountData>,
    #[account(
        mut,
        signer,
        owner = system_program.key(),
        // constraint = switchboard_request.data_len() == 0 && switchboard_request.lamports() == 0
      )]
    /// CHECK: Not dangerous
    pub switchboard_routine: AccountInfo<'info>,
    #[account(
        mut,
        owner = system_program.key(),
        // constraint = switchboard_request_escrow.data_len() == 0 && switchboard_request_escrow.lamports() == 0
      )]
    /// CHECK: Not dangerous
    pub switchboard_routine_escrow: AccountInfo<'info>,
    #[account(address = anchor_spl::token::spl_token::native_mint::ID)]
    pub switchboard_mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn handle_schedule_feed(ctx: Context<ScheduleFeed>) -> Result<()> {
    let routine_init = FunctionRequestInit {
        request: ctx.accounts.switchboard_routine.clone(),
        authority: ctx.accounts.payer.to_account_info(),
        function: ctx.accounts.switchboard_function.to_account_info(),
        function_authority: None,
        escrow: ctx.accounts.switchboard_routine_escrow.clone(),
        state: ctx.accounts.switchboard_attestation_state.to_account_info(),
        // escrow_wallet_authority: None,
        // escrow_wallet: ctx.accounts.switchboard_routine_escrow.clone(),
        // escrow_token_wallet: ctx.accounts.switchboard_routine_escrow.clone(),
        mint: ctx.accounts.switchboard_mint.to_account_info(),
        attestation_queue: ctx.accounts.switchboard_attestation_queue.to_account_info(),
        payer: ctx.accounts.payer.to_account_info(),
        token_program: ctx.accounts.token_program.to_account_info(),
        associated_token_program: ctx.accounts.associated_token_program.to_account_info(),
        system_program: ctx.accounts.system_program.to_account_info(),
    };

    let params = SbApiFeedParams {
        program_id: crate::id(),
        url: ctx.accounts.deal.content_url.clone(),
    };

    // let routine_init_params = FunctionRequestInitParams {
    //     container_params: to_vec(&params)?,
    //     max_container_params_len: None,
    //     garbage_collection_slot: None,
    // };

    routine_init.invoke(
        ctx.accounts.switchboard_attestation.clone(),
        None,
        Some(to_vec(&params)?),
        None,
    )?;

    Ok(())
}
