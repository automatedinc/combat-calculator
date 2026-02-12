import type { DamageResult, CombatLogEntry } from '@/types/combat';
import type { CombatConfig } from './types';
import { rollD6, type RNG } from './dice';

export function resolveFeelNoPain(
  config: CombatConfig,
  damageResult: DamageResult,
  log: CombatLogEntry[],
  rng: RNG = Math.random
): DamageResult {
  const fnpValue = config.defender.profile.feelNoPain;

  if (!fnpValue || damageResult.totalDamage === 0) {
    return damageResult;
  }

  log.push({
    phase: 'fnp',
    description: `Feel No Pain phase: Rolling ${fnpValue}+ for each of ${damageResult.totalDamage} damage points`,
    success: true,
  });

  let damageIgnored = 0;

  for (let i = 0; i < damageResult.totalDamage; i++) {
    const roll = rollD6(rng);
    const ignored = roll >= fnpValue;

    if (ignored) {
      damageIgnored++;
      log.push({
        phase: 'fnp',
        description: `FNP roll: ${roll} (need ${fnpValue}+) - IGNORED`,
        roll,
        threshold: fnpValue,
        success: true,
      });
    } else {
      log.push({
        phase: 'fnp',
        description: `FNP roll: ${roll} (need ${fnpValue}+) - DAMAGE TAKEN`,
        roll,
        threshold: fnpValue,
        success: false,
      });
    }
  }

  const damageAfterFnp = damageResult.totalDamage - damageIgnored;

  // Recalculate models killed based on damage after FNP
  // This is a simplification — in practice FNP is per-damage-point as allocated
  // For accurate results we'd need to track per-model, but this gives a good approximation
  const woundsPerModel = config.defender.profile.wounds;
  const modelsKilled = Math.min(
    config.defender.modelCount,
    Math.floor(damageAfterFnp / woundsPerModel)
  );

  log.push({
    phase: 'fnp',
    description: `FNP complete: ${damageIgnored} damage ignored, ${damageAfterFnp} damage after FNP, ~${modelsKilled} models killed`,
    success: true,
  });

  return {
    ...damageResult,
    damageAfterFnp,
    modelsKilled,
  };
}
