export type WeaponAbility =
  | { type: 'LETHAL_HITS' }
  | { type: 'SUSTAINED_HITS'; value: number }
  | { type: 'DEVASTATING_WOUNDS' }
  | { type: 'TWIN_LINKED' }
  | { type: 'TORRENT' }
  | { type: 'BLAST' }
  | { type: 'HEAVY' }
  | { type: 'RAPID_FIRE'; value: number }
  | { type: 'ASSAULT' }
  | { type: 'PISTOL' }
  | { type: 'ANTI'; keyword: string; value: number }
  | { type: 'MELTA'; value: number }
  | { type: 'LANCE' }
  | { type: 'IGNORES_COVER' }
  | { type: 'PRECISION' }
  | { type: 'HAZARDOUS' }
  | { type: 'INDIRECT_FIRE' }
  | { type: 'EXTRA_ATTACKS'; value: number };

export function hasAbility(
  abilities: WeaponAbility[],
  type: WeaponAbility['type']
): boolean {
  return abilities.some((a) => a.type === type);
}

export function getAbility<T extends WeaponAbility['type']>(
  abilities: WeaponAbility[],
  type: T
): Extract<WeaponAbility, { type: T }> | undefined {
  return abilities.find((a) => a.type === type) as
    | Extract<WeaponAbility, { type: T }>
    | undefined;
}
