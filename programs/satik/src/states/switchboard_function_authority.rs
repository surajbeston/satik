use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct SwitchboardFunctionAuthority {
    pub bump: u8,
    #[max_len(50)]
    pub name: String,
    pub function: Pubkey,
    pub escrow_wallet: Pubkey,
    pub escrow_token_wallet: Pubkey,
}
impl SwitchboardFunctionAuthority {
    pub const SEED: &'static [u8] = b"switchboard_function_authority";
}
