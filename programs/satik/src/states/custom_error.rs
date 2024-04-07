use anchor_lang::error_code;

#[error_code]
pub enum CustomError {
    #[msg("Feed is already scheduled")]
    FeedAlreadyScheduled,
    #[msg("Deal is not yet accepted by Influencer")]
    DealNotAccepted,
    #[msg("Insufficient token balance")]
    InsufficientToken,
    #[msg("Insufficient balance")]
    InsufficientSOL,
}
