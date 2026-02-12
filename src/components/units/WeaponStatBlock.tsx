'use client';

import type { Weapon } from '@/types/weapon';
import { formatDiceValue } from '@/lib/engine/dice';
import { AbilityTag } from '@/components/shared/AbilityTag';

interface WeaponStatBlockProps {
  weapon: Weapon;
  compact?: boolean;
}

export function WeaponStatBlock({ weapon, compact }: WeaponStatBlockProps) {
  if (compact) {
    return (
      <div className="text-xs text-muted-foreground">
        {weapon.name} — A{formatDiceValue(weapon.attacks)} S{weapon.strength} AP-
        {weapon.armorPenetration} D{formatDiceValue(weapon.damage)}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold">{weapon.name}</span>
        <span className="text-xs text-muted-foreground uppercase">
          {weapon.type === 'ranged' ? `${weapon.range}"` : 'Melee'}
        </span>
      </div>
      <div className="grid grid-cols-5 gap-1 text-center text-xs">
        <div className="rounded bg-muted/50 px-1 py-0.5">
          <div className="text-[10px] text-muted-foreground">A</div>
          <div className="font-semibold">{formatDiceValue(weapon.attacks)}</div>
        </div>
        <div className="rounded bg-muted/50 px-1 py-0.5">
          <div className="text-[10px] text-muted-foreground">BS/WS</div>
          <div className="font-semibold">{weapon.skill}+</div>
        </div>
        <div className="rounded bg-muted/50 px-1 py-0.5">
          <div className="text-[10px] text-muted-foreground">S</div>
          <div className="font-semibold">{weapon.strength}</div>
        </div>
        <div className="rounded bg-muted/50 px-1 py-0.5">
          <div className="text-[10px] text-muted-foreground">AP</div>
          <div className="font-semibold">
            {weapon.armorPenetration > 0 ? `-${weapon.armorPenetration}` : '0'}
          </div>
        </div>
        <div className="rounded bg-muted/50 px-1 py-0.5">
          <div className="text-[10px] text-muted-foreground">D</div>
          <div className="font-semibold">{formatDiceValue(weapon.damage)}</div>
        </div>
      </div>
      {weapon.abilities.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {weapon.abilities.map((a, i) => (
            <AbilityTag key={i} ability={a} />
          ))}
        </div>
      )}
    </div>
  );
}
