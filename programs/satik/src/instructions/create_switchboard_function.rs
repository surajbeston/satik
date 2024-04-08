use anchor_lang::prelude::*;
use anchor_lang::Result;
use switchboard_solana::prelude::*;

use crate::states::SwitchboardFunctionAuthority;

#[derive(Accounts)]
#[instruction(name: String)]
pub struct CreateSwitchboardFunction<'info> {
    #[account(init, payer=payer, space=SwitchboardFunctionAuthority::INIT_SPACE + 8, seeds=[
        SwitchboardFunctionAuthority::SEED,
        name.as_bytes().as_ref(),
    ], bump)]
    pub function_authority: Account<'info, SwitchboardFunctionAuthority>,

    /// CHECK: Not Needed
    #[account(mut)]
    pub function: AccountInfo<'info>,
    /// CHECK: Not needed
    #[account(mut)]
    pub address_lookup_table: AccountInfo<'info>,
    /// CHECK: Not needed
    #[account(mut)]
    pub escrow_wallet: AccountInfo<'info>,
    /// CHECK: Not needed
    #[account(mut)]
    pub escrow_token_wallet: AccountInfo<'info>,
    pub mint: Account<'info, Mint>,

    #[account(executable, address = SWITCHBOARD_ATTESTATION_PROGRAM_ID)]
    /// CHECK: Not needed
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

pub fn handle_create_switchboard_function(
    ctx: Context<CreateSwitchboardFunction>,
    name: String,
    metadata: String,
    container: String,
    registry: String,
    slot: u64,
    mr_enclave: [u8; 32],
) -> Result<()> {
    ctx.accounts.function_authority.bump = ctx.bumps.function_authority;
    ctx.accounts.function_authority.name = name.clone();
    ctx.accounts.function_authority.function = ctx.accounts.function.key();
    ctx.accounts.function_authority.escrow_wallet = ctx.accounts.escrow_wallet.key();
    ctx.accounts.function_authority.escrow_token_wallet = ctx.accounts.escrow_token_wallet.key();

    let function_init = FunctionInit {
        function: ctx.accounts.function.to_account_info(),
        address_lookup_table: ctx.accounts.address_lookup_table.clone(),
        authority: ctx.accounts.function_authority.to_account_info(),
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
        recent_slot: slot,
        creator_seed: Some(ctx.accounts.function_authority.key().to_bytes()),
        name: name.clone().into_bytes(),
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

    let signer_seeds = &[
        SwitchboardFunctionAuthority::SEED,
        name.as_bytes().as_ref(),
        &[ctx.accounts.function_authority.bump],
    ];

    function_init.invoke_signed(
        ctx.accounts.switchboard_attestation.clone(),
        &params,
        &[signer_seeds],
    )?;

    Ok(())
}
