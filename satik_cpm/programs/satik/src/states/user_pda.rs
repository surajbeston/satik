use switchboard_solana::prelude::*;

#[account]
pub struct UserPDA {
    pub bump: u8,
}

impl UserPDA {
    pub const SEED: &'static [u8] = b"user_pda_seed";
}
