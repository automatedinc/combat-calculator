import { spaceMarineUnits } from './space-marines';
import { chaosSpaceMarineUnits } from './chaos-space-marines';
import { aeldariUnits } from './aeldari';
import { orkUnits } from './orks';
import { tyranidUnits } from './tyranids';
import { necronUnits } from './necrons';
import type { Unit } from '@/types/unit';
import type { FactionId } from '@/types/faction';

export const allUnits: Unit[] = [
  ...spaceMarineUnits,
  ...chaosSpaceMarineUnits,
  ...aeldariUnits,
  ...orkUnits,
  ...tyranidUnits,
  ...necronUnits,
];

export function getUnitsByFaction(factionId: FactionId): Unit[] {
  return allUnits.filter((u) => u.factionId === factionId);
}

export function getUnitById(id: string): Unit | undefined {
  return allUnits.find((u) => u.id === id);
}
