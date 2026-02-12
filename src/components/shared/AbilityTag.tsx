'use client';

import type { WeaponAbility } from '@/types/abilities';
import { Badge } from '@/components/ui/badge';

function abilityLabel(ability: WeaponAbility): string {
  switch (ability.type) {
    case 'LETHAL_HITS': return 'Lethal Hits';
    case 'SUSTAINED_HITS': return `Sustained Hits ${ability.value}`;
    case 'DEVASTATING_WOUNDS': return 'Devastating Wounds';
    case 'TWIN_LINKED': return 'Twin-linked';
    case 'TORRENT': return 'Torrent';
    case 'BLAST': return 'Blast';
    case 'HEAVY': return 'Heavy';
    case 'RAPID_FIRE': return `Rapid Fire ${ability.value}`;
    case 'ASSAULT': return 'Assault';
    case 'PISTOL': return 'Pistol';
    case 'ANTI': return `Anti-${ability.keyword} ${ability.value}+`;
    case 'MELTA': return `Melta ${ability.value}`;
    case 'LANCE': return 'Lance';
    case 'IGNORES_COVER': return 'Ignores Cover';
    case 'PRECISION': return 'Precision';
    case 'HAZARDOUS': return 'Hazardous';
    case 'INDIRECT_FIRE': return 'Indirect Fire';
    case 'EXTRA_ATTACKS': return `Extra Attacks ${ability.value}`;
  }
}

interface AbilityTagProps {
  ability: WeaponAbility;
}

export function AbilityTag({ ability }: AbilityTagProps) {
  return (
    <Badge variant="secondary" className="text-[10px] font-medium">
      {abilityLabel(ability)}
    </Badge>
  );
}
