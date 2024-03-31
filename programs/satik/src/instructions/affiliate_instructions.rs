use anchor_lang::prelude::*;

use crate::states::*;

#[derive(Accounts)]
#[instruction(username: String)]
pub struct InitializeBrand<'info> {
    #[account(init, payer = signer, space = 800, seeds=[username.as_bytes().as_ref()], bump)]
    pub brand: Account<'info, Brand>,

    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
#[instruction(username: String)]
pub struct InitializeInfluencer<'info> {
    #[account(init, payer = signer, space = 8 + Influencer::INIT_SPACE, seeds=[username.as_bytes().as_ref()], bump)]
    pub influencer: Account<'info, Influencer>,

    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>
}


#[derive(Accounts)]
pub struct  InitializeProposal<'info> {
    #[account(init, payer = signer, space = 8 + Proposal::INIT_SPACE)]
    pub proposal: Account<'info, Proposal>,

    pub brand: Account<'info, Brand>,
    pub influencer: Account<'info, Influencer>,

    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct InitializeProduct<'info> {
    #[account(init, payer = signer, space = 8 + Product::INIT_SPACE)]
    pub product: Account<'info, Product>,

    pub proposal: Account<'info, Proposal>,

    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct AcceptProposal<'info> {
    #[account(mut)]
    pub proposal: Account<'info, Proposal>,

    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>

}