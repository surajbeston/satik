use anchor_lang::prelude::*;
use anchor_lang::Result;
use switchboard_solana::prelude::*;

use crate::states::FunctionsOwner;

#[derive(Accounts)]
pub struct CreateFunctionsOwner<'info> {
    #[account(init,
      payer=payer,
      space= 8 + FunctionsOwner::INIT_SPACE,
      seeds=[
        FunctionsOwner::SEED,
      ],
      bump,
    )]
    pub functions_owner: Account<'info, FunctionsOwner>,

    pub function: AccountLoader<'info, FunctionAccountData>,
    /// CHECK: Not needed
    pub address_lookup_table: AccountInfo<'info>,
    /// CHECK: Not needed
    pub escrow_wallet: AccountInfo<'info>,
    /// CHECK: Not needed
    pub escrow_token_wallet: AccountInfo<'info>,
    pub mint: Account<'info, Mint>,

    #[account(executable, address = SWITCHBOARD_ATTESTATION_PROGRAM_ID)]
    /// CHECK: Not dangerous
    pub switchboard_attestation: AccountInfo<'info>,
    pub attestation_queue: AccountLoader<'info, AttestationQueueAccountData>,

    #[account(mut)]
    pub payer: Signer<'info>,
    /// CHECK: Not needed
    pub address_lookup_program: AccountInfo<'info>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn handle_create_functions_owner(
    ctx: Context<CreateFunctionsOwner>,
    name: String,
    metadata: String,
    container: String,
    registry: String,
    mr_enclave: [u8; 32],
) -> Result<()> {
    ctx.accounts.functions_owner.bump = ctx.bumps.functions_owner;

    let function_init = FunctionInit {
        function: ctx.accounts.function.to_account_info(),
        address_lookup_table: ctx.accounts.address_lookup_table.clone(),
        authority: ctx.accounts.functions_owner.to_account_info(),
        attestation_queue: ctx.accounts.attestation_queue.to_account_info(),
        payer: ctx.accounts.payer.to_account_info(),
        escrow_wallet: ctx.accounts.escrow_wallet.clone(),
        escrow_token_wallet: ctx.accounts.escrow_token_wallet.clone(),
        escrow_wallet_authority: None,
        mint: ctx.accounts.mint.to_account_info(),
        address_lookup_program: ctx.accounts.address_lookup_program.clone(),
        associated_token_program: ctx.accounts.associated_token_program.to_account_info(),
        token_program: ctx.accounts.token_program.to_account_info(),
        system_program: ctx.accounts.system_program.to_account_info(),
    };

    let params = FunctionInitParams {
        recent_slot: Clock::get()?.slot,
        creator_seed: None,
        name: name.into_bytes(),
        metadata: metadata.into_bytes(),
        container: container.into_bytes(),
        container_registry: registry.into_bytes(),
        version: vec![1, 1, 1, 1, 1],
        mr_enclave: Some(mr_enclave),
        requests_disabled: false,
        requests_require_authorization: false,
        requests_dev_fee: 0,
        routines_disabled: false,
        routines_require_authorization: false,
        routines_dev_fee: 0,
    };

    let signer_seeds = &[FunctionsOwner::SEED, &[ctx.accounts.functions_owner.bump]];

    // function_init.invoke_signed(
    //     ctx.accounts.switchboard_attestation.clone(),
    //     &params,
    //     &[signer_seeds],
    // )?;
    function_init.invoke(ctx.accounts.switchboard_attestation.clone(), &params)?;

    Ok(())
}
