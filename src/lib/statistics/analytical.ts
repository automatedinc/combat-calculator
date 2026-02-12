import type { CombatConfig } from '@/lib/engine/types';
import type { DiceValue } from '@/types/weapon';
import { getWoundThreshold } from '@/lib/engine/woundRoll';

function expectedDiceValue(value: DiceValue): number {
  if (typeof value === 'number') return value;
  const avg = value.dice === 6 ? 3.5 : 2;
  return avg + (value.modifier ?? 0);
}

function probOfRolling(threshold: number): number {
  const clamped = Math.max(2, Math.min(7, threshold));
  if (clamped > 6) return 0;
  return (7 - clamped) / 6;
}

export function calculateExpectedDamage(config: CombatConfig): {
  expectedHits: number;
  expectedWounds: number;
  expectedUnsaved: number;
  expectedDamage: number;
  expectedModelsKilled: number;
} {
  const { weapon, modelCount } = config.attacker;
  const { profile } = config.defender;

  // Expected attacks
  const attacksPerModel = expectedDiceValue(weapon.attacks);
  const totalAttacks = attacksPerModel * modelCount;

  // Expected hits
  const hitProb = probOfRolling(weapon.skill);
  const expectedHits = totalAttacks * hitProb;

  // Expected wounds
  const woundThreshold = getWoundThreshold(weapon.strength, profile.toughness);
  const woundProb = probOfRolling(woundThreshold);
  const expectedWounds = expectedHits * woundProb;

  // Expected failed saves
  const ap = weapon.armorPenetration;
  const modifiedSave = profile.save + ap;
  const effectiveSave = profile.invulnerableSave
    ? Math.min(modifiedSave, profile.invulnerableSave)
    : modifiedSave;
  const saveProb = probOfRolling(effectiveSave);
  const failProb = 1 - saveProb;
  const expectedUnsaved = expectedWounds * failProb;

  // Expected damage
  const damagePerWound = expectedDiceValue(weapon.damage);
  const rawDamage = expectedUnsaved * damagePerWound;

  // FNP reduction
  const fnpProb = profile.feelNoPain ? probOfRolling(profile.feelNoPain) : 0;
  const expectedDamage = rawDamage * (1 - fnpProb);

  // Approximate models killed (doesn't account for overkill waste)
  const expectedModelsKilled = Math.min(
    config.defender.modelCount,
    expectedDamage / profile.wounds
  );

  return {
    expectedHits,
    expectedWounds,
    expectedUnsaved,
    expectedDamage,
    expectedModelsKilled,
  };
}
