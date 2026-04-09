pub mod constants;
pub mod error;
pub mod events;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use error::*;
pub use events::*;
pub use instructions::*;
pub use state::*;

declare_id!("Fz4KqVayYMmRyToZxJzErd9qRsnh8Bdq84yicvhv4114");

#[program]
pub mod consol {
    use super::*;

    pub fn create_group(ctx: Context<CreateGroup>, params: CreateGroupParams) -> Result<()> {
        handle_create_group(ctx, params)
    }

    pub fn join_group(ctx: Context<JoinGroup>) -> Result<()> {
        handle_join_group(ctx)
    }

    pub fn leave_group(ctx: Context<LeaveGroup>) -> Result<()> {
        handle_leave_group(ctx)
    }

    pub fn activate_group(ctx: Context<ActivateGroup>) -> Result<()> {
        handle_activate_group(ctx)
    }
}
