use anchor_lang::prelude::*;
use std::str::FromStr;

use anchor_spl::token::{self, Transfer as SplTransfer};
use anchor_spl::token_interface::{transfer_checked, TransferChecked};

pub mod instructions;
pub mod states;
pub mod types;

use instructions::*;
use states::{ApiFeedData, CreateDealData};

use instructions::affiliate_instructions::*;

declare_id!("C86he5HKmQvHpLH2zoZgozwBCm9wkGBYsjBNhmjwNDTU");

#[program]
pub mod satik {

    use super::*;

    pub fn initialize_brand(
        ctx: Context<InitializeBrand>,
        username: String,
        name: String,
        profile_image: String,
        bio: String,
    ) -> Result<()> {
        let brand: &mut Account<'_, states::Brand> = &mut ctx.accounts.brand;
        brand.name = name;
        brand.profile_image = profile_image;
        brand.username = username;
        brand.bio = bio;
        brand.created_by = ctx.accounts.signer.key();
        brand.usdc_ata = ctx.accounts.usdc_ata.key();

        Ok(())
    }

    pub fn initialize_influencer(
        ctx: Context<InitializeInfluencer>,
        username: String,
        name: String,
        profile_image: String,
        bio: String,
        total_followers: u64,
        social_media: String
    ) -> Result<()> {
        let influencer = &mut ctx.accounts.influencer;
        influencer.name = name;
        influencer.profile_image = profile_image;
        influencer.username = username;
        influencer.bio = bio;
        influencer.created_by = ctx.accounts.signer.key();
        influencer.usdc_ata = ctx.accounts.usdc_ata.key();
        influencer.total_followers = total_followers;
        influencer.social_media = social_media;

        Ok(())
    }

    pub fn initialize_proposal(
        ctx: Context<InitializeProposal>,
        message: String,
        redeemer: Pubkey,
        redeemer_url: String
    ) -> Result<()> {
        require_keys_eq!(ctx.accounts.brand.created_by, ctx.accounts.signer.key());
        let proposal = &mut ctx.accounts.proposal;
        proposal.message = message;
        proposal.influencer_key = ctx.accounts.influencer.created_by;
        proposal.brand = ctx.accounts.brand.key();
        proposal.brand_redeemer = redeemer;
        proposal.influencer_ata = ctx.accounts.influencer.usdc_ata;
        proposal.brand_ata = ctx.accounts.brand.usdc_ata;
        proposal.created_by = ctx.accounts.signer.key();
        proposal.accepted = false;
        proposal.datetime = Clock::get()?.unix_timestamp;
        proposal.redeemer_url = redeemer_url;

        Ok(())
    }

    pub fn add_proposal_webpage(ctx: Context<AddWebpage>, webpage: String) -> Result<()> {
        require_keys_eq!(
            ctx.accounts.proposal.created_by,
            ctx.accounts.signer.key(),
            ConstraintErrors::UnexpectedSigner
        );
        let proposal = &mut ctx.accounts.proposal;

        proposal.webpage = webpage;

        Ok(())
    }

    pub fn initialize_product(
        ctx: Context<InitializeProduct>,
        name: String,
        description: String,
        total_amount: u64,
        influencer_amount: u64,
    ) -> Result<()> {
        require_keys_eq!(ctx.accounts.proposal.created_by, ctx.accounts.signer.key());

        let product = &mut ctx.accounts.product;

        let satik_amount = 0;

        require_gte!(total_amount, satik_amount + influencer_amount);

        product.name = name;
        product.description = description;
        product.total_amount = total_amount;
        product.influencer_amount = influencer_amount;
        product.satik_amount = satik_amount;
        product.brand_amount = total_amount - influencer_amount - satik_amount;
        product.proposal = ctx.accounts.proposal.key();

        Ok(())
    }

    pub fn accept_proposal(ctx: Context<AcceptProposal>) -> Result<()> {
        require_keys_eq!(
            ctx.accounts.signer.key(),
            ctx.accounts.proposal.influencer_key
        );
        let proposal = &mut ctx.accounts.proposal;
        proposal.accepted = true;

        Ok(())
    }

    pub fn purchase(ctx: Context<InitializePurchase>, id: String) -> Result<()> {
        let purchase = &mut ctx.accounts.purchase;
        purchase.id = id;

        // checking if product belongs to submitted proposal

        require_keys_eq!(
            ctx.accounts.proposal.key(),
            ctx.accounts.product.proposal,
            ConstraintErrors::UnexpectedProposalError
        );
        // checking if proposal is accepted by influencer
        require_eq!(
            ctx.accounts.proposal.accepted,
            true,
            ConstraintErrors::ProposalNotExpectedError
        );
        // checking is submitted brand token account is brand's actual token account
        require_keys_eq!(
            ctx.accounts.proposal.brand_ata,
            ctx.accounts.brand_ata.key(),
            ConstraintErrors::UnexpectedBrandATAError
        );
        // checking if submitted influencer token account is influencer's actual token account
        require_keys_eq!(
            ctx.accounts.proposal.influencer_ata,
            ctx.accounts.influencer_ata.key(),
            ConstraintErrors::UnexpectedInfluencerError
        );

        let product = &mut ctx.accounts.product;
        let proposal = &mut ctx.accounts.proposal;

        purchase.paid_by = ctx.accounts.signer.key();
        purchase.product = product.key();

        purchase.brand_receiver = proposal.brand_ata;
        purchase.influencer_receiver = proposal.influencer_ata;
        purchase.satik_receiver = 
            Pubkey::from_str("FMzdabL9cxpTTHEgfXD1CXbt5qg8Vijks4c56b4rzdBD").unwrap();
        purchase.redeemer = proposal.brand_redeemer;
        purchase.escrow = ctx.accounts.usdc_token_account.key();
        purchase.total_amount = product.total_amount;
        purchase.satik_amount = product.satik_amount;
        purchase.brand_amount = product.brand_amount;
        purchase.influencer_amount = product.influencer_amount;
        purchase.purchase_datetime = Clock::get()?.unix_timestamp;
        purchase.redeemed = false;

        let signer = &ctx.accounts.signer;

        let cpi_accounts = SplTransfer {
            from: ctx.accounts.customer_ata.to_account_info().clone(),
            to: ctx.accounts.usdc_token_account.to_account_info().clone(),
            authority: signer.to_account_info().clone(),
        };

        let cpi_program = ctx.accounts.token_program.to_account_info();

        token::transfer(
            CpiContext::new(cpi_program, cpi_accounts),
            purchase.total_amount,
        )?;

        Ok(())
    }

