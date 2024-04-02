use switchboard_solana::prelude::*;

#[account]
pub struct UserAccount {
    pub bump: u8,
}

impl UserAccount {
    pub const SEED: &'static [u8] = b"user_pda_seed";
}
