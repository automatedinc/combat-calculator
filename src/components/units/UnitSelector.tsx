'use client';

import { useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { allUnits } from '@/data/units';
import { factions } from '@/data/factions';
import type { Unit } from '@/types/unit';

interface UnitSelectorProps {
  value: string | undefined;
  onSelect: (unit: Unit) => void;
  label?: string;
}

export function UnitSelector({ value, onSelect, label }: UnitSelectorProps) {
  const grouped = useMemo(() => {
    const map = new Map<string, Unit[]>();
    for (const unit of allUnits) {
      const list = map.get(unit.factionId) || [];
      list.push(unit);
      map.set(unit.factionId, list);
    }
    return map;
  }, []);

  return (
    <Select
      value={value}
      onValueChange={(id) => {
        const unit = allUnits.find((u) => u.id === id);
        if (unit) onSelect(unit);
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={label ?? 'Select a unit...'} />
      </SelectTrigger>
      <SelectContent>
        {factions.map((faction) => {
          const units = grouped.get(faction.id);
          if (!units || units.length === 0) return null;
          return (
            <SelectGroup key={faction.id}>
              <SelectLabel className="font-bold" style={{ color: faction.color }}>
                {faction.name}
              </SelectLabel>
              {units.map((unit) => (
                <SelectItem key={unit.id} value={unit.id}>
                  {unit.name}
                </SelectItem>
              ))}
            </SelectGroup>
          );
        })}
      </SelectContent>
    </Select>
  );
}
