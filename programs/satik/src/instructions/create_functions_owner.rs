use anchor_lang::prelude::*;
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

    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handle_create_functions_owner(
    ctx: Context<CreateFunctionsOwner>,
    name: Vec<u8>,
    metadata: Vec<u8>,
    container: Vec<u8>,
    registry: Vec<u8>,
    mr_enclave: Vec<u8>,
) {

    // const function_init = FunctionInit {

    // };
}
