import type { WoundResult, HitResult, CombatLogEntry } from '@/types/combat';
import type { CombatConfig, PhaseModifiers } from './types';
import { rollD6, type RNG } from './dice';

export function getWoundThreshold(strength: number, toughness: number): number {
  if (strength >= toughness * 2) return 2;
  if (strength > toughness) return 3;
  if (strength === toughness) return 4;
  if (strength * 2 <= toughness) return 6;
  return 5;
}

export function resolveWounds(
  config: CombatConfig,
  hitResult: HitResult,
  modifiers: PhaseModifiers,
  log: CombatLogEntry[],
  rng: RNG = Math.random
): WoundResult {
  const { weapon } = config.attacker;
  const { toughness } = config.defender.profile;

  const baseThreshold = getWoundThreshold(weapon.strength, toughness);
  const threshold = Math.max(2, Math.min(6, baseThreshold - modifiers.woundModifier));

  // Wounds to roll = total hits minus lethal hits (those auto-wound)
  const woundsToRoll = hitResult.totalHits - hitResult.lethalHits;

  log.push({
    phase: 'wound',
    description: `Wound phase: S${weapon.strength} vs T${toughness} = ${threshold}+ to wound. Rolling for ${woundsToRoll} hits (${hitResult.lethalHits} auto-wound from Lethal Hits)`,
    success: true,
  });

  const rolls: number[] = [];
  let successes = 0;
  let criticals = 0;
  let devastatingWounds = 0;

  for (let i = 0; i < woundsToRoll; i++) {
    let roll = rollD6(rng);
    rolls.push(roll);
    const unmodifiedRoll = roll;

    // Unmodified 1 always fails
    if (unmodifiedRoll === 1) {
      // Twin-linked: reroll failed wound rolls
      if (modifiers.rerollWounds) {
        roll = rollD6(rng);
        rolls.push(roll);
        if (roll === 1) {
          log.push({
            phase: 'wound',
            description: `Wound roll: 1 → reroll (Twin-linked): ${roll} (need ${threshold}+) - FAIL`,
            roll,
            threshold,
            success: false,
            abilityTriggered: 'TWIN_LINKED',
          });
          continue;
        }
        const rerollCritical = roll >= modifiers.criticalWoundOn;
        const rerollSuccess = rerollCritical || roll >= threshold;
        if (rerollSuccess) {
          successes++;
          if (rerollCritical) {
            criticals++;
            if (modifiers.hasDevastatingWounds) {
              devastatingWounds++;
              log.push({
                phase: 'wound',
                description: `Wound roll: 1 → reroll (Twin-linked): ${roll} (need ${threshold}+) - CRITICAL WOUND! Devastating Wound!`,
                roll,
                threshold,
                success: true,
                isCritical: true,
                abilityTriggered: 'DEVASTATING_WOUNDS',
              });
            } else {
              log.push({
                phase: 'wound',
                description: `Wound roll: 1 → reroll (Twin-linked): ${roll} (need ${threshold}+) - CRITICAL WOUND!`,
                roll,
                threshold,
                success: true,
                isCritical: true,
              });
            }
          } else {
            log.push({
              phase: 'wound',
              description: `Wound roll: 1 → reroll (Twin-linked): ${roll} (need ${threshold}+) - WOUND`,
              roll,
              threshold,
              success: true,
              abilityTriggered: 'TWIN_LINKED',
            });
          }
        } else {
          log.push({
            phase: 'wound',
            description: `Wound roll: 1 → reroll (Twin-linked): ${roll} (need ${threshold}+) - FAIL`,
            roll,
            threshold,
            success: false,
          });
        }
        continue;
      }

      log.push({
        phase: 'wound',
        description: `Wound roll: ${roll} (need ${threshold}+) - FAIL (natural 1)`,
        roll,
        threshold,
        success: false,
      });
      continue;
    }

    const isCritical = unmodifiedRoll >= modifiers.criticalWoundOn;
    const isWound = isCritical || roll >= threshold;

    if (!isWound) {
      // Twin-linked reroll
      if (modifiers.rerollWounds) {
        roll = rollD6(rng);
        rolls.push(roll);
        const rerollCritical = roll >= modifiers.criticalWoundOn;
        const rerollSuccess = rerollCritical || (roll !== 1 && roll >= threshold);
        if (rerollSuccess) {
          successes++;
          if (rerollCritical && roll !== 1) {
            criticals++;
            if (modifiers.hasDevastatingWounds) {
              devastatingWounds++;
            }
          }
          log.push({
            phase: 'wound',
            description: `Wound roll: ${unmodifiedRoll} → reroll (Twin-linked): ${roll} (need ${threshold}+) - ${rerollCritical && roll !== 1 ? 'CRITICAL WOUND!' : 'WOUND'}`,
            roll,
            threshold,
            success: true,
            abilityTriggered: 'TWIN_LINKED',
          });
        } else {
          log.push({
            phase: 'wound',
            description: `Wound roll: ${unmodifiedRoll} → reroll (Twin-linked): ${roll} (need ${threshold}+) - FAIL`,
            roll,
            threshold,
            success: false,
          });
        }
        continue;
      }

      log.push({
        phase: 'wound',
        description: `Wound roll: ${roll} (need ${threshold}+) - FAIL`,
        roll,
        threshold,
        success: false,
      });
      continue;
    }

    successes++;

    if (isCritical) {
      criticals++;
      if (modifiers.hasDevastatingWounds) {
        devastatingWounds++;
        log.push({
          phase: 'wound',
          description: `Wound roll: ${roll} (need ${threshold}+) - CRITICAL WOUND! Devastating Wound (bypasses saves)!`,
          roll,
          threshold,
          success: true,
          isCritical: true,
          abilityTriggered: 'DEVASTATING_WOUNDS',
        });
      } else {
        log.push({
          phase: 'wound',
          description: `Wound roll: ${roll} (need ${threshold}+) - CRITICAL WOUND!`,
          roll,
          threshold,
          success: true,
          isCritical: true,
        });
      }
    } else {
      log.push({
        phase: 'wound',
        description: `Wound roll: ${roll} (need ${threshold}+) - WOUND`,
        roll,
        threshold,
        success: true,
      });
    }
  }

  // Add lethal hits as auto-wounds (they don't go through wound roll, can't be devastating)
  const totalWounds = successes + hitResult.lethalHits;

  log.push({
    phase: 'wound',
    description: `Wound phase complete: ${successes} wounds + ${hitResult.lethalHits} lethal = ${totalWounds} total (${devastatingWounds} devastating)`,
    success: true,
  });

  return {
    diceRolled: woundsToRoll,
    rolls,
    successes,
    criticals,
    threshold,
    devastatingWounds,
    totalWounds,
  };
}
