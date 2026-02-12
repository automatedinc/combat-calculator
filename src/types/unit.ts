import type { FactionId } from './faction';
import type { Weapon } from './weapon';

export type UnitKeyword =
  | 'INFANTRY'
  | 'MONSTER'
  | 'VEHICLE'
  | 'CHARACTER'
  | 'PSYKER'
  | 'FLY'
  | 'TITANIC'
  | 'MOUNTED'
  | 'BEAST'
  | 'SWARM'
  | 'DAEMON'
  | 'WALKER'
  | 'BATTLELINE';

export interface UnitProfile {
  movement: number;
  toughness: number;
  save: number;
  wounds: number;
  leadership: number;
  objectiveControl: number;
  invulnerableSave?: number;
  feelNoPain?: number;
}

export interface Unit {
  id: string;
  name: string;
  factionId: FactionId;
  modelCount: number;
  profile: UnitProfile;
  weapons: Weapon[];
  keywords: UnitKeyword[];
  pointsCost?: number;
  abilities?: string[];
}
