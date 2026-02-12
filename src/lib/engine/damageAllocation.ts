import type { DamageResult, SaveResult, WoundResult, CombatLogEntry } from '@/types/combat';
import type { CombatConfig, PhaseModifiers } from './types';
import { resolveDiceValue, type RNG } from './dice';

export function allocateDamage(
  config: CombatConfig,
  saveResult: SaveResult,
  woundResult: WoundResult,
  modifiers: PhaseModifiers,
  log: CombatLogEntry[],
  rng: RNG = Math.random
): DamageResult {
  const { wounds } = config.defender.profile;
  const { weapon } = config.attacker;

  // Track models and their remaining wounds
  const modelWounds: number[] = Array(config.defender.modelCount).fill(wounds);
  let currentModel = 0;
  let totalDamage = 0;
  let modelsKilled = 0;
  let overkillDamage = 0;
  let mortalWounds = 0;

  // Allocate normal (non-devastating) unsaved wounds first
  const normalUnsaved = saveResult.failedSaves;

  log.push({
    phase: 'damage',
    description: `Damage phase: Allocating ${normalUnsaved} unsaved wounds + ${woundResult.devastatingWounds} devastating wounds to ${config.defender.modelCount} models (${wounds}W each)`,
    success: true,
  });

  for (let i = 0; i < normalUnsaved; i++) {
    if (currentModel >= config.defender.modelCount) break;

    let dmg = resolveDiceValue(weapon.damage, rng);
    dmg += modifiers.meltaBonus;

    const actualDamage = Math.min(dmg, modelWounds[currentModel]);
    const wasted = dmg - actualDamage;
    modelWounds[currentModel] -= actualDamage;
    totalDamage += actualDamage;
    overkillDamage += wasted;

    if (modelWounds[currentModel] <= 0) {
      modelsKilled++;
      log.push({
        phase: 'damage',
        description: `Unsaved wound deals ${dmg} damage to model ${currentModel + 1} → MODEL KILLED${wasted > 0 ? ` (${wasted} damage wasted)` : ''}`,
        success: true,
      });
      currentModel++;
    } else {
      log.push({
        phase: 'damage',
        description: `Unsaved wound deals ${dmg} damage to model ${currentModel + 1} (${modelWounds[currentModel]}W remaining)`,
        success: true,
      });
    }
  }

  // Devastating wounds: deal mortal wounds (weapon damage each, excess lost per model)
  for (let i = 0; i < woundResult.devastatingWounds; i++) {
    if (currentModel >= config.defender.modelCount) break;

    let dmg = resolveDiceValue(weapon.damage, rng);
    dmg += modifiers.meltaBonus;
    mortalWounds += dmg;

    const actualDamage = Math.min(dmg, modelWounds[currentModel]);
    const wasted = dmg - actualDamage;
    modelWounds[currentModel] -= actualDamage;
    totalDamage += actualDamage;
    overkillDamage += wasted;

    if (modelWounds[currentModel] <= 0) {
      modelsKilled++;
      log.push({
        phase: 'damage',
        description: `Devastating wound deals ${dmg} mortal wounds to model ${currentModel + 1} → MODEL KILLED${wasted > 0 ? ` (${wasted} damage wasted)` : ''}`,
        success: true,
        abilityTriggered: 'DEVASTATING_WOUNDS',
      });
      currentModel++;
    } else {
      log.push({
        phase: 'damage',
        description: `Devastating wound deals ${dmg} mortal wounds to model ${currentModel + 1} (${modelWounds[currentModel]}W remaining)`,
        success: true,
        abilityTriggered: 'DEVASTATING_WOUNDS',
      });
    }
  }

  log.push({
    phase: 'damage',
    description: `Damage phase complete: ${totalDamage} damage dealt, ${modelsKilled} models killed`,
    success: true,
  });

  return {
    totalDamage,
    damageAfterFnp: totalDamage,
    modelsKilled,
    mortalWounds,
    overkillDamage,
  };
}
