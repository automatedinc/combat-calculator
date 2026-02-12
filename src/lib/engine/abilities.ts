import { hasAbility, getAbility } from '@/types/abilities';
import type { CombatConfig, PhaseModifiers } from './types';

export function computeModifiers(config: CombatConfig): PhaseModifiers {
  const { weapon } = config.attacker;
  const abilities = weapon.abilities;

  let hitModifier = 0;
  let woundModifier = 0;
  let extraAttacks = 0;
  const criticalHitOn = 6;
  let criticalWoundOn = 6;

  // Heavy: +1 to hit if remained stationary
  if (hasAbility(abilities, 'HEAVY') && config.attacker.isStationary) {
    hitModifier += 1;
  }

  // Indirect Fire: -1 to hit if no LOS (and no Torrent)
  if (hasAbility(abilities, 'INDIRECT_FIRE') && !config.defender.hasLineOfSight) {
    hitModifier -= 1;
  }

  // Lance: +1 to wound if charged
  if (hasAbility(abilities, 'LANCE') && config.attacker.hasCharged) {
    woundModifier += 1;
  }

  // Blast: +1 attack per 5 models in target unit
  if (hasAbility(abilities, 'BLAST')) {
    extraAttacks += Math.floor(config.defender.modelCount / 5);
  }

  // Rapid Fire: extra shots at half range
  const rapidFire = getAbility(abilities, 'RAPID_FIRE');
  if (rapidFire && config.attacker.withinHalfRange) {
    extraAttacks += rapidFire.value;
  }

  // Anti-keyword: lower critical wound threshold if keyword matches
  const anti = getAbility(abilities, 'ANTI');
  if (anti) {
    const keywordMatch = config.defender.keywords.some(
      (k) => k.toUpperCase() === anti.keyword.toUpperCase()
    );
    if (keywordMatch) {
      criticalWoundOn = Math.min(criticalWoundOn, anti.value);
    }
  }

  // Melta: bonus damage at half range
  const melta = getAbility(abilities, 'MELTA');
  const meltaBonus = melta && config.attacker.withinHalfRange ? melta.value : 0;

  // Sustained Hits value
  const sustained = getAbility(abilities, 'SUSTAINED_HITS');
  const sustainedHitsValue = sustained ? sustained.value : 0;

  return {
    hitModifier,
    autoHit: hasAbility(abilities, 'TORRENT'),
    rerollHitOnes: false,
    rerollAllHits: false,
    rerollWounds: hasAbility(abilities, 'TWIN_LINKED'),
    woundModifier,
    criticalHitOn,
    criticalWoundOn,
    extraAttacks,
    sustainedHitsValue,
    hasLethalHits: hasAbility(abilities, 'LETHAL_HITS'),
    hasDevastatingWounds: hasAbility(abilities, 'DEVASTATING_WOUNDS'),
    ignoresCover: hasAbility(abilities, 'IGNORES_COVER'),
    meltaBonus,
  };
}
