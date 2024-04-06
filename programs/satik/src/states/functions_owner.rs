use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct FunctionsOwner {
    bump: u8,
}
impl FunctionsOwner {
    pub const SEED: &'static [u8] = b"functions_owner";
}
