import type { SaveResult, WoundResult, CombatLogEntry } from '@/types/combat';
import type { CombatConfig, PhaseModifiers } from './types';
import { rollD6, type RNG } from './dice';

export function resolveSaves(
  config: CombatConfig,
  woundResult: WoundResult,
  modifiers: PhaseModifiers,
  log: CombatLogEntry[],
  rng: RNG = Math.random
): SaveResult {
  const { save, invulnerableSave } = config.defender.profile;
  const ap = config.attacker.weapon.armorPenetration;

  // Modified armor save = save + AP (AP is stored as positive, e.g., AP-2 = 2)
  const modifiedArmorSave = save + ap;

  // Cover: -1 to AP effectively (improve save by 1) if not ignoring cover
  const coverBonus = config.defender.hasCover && !modifiers.ignoresCover ? 1 : 0;
  const armorSaveWithCover = modifiedArmorSave - coverBonus;

  // Best save is the lower of modified armor or invuln (invuln is never modified by AP)
  const effectiveSave = invulnerableSave
    ? Math.min(armorSaveWithCover, invulnerableSave)
    : armorSaveWithCover;

  // Clamp to 2+ minimum (can't save on 1)
  const threshold = Math.max(2, Math.min(7, effectiveSave));

  // Wounds that need saving = total wounds minus devastating wounds (those bypass saves)
  const woundsToSave = woundResult.totalWounds - woundResult.devastatingWounds;

  const usingInvuln = invulnerableSave !== undefined && invulnerableSave < armorSaveWithCover;

  log.push({
    phase: 'save',
    description: `Save phase: ${woundsToSave} wounds to save at ${threshold}+ (Sv${save} ${ap > 0 ? `+ AP${ap}` : ''}${coverBonus ? ' - cover' : ''}${usingInvuln ? `, using ${invulnerableSave}+ invuln` : ''}). ${woundResult.devastatingWounds} devastating wounds bypass saves.`,
    success: true,
  });

  const rolls: number[] = [];
  let successes = 0;
  let criticals = 0;
  let failedSaves = 0;

  for (let i = 0; i < woundsToSave; i++) {
    const roll = rollD6(rng);
    rolls.push(roll);

    // Unmodified 1 always fails saves
    if (roll === 1) {
      failedSaves++;
      log.push({
        phase: 'save',
        description: `Save roll: ${roll} (need ${threshold}+) - FAILED (natural 1)`,
        roll,
        threshold,
        success: false,
      });
      continue;
    }

    const isSaved = roll >= threshold;

    if (isSaved) {
      successes++;
      if (roll === 6) criticals++;
      log.push({
        phase: 'save',
        description: `Save roll: ${roll} (need ${threshold}+) - SAVED`,
        roll,
        threshold,
        success: true,
      });
    } else {
      failedSaves++;
      log.push({
        phase: 'save',
        description: `Save roll: ${roll} (need ${threshold}+) - FAILED`,
        roll,
        threshold,
        success: false,
      });
    }
  }

  log.push({
    phase: 'save',
    description: `Save phase complete: ${successes} saved, ${failedSaves} failed + ${woundResult.devastatingWounds} devastating = ${failedSaves + woundResult.devastatingWounds} unsaved wounds`,
    success: true,
  });

  return {
    diceRolled: woundsToSave,
    rolls,
    successes,
    criticals,
    threshold,
    failedSaves,
  };
}
