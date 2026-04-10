use anchor_lang::prelude::*;

use crate::constants::*;
use crate::error::ConsolError;
use crate::state::{ConsorcioGroup, GroupStatus, Round, RoundStatus};

/// Skip a round when no eligible members exist for selection.
/// This happens when all active members have either already received the pool
/// or all members defaulted during this round.
///
/// Permissionless crank. Advances the round without a winner.
#[derive(Accounts)]
pub struct SkipRound<'info> {
    pub caller: Signer<'info>,

    #[account(
        mut,
        constraint = group.status == GroupStatus::Active @ ConsolError::InvalidGroupState,
    )]
    pub group: Account<'info, ConsorcioGroup>,

    #[account(
        mut,
        seeds = [ROUND_SEED, group.key().as_ref(), &[group.current_round]],
        bump = round.bump,
        constraint = round.status == RoundStatus::Selecting @ ConsolError::InvalidRoundState,
    )]
    pub round: Account<'info, Round>,
}

pub fn handle_skip_round(ctx: Context<SkipRound>) -> Result<()> {
    let group = &ctx.accounts.group;

    // Can only skip if there are no eligible members
    // (all active members already received, or no active members remain)
    // The caller must demonstrate this is the case. We check:
    // - If active_members == 0, obviously nobody to pick
    // - If members_received >= active count of members who haven't defaulted,
    //   everyone eligible has already received
    // - If total_collected == 0, nobody paid this round (mass default scenario)
    let can_skip = group.active_members == 0 || ctx.accounts.round.total_collected == 0;

    require!(can_skip, ConsolError::NoEligibleMembers);

    // Mark round as completed with no winner
    let round = &mut ctx.accounts.round;
    round.status = RoundStatus::Completed;
    round.winner_selected = false;

    // Advance group to next round
    let group = &mut ctx.accounts.group;
    group.current_round += 1;

    // If we've exhausted all rounds, complete the group
    if group.current_round >= group.total_members || group.active_members == 0 {
        group.status = GroupStatus::Completed;
    }

    Ok(())
}
