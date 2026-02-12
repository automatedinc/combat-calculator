'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Weapon } from '@/types/weapon';
import { formatDiceValue } from '@/lib/engine/dice';

interface WeaponSelectorProps {
  weapons: Weapon[];
  value: string | undefined;
  onSelect: (weapon: Weapon) => void;
}

export function WeaponSelector({ weapons, value, onSelect }: WeaponSelectorProps) {
  return (
    <Select
      value={value}
      onValueChange={(id) => {
        const weapon = weapons.find((w) => w.id === id);
        if (weapon) onSelect(weapon);
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a weapon..." />
      </SelectTrigger>
      <SelectContent>
        {weapons.map((w) => (
          <SelectItem key={w.id} value={w.id}>
            <span className="flex items-center gap-2">
              <span>{w.name}</span>
              <span className="text-xs text-muted-foreground">
                ({w.type === 'melee' ? 'Melee' : `${w.range}"`} A{formatDiceValue(w.attacks)} S{w.strength})
              </span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
