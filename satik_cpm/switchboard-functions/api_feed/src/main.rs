mod errors;
mod models;
mod types;

use ::borsh::{self, BorshDeserialize};
use errors::CustomError;
use reqwest;
use std::sync::Arc;
use tokio;

use models::{ApiFeedData, SbApiFeedParams};
use switchboard_solana::prelude::*;

#[tokio::main]
pub async fn get_data_from_url(url: String) -> Result<ApiFeedData, CustomError> {
    let res = reqwest::get(url)
        .await
        .map_err(|_| CustomError::FetchError)?;
    let api_feed_data = ApiFeedData { reach: 2_458 };
    Ok(api_feed_data)
}

#[switchboard_function]
pub async fn sb_api_feed_function(
    runner: Arc<FunctionRunner>,
    params: Vec<u8>,
) -> Result<Vec<Instruction>, SbFunctionError> {
    let params: SbApiFeedParams =
        SbApiFeedParams::try_from_slice(&params).map_err(|_| CustomError::ParseError)?;

    let api_feed_data = get_data_from_url(params.url)?;
    let ix = Instruction {
        program_id: Pubkey::new_from_array(params.program_id),
        accounts: vec![
            AccountMeta::new_readonly(runner.function, false),
            AccountMeta::new_readonly(runner.function_routine_key.unwrap(), false),
            AccountMeta::new_readonly(runner.signer, true),
        ],
        data: borsh::to_vec(&api_feed_data).map_err(|_| CustomError::ParseError)?,
    };

    Ok(vec![ix])
}
