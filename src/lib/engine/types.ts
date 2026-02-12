import type { Weapon } from '@/types/weapon';
import type { UnitProfile, UnitKeyword } from '@/types/unit';

export interface CombatConfig {
  attacker: {
    weapon: Weapon;
    modelCount: number;
    isStationary: boolean;
    hasCharged: boolean;
    hasAdvanced: boolean;
    withinHalfRange: boolean;
  };
  defender: {
    profile: UnitProfile;
    modelCount: number;
    keywords: UnitKeyword[];
    hasLineOfSight: boolean;
    hasCover: boolean;
  };
}

export interface PhaseModifiers {
  hitModifier: number;
  autoHit: boolean;
  rerollHitOnes: boolean;
  rerollAllHits: boolean;
  rerollWounds: boolean;
  woundModifier: number;
  criticalHitOn: number;
  criticalWoundOn: number;
  extraAttacks: number;
  sustainedHitsValue: number;
  hasLethalHits: boolean;
  hasDevastatingWounds: boolean;
  ignoresCover: boolean;
  meltaBonus: number;
}
