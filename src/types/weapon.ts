import type { WeaponAbility } from './abilities';

export type WeaponType = 'ranged' | 'melee';

export type DiceValue =
  | number
  | { dice: 3 | 6; modifier?: number };

export interface Weapon {
  id: string;
  name: string;
  type: WeaponType;
  range: number;
  attacks: DiceValue;
  skill: number;
  strength: number;
  armorPenetration: number;
  damage: DiceValue;
  abilities: WeaponAbility[];
}
