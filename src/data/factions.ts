import type { Faction } from '@/types/faction';

export const factions: Faction[] = [
  { id: 'space-marines', name: 'Space Marines', color: '#1E40AF' },
  { id: 'chaos-space-marines', name: 'Chaos Space Marines', color: '#991B1B' },
  { id: 'aeldari', name: 'Aeldari', color: '#065F46' },
  { id: 'orks', name: 'Orks', color: '#3F6212' },
  { id: 'tyranids', name: 'Tyranids', color: '#7C2D12' },
  { id: 'necrons', name: 'Necrons', color: '#525252' },
];

export function getFactionById(id: string): Faction | undefined {
  return factions.find((f) => f.id === id);
}
