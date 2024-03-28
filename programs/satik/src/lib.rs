use anchor_lang::prelude::*;
use anchor_lang::solana_program::clock;
use anchor_lang::system_program;

use anchor_spl::token::{self, Token, TokenAccount, Transfer as SplTransfer};


declare_id!("BcmqgRT4uiiCq4q64e4vGRyLRSRRV1na3aAkDaq7ABRf");

#[program]
pub mod satik {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, id: Pubkey, amount: u64) -> Result<()> {
        let payment = &mut ctx.accounts.payment;
        payment.id = id;
        payment.amount = amount;

        require_keys_eq!(ctx.accounts.signer.key(), ctx.accounts.sender.key());

        msg!("Signer: {}", ctx.accounts.signer.key());

        payment.timestamp = clock::Clock::get()?.unix_timestamp;

        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(), 
            system_program::Transfer {
                from: ctx.accounts.sender.clone(),
                to: ctx.accounts.recipient.clone(),
            });
        system_program::transfer(cpi_context, ctx.accounts.payment.amount)?;

        Ok(())
    }

    pub fn pay_usdc(ctx: Context<PayUSDC>, id: Pubkey, amount: u64) -> Result<()> {
        let payment = &mut ctx.accounts.payment;
        payment.id = id;
        payment.amount = amount;

        require_keys_eq!(ctx.accounts.signer.key(), ctx.accounts.sender.key());

        let sender = &ctx.accounts.sender;
        let recipient = &ctx.accounts.recipient;
        let sender_ata = &mut ctx.accounts.from_ata;
        let recipient_ata = &mut ctx.accounts.to_ata;
        let cpi_program = &ctx.accounts.token_program;

        let cpi_accounts = SplTransfer {
            from: sender_ata.to_account_info().clone(),
            to: recipient_ata.to_account_info().clone(),
            authority:  sender.to_account_info().clone()
        };

        token::transfer(
            CpiContext::new(cpi_program.to_account_info(), cpi_accounts),
            amount
        )?;

        Ok(())
        
    }
    
}

#[account]
pub struct Payment {
    id: Pubkey,
    amount: u64,
    timestamp: i64
}


#[derive(Accounts)]
#[instruction(id: Pubkey )]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = 200, seeds=[id.to_bytes().as_ref()], bump)]
    pub payment: Account<'info, Payment>,
    /// CHECK: it is just used for receiving amount so, no checks required.
    #[account(mut)]
    pub recipient: AccountInfo<'info>,

    /// CHECK: it is usef for sending amount
    #[account(signer)]
    pub sender: AccountInfo<'info>,

    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(id: Pubkey )]
pub struct PayUSDC<'info> {
    #[account(init, payer = signer, space = 200)]
    pub payment: Account<'info, Payment>,
    /// CHECK: it is just used for receiving amount so, no checks required.
    #[account(mut)]
    recipient: AccountInfo<'info>,

    /// CHECK: it is useful for sending amount
    #[account(signer)] 
    sender: AccountInfo<'info>,

    #[account(mut)]
    pub from_ata: Account<'info, TokenAccount>,

    #[account(mut)]
    pub to_ata: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,

    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}





