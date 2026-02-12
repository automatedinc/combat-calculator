import type { DiceValue } from '@/types/weapon';

export type RNG = () => number;

export function rollD6(rng: RNG = Math.random): number {
  return Math.floor(rng() * 6) + 1;
}

export function rollD3(rng: RNG = Math.random): number {
  return Math.floor(rng() * 3) + 1;
}

export function rollMultiple(count: number, sides: 6 | 3 = 6, rng: RNG = Math.random): number[] {
  return Array.from({ length: count }, () =>
    sides === 6 ? rollD6(rng) : rollD3(rng)
  );
}

export function resolveDiceValue(value: DiceValue, rng: RNG = Math.random): number {
  if (typeof value === 'number') return value;
  const roll = value.dice === 6 ? rollD6(rng) : rollD3(rng);
  return Math.max(1, roll + (value.modifier ?? 0));
}

export function formatDiceValue(value: DiceValue): string {
  if (typeof value === 'number') return String(value);
  const diceStr = value.dice === 6 ? 'D6' : 'D3';
  if (value.modifier && value.modifier > 0) return `${diceStr}+${value.modifier}`;
  if (value.modifier && value.modifier < 0) return `${diceStr}${value.modifier}`;
  return diceStr;
}
