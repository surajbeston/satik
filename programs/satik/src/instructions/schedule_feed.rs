use anchor_lang::prelude::*;
use anchor_lang::Result;
use switchboard_solana::borsh::to_vec;
use switchboard_solana::prelude::*;

use crate::states::CustomError;
use crate::states::Deal;
use crate::states::SbApiFeedParams;

#[derive(Accounts)]
pub struct ScheduleFeed<'info> {
    #[account(mut)]
    pub deal: Account<'info, Deal>,

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
    // pub switchboard_attestation_state: AccountLoader<'info, AttestationProgramState>,
    pub switchboard_attestation_queue: AccountLoader<'info, AttestationQueueAccountData>,
    #[account(mut)]
    pub switchboard_function: AccountLoader<'info, FunctionAccountData>,
    #[account(address = anchor_spl::token::spl_token::native_mint::ID)]
    pub switchboard_mint: Account<'info, Mint>,

    #[account(mut)]
    pub function_account_authority: Signer<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn handle_schedule_feed(ctx: Context<ScheduleFeed>) -> Result<()> {
    // if ctx.accounts.deal.feed_scheduled {
    //     return err!(CustomError::FeedAlreadyScheduled);
    // }
    if !ctx.accounts.deal.influencer_accepted {
        return err!(CustomError::DealNotAccepted);
    }
    // let request_init = FunctionRequestInitAndTrigger {
    //     request: ctx.accounts.switchboard_request.clone(),
    //     authority: ctx.accounts.deal.to_account_info(),
    //     function: ctx.accounts.switchboard_function.to_account_info(),
    //     function_authority: None,
    //     escrow: ctx.accounts.switchboard_request_escrow.to_account_info(),
    //     state: ctx.accounts.switchboard_attestation_state.to_account_info(),
    //     mint: ctx.accounts.switchboard_mint.to_account_info(),
    //     attestation_queue: ctx.accounts.switchboard_attestation_queue.to_account_info(),
    //     payer: ctx.accounts.payer.to_account_info(),
    //     token_program: ctx.accounts.token_program.to_account_info(),
    //     associated_token_program: ctx.accounts.associated_token_program.to_account_info(),
    //     system_program: ctx.accounts.system_program.to_account_info(),
    // };

    let routine_init = FunctionRoutineInit {
        routine: ctx.accounts.routine.to_account_info(),
        authority: ctx.accounts.function_account_authority.to_account_info(),
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
        deal_pk: ctx.accounts.deal.key(),
        deal_ata: ctx.accounts.deal.deal_usdc_ata,
        influencer_ata: ctx.accounts.deal.influencer_ata,
        brand_ata: ctx.accounts.deal.brand_ata,
        url: ctx.accounts.deal.content_url.clone().unwrap(),
    };

    msg!(&ctx.accounts.deal.content_url.clone().unwrap());

    // seeds of deal account. (Deal has authority of this request)
    // let seeds = &[
    //     Deal::SEED,
    //     ctx.accounts.deal.id_seed.as_bytes().as_ref(),
    //     ctx.accounts.deal.brand.as_ref(),
    //     ctx.accounts.deal.influencer.as_ref(),
    //     &[ctx.accounts.deal.bump],
    // ];

    let routine_params = FunctionRoutineInitParams {
        name: None,
        metadata: None,
        bounty: None,
        schedule: vec![42, 32, 49, 32, 42, 32, 42, 32, 42, 32, 42],
        max_container_params_len: Some(512),
        container_params: to_vec(&params)?,
    };

    // routine_init.invoke_signed(
    //     ctx.accounts.switchboard_attestation.clone(),
    //     &routine_params,
    //     &[seeds],
    // )?;

    routine_init.invoke(
        ctx.accounts.switchboard_attestation.clone(),
        &routine_params,
    )?;

    // request_init.invoke_signed(
    //     ctx.accounts.switchboard_attestation.clone(),
    //     None,
    //     None,
    //     Some(512),
    //     Some(to_vec(&params)?),
    //     None,
    //     None,
    //     &[seeds],
    // )?;

    ctx.accounts.deal.feed_scheduled = true;

    Ok(())
}
