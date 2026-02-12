import type { CombatResult, CombatLogEntry } from '@/types/combat';
import type { CombatConfig } from './types';
import { computeModifiers } from './abilities';
import { resolveHits } from './hitRoll';
import { resolveWounds } from './woundRoll';
import { resolveSaves } from './saveRoll';
import { allocateDamage } from './damageAllocation';
import { resolveFeelNoPain } from './feelNoPain';
import type { RNG } from './dice';

export function resolveCombat(
  config: CombatConfig,
  rng: RNG = Math.random
): CombatResult {
  const log: CombatLogEntry[] = [];
  const modifiers = computeModifiers(config);

  // 1. Hit Roll Phase
  const hits = resolveHits(config, modifiers, log, rng);

  // 2. Wound Roll Phase
  const wounds = resolveWounds(config, hits, modifiers, log, rng);

  // 3. Save Roll Phase
  const saves = resolveSaves(config, wounds, modifiers, log, rng);

  // 4. Damage Allocation Phase
  const damageBeforeFnp = allocateDamage(config, saves, wounds, modifiers, log, rng);

  // 5. Feel No Pain Phase
  const damage = resolveFeelNoPain(config, damageBeforeFnp, log, rng);

  return { hits, wounds, saves, damage, log };
}

export type { CombatConfig } from './types';
