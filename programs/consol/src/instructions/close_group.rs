use anchor_lang::prelude::*;

use crate::error::ConsolError;
use crate::events::GroupCompleted;
use crate::state::{ConsorcioGroup, GroupStatus};

/// Finalize a completed group. Can be called by anyone once all rounds are done.
/// The `distribute` instruction already sets status to `Completed` when
/// `members_received >= total_members`, so this is mainly a permissionless
/// fallback for edge cases (e.g., group dissolved due to mass default).
#[derive(Accounts)]
pub struct CloseGroup<'info> {
    pub caller: Signer<'info>,

    #[account(
        mut,
        constraint = group.status == GroupStatus::Active || group.status == GroupStatus::Completed @ ConsolError::InvalidGroupState,
    )]
    pub group: Account<'info, ConsorcioGroup>,
}

pub fn handle_close_group(ctx: Context<CloseGroup>) -> Result<()> {
    let clock = Clock::get()?;
    let group = &mut ctx.accounts.group;

    // Two valid paths to close:
    // 1. All members have received (normal completion)
    // 2. Active members dropped to 0 (everyone defaulted/withdrew — dissolution)
    let can_close = group.members_received >= group.total_members
        || group.active_members == 0;

    require!(can_close, ConsolError::InvalidGroupState);

    group.status = GroupStatus::Completed;

    emit!(GroupCompleted {
        group: group.key(),
        total_rounds: group.current_round,
        insurance_surplus: 0, // calculated in distribute_insurance_surplus
        timestamp: clock.unix_timestamp,
    });

    Ok(())
}