    pub fn redeem_amount(ctx: Context<RedeemPurchase>, bump: u8) -> Result<()> {
        // cheking if brand owner is redeemer
        require_keys_eq!(
            ctx.accounts.purchase.redeemer,
            ctx.accounts.signer.key(),
            ConstraintErrors::UnauthorizedRedeemError
        );
        require_keys_eq!(
            ctx.accounts.purchase.brand_receiver,
            ctx.accounts.brand_receiver.key()
        );
        require_keys_eq!(
            ctx.accounts.purchase.influencer_receiver,
            ctx.accounts.influencer_receiver.key()
        );
        // require_keys_eq!(ctx.accounts.purchase.satik_receiver, ctx.accounts.satik_receiver.key());
        require_keys_eq!(ctx.accounts.purchase.escrow, ctx.accounts.escrow.key());
        let redeem_datetime = &mut ctx.accounts.redeem_datetime;

        let purchase = &ctx.accounts.purchase;
        redeem_datetime.redeemed_on = Clock::get()?.unix_timestamp;

        let escrow = ctx.accounts.escrow.clone();
        let influencer_receiver = ctx.accounts.influencer_receiver.clone();
        let brand_receiver = ctx.accounts.brand_receiver.clone();
        let satik_receiver = ctx.accounts.satik_receiver.clone();
        let mint = ctx.accounts.mint.clone();

        let cpi_program = &ctx.accounts.token_program;

        let seeds = &[&purchase.id.as_bytes()[..], &[bump]];

        let signer_seeds = &[&seeds[..]];

        let transfer_accounts_for_brand = TransferChecked {
            from: escrow.to_account_info(),
            to: brand_receiver.to_account_info().clone(),
            authority: ctx.accounts.purchase.to_account_info().clone(),
            mint: ctx.accounts.mint.to_account_info().clone(),
        };

        let ctx = CpiContext::new_with_signer(
            cpi_program.to_account_info(),
            transfer_accounts_for_brand,
            signer_seeds,
        );

        let _ = transfer_checked(ctx, purchase.brand_amount, 6);

        let transfer_accounts_for_influencer = TransferChecked {
            from: escrow.to_account_info(),
            to: influencer_receiver.to_account_info().clone(),
            authority: purchase.to_account_info().clone(),
            mint: mint.to_account_info(),
        };

        let ctx = CpiContext::new_with_signer(
            cpi_program.to_account_info(),
            transfer_accounts_for_influencer,
            signer_seeds,
        );

        let _ = transfer_checked(ctx, purchase.influencer_amount, 6);

        let transfer_accounts_for_mint = TransferChecked {
            from: escrow.to_account_info(),
            to: satik_receiver.to_account_info(),
            authority: purchase.to_account_info(),
            mint: mint.to_account_info(),
        };

        let ctx = CpiContext::new_with_signer(
            cpi_program.to_account_info(),
            transfer_accounts_for_mint,
            signer_seeds,
        );

        let _ = transfer_checked(ctx, purchase.satik_amount, 6);

        Ok(())
    }

    pub fn create_deal(ctx: Context<CreateDeal>, data: CreateDealData) -> Result<()> {
        handle_create_deal(ctx, data)
    }

    pub fn accept_deal(ctx: Context<AcceptDeal>, content_url: String) -> Result<()> {
        handle_accept_deal(ctx, content_url)
    }

    pub fn schedule_feed(ctx: Context<ScheduleFeed>) -> Result<()> {
        handle_schedule_feed(ctx)
    }

    pub fn scheduled_feed_callback(
        ctx: Context<ScheduledFeedCallback>,
        data: ApiFeedData,
    ) -> Result<()> {
        handle_scheduled_feed_callback(ctx, data)
    }
}

#[error_code]
pub enum ConstraintErrors {
    #[msg("Given proposal is not same as given product's proposal")]
    UnexpectedProposalError,
    #[msg("Given brand_ata/brand_receiver is not same as proposal's")]
    UnexpectedBrandATAError,
    #[msg("Given proposal is not expected by influencer")]
    ProposalNotExpectedError,
    #[msg("Given influencer_ata/influencer_receiver is not same as proposal's")]
    UnexpectedInfluencerError,

    #[msg("Balance can only be redeemed by owner")]
    UnauthorizedRedeemError,

    #[msg("Current signer is not proposal's creator")]
    UnexpectedSigner,
}
