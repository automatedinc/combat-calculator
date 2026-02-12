export type FactionId =
  | 'space-marines'
  | 'chaos-space-marines'
  | 'aeldari'
  | 'orks'
  | 'tyranids'
  | 'necrons';

export interface Faction {
  id: FactionId;
  name: string;
  color: string;
}
