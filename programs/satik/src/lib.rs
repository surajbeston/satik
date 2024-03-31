use anchor_lang::prelude::*;

// use anchor_lang::solana_program::clock;

mod instructions;
use instructions::affiliate_instructions::*;

mod states;

declare_id!("5yGpHM8VQdAcw4tPYe8aS7asnsxeJgd5mfzFABD441cB");

#[program]
pub mod satik {
    use super::*;

    pub fn initialize_brand(ctx: Context<InitializeBrand>, username: String, name: String, profile_image: String,  bio: String)  -> Result<()> {
        let brand = &mut ctx.accounts.brand;
        brand.name = name;
        brand.profile_image = profile_image;
        brand.username = username;
        brand.bio = bio;
        brand.created_by = ctx.accounts.signer.key();

        Ok(())
    }

    pub fn initialize_influencer(ctx: Context<InitializeInfluencer>, username: String, name: String, profile_image: String,  bio: String)  -> Result<()> {
        let influencer = &mut ctx.accounts.influencer;
        influencer.name = name;
        influencer.profile_image = profile_image;
        influencer.username = username;
        influencer.bio = bio;
        influencer.created_by = ctx.accounts.signer.key();
        
        Ok(())

    }

    pub fn initialize_proposal(ctx: Context<InitializeProposal>, website: String, message: String) -> Result<()>{
        require_keys_eq!(ctx.accounts.brand.created_by, ctx.accounts.signer.key());
        let proposal = &mut ctx.accounts.proposal;
        proposal.website = website;
        proposal.message = message;
        proposal.influencer_key = ctx.accounts.influencer.created_by;
        proposal.brand = ctx.accounts.brand.key();
        proposal.created_by = ctx.accounts.signer.key();
        proposal.accepted = false;

        Ok(())
    }

    pub fn initialize_product(ctx: Context<InitializeProduct>, name: String, description: String, total_amount: u64, influencer_amount: u64) -> Result<()> {
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
        require_keys_eq!(ctx.accounts.signer.key(), ctx.accounts.proposal.influencer_key);
        let proposal = &mut ctx.accounts.proposal;
        proposal.accepted = true;

        Ok(())
    }

}

