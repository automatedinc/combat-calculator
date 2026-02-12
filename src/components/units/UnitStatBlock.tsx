'use client';

import type { UnitProfile } from '@/types/unit';
import { StatBadge } from '@/components/shared/StatBadge';

interface UnitStatBlockProps {
  profile: UnitProfile;
}

export function UnitStatBlock({ profile }: UnitStatBlockProps) {
  return (
    <div className="flex flex-wrap gap-1">
      <StatBadge label="M" value={`${profile.movement}"`} />
      <StatBadge label="T" value={profile.toughness} />
      <StatBadge label="Sv" value={`${profile.save}+`} />
      <StatBadge label="W" value={profile.wounds} />
      <StatBadge label="Ld" value={`${profile.leadership}+`} />
      <StatBadge label="OC" value={profile.objectiveControl} />
      {profile.invulnerableSave && (
        <StatBadge
          label="Inv"
          value={`${profile.invulnerableSave}+`}
          className="border-yellow-600/50 bg-yellow-950/30"
        />
      )}
      {profile.feelNoPain && (
        <StatBadge
          label="FNP"
          value={`${profile.feelNoPain}+`}
          className="border-green-600/50 bg-green-950/30"
        />
      )}
    </div>
  );
}
