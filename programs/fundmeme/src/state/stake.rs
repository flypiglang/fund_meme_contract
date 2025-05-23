use anchor_lang::prelude::*;

#[account]
pub struct PorkStake {
  pub total_amount: u64,
  pub bump: u8,
}

impl PorkStake {
  pub const LEN: usize = 8 + 8 + 1;
}