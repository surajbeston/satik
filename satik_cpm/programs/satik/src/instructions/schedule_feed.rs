use anchor_lang::prelude::*;
use switchboard_solana::prelude::*;

use crate::states::Deal;

#[derive(Accounts)]
pub struct ScheduleFeed<'info> {
    #[account(mut, constraint = payer.key() == deal.brand_pk)]
    pub payer: Signer<'info>,
    pub deal: Account<'info, Deal>,
    #[account(executable, address = SWITCHBOARD_ATTESTATION_PROGRAM_ID)]
    pub switchboard: AccountInfo<'info>,
    pub switchboard_state: AccountLoader<'info, AttestationProgramState>,
    pub switchboard_attestation_queue: AccountLoader<'info, AttestationQueueAccountData>,
    #[account(mut)]
    pub switchboard_function: AccountLoader<'info, FunctionAccountData>,
    #[account(
        mut,
        signer,
        owner = system_program.key(),
        constraint = switchboard_request.data_len() == 0 && switchboard_request.lamports() == 0
      )]
    pub switchboard_request: AccountInfo<'info>,
    #[account(
        mut,
        owner = system_program.key(),
        constraint = switchboard_request_escrow.data_len() == 0 && switchboard_request_escrow.lamports() == 0
      )]
    pub switchboard_request_escrow: AccountInfo<'info>,
    #[account(address = anchor_spl::token::spl_token::native_mint::ID)]
    pub switchboard_mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}
