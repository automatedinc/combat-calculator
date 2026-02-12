import type { HitResult, CombatLogEntry } from '@/types/combat';
import type { CombatConfig, PhaseModifiers } from './types';
import { rollD6, resolveDiceValue, type RNG } from './dice';

export function resolveHits(
  config: CombatConfig,
  modifiers: PhaseModifiers,
  log: CombatLogEntry[],
  rng: RNG = Math.random
): HitResult {
  const { weapon, modelCount } = config.attacker;

  // Resolve number of attacks
  let baseAttacks = resolveDiceValue(weapon.attacks, rng);
  const totalAttacksPerModel = baseAttacks + modifiers.extraAttacks;
  const totalAttacks = totalAttacksPerModel * modelCount;

  log.push({
    phase: 'hit',
    description: `${modelCount} model(s) firing ${totalAttacksPerModel} attack(s) each = ${totalAttacks} total attacks`,
    success: true,
  });

  // Torrent: auto-hit, skip rolling
  if (modifiers.autoHit) {
    log.push({
      phase: 'hit',
      description: `Torrent: all ${totalAttacks} attacks auto-hit`,
      success: true,
      abilityTriggered: 'TORRENT',
    });
    return {
      diceRolled: 0,
      rolls: [],
      successes: totalAttacks,
      criticals: 0,
      threshold: 0,
      sustainedHits: 0,
      lethalHits: 0,
      totalHits: totalAttacks,
    };
  }

  // Roll to hit
  const threshold = Math.max(2, Math.min(6, weapon.skill - modifiers.hitModifier));
  const rolls: number[] = [];
  let successes = 0;
  let criticals = 0;
  let sustainedHits = 0;
  let lethalHits = 0;

  for (let i = 0; i < totalAttacks; i++) {
    const roll = rollD6(rng);
    rolls.push(roll);
    const unmodifiedRoll = roll;
    const isCritical = unmodifiedRoll >= modifiers.criticalHitOn;

    // Unmodified 1 always fails
    if (unmodifiedRoll === 1) {
      log.push({
        phase: 'hit',
        description: `Hit roll: ${roll} (need ${threshold}+) - MISS (natural 1)`,
        roll,
        threshold,
        success: false,
      });
      continue;
    }

    const modifiedRoll = roll + modifiers.hitModifier;
    const isHit = isCritical || modifiedRoll >= threshold;

    if (isHit) {
      successes++;

      if (isCritical) {
        criticals++;

        // Sustained Hits: generate extra hits on crits
        if (modifiers.sustainedHitsValue > 0) {
          sustainedHits += modifiers.sustainedHitsValue;
          log.push({
            phase: 'hit',
            description: `Hit roll: ${roll} (need ${threshold}+) - CRITICAL HIT! Sustained Hits +${modifiers.sustainedHitsValue}`,
            roll,
            threshold,
            success: true,
            isCritical: true,
            abilityTriggered: 'SUSTAINED_HITS',
          });
        }

        // Lethal Hits: crits auto-wound
        if (modifiers.hasLethalHits) {
          lethalHits++;
          log.push({
            phase: 'hit',
            description: `Hit roll: ${roll} (need ${threshold}+) - CRITICAL HIT! Lethal Hit (auto-wound)`,
            roll,
            threshold,
            success: true,
            isCritical: true,
            abilityTriggered: 'LETHAL_HITS',
          });
        }

        if (!modifiers.hasLethalHits && modifiers.sustainedHitsValue === 0) {
          log.push({
            phase: 'hit',
            description: `Hit roll: ${roll} (need ${threshold}+) - CRITICAL HIT!`,
            roll,
            threshold,
            success: true,
            isCritical: true,
          });
        }
      } else {
        log.push({
          phase: 'hit',
          description: `Hit roll: ${roll} (need ${threshold}+) - HIT`,
          roll,
          threshold,
          success: true,
        });
      }
    } else {
      log.push({
        phase: 'hit',
        description: `Hit roll: ${roll} (need ${threshold}+) - MISS`,
        roll,
        threshold,
        success: false,
      });
    }
  }

  const totalHits = successes + sustainedHits;

  log.push({
    phase: 'hit',
    description: `Hit phase complete: ${successes} hits + ${sustainedHits} sustained = ${totalHits} total (${lethalHits} lethal)`,
    success: true,
  });

  return {
    diceRolled: totalAttacks,
    rolls,
    successes,
    criticals,
    threshold,
    sustainedHits,
    lethalHits,
    totalHits,
  };
}
