use anchor_lang::prelude::*;

pub mod instructions;
pub mod states;
pub mod types;

use instructions::*;
use states::{ApiFeedData, CreateDealData};

declare_id!("8Vr9DzSPk98B21qPmFba2mzb75kbTcmUF86YoBwmBxhp");

#[program]
pub mod satik {

    use super::*;

    pub fn create_deal(ctx: Context<CreateDeal>, data: CreateDealData) -> Result<()> {
        handle_create_deal(ctx, data)
    }

    pub fn schedule_feed(ctx: Context<ScheduleFeed>) -> Result<()> {
        handle_schedule_feed(ctx)
    }

    pub fn scheduled_callback(ctx: Context<ScheduledCallback>, data: ApiFeedData) -> Result<()> {
        handle_scheduled_callback(ctx, data)
    }
}
