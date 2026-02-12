export interface PhaseResult {
  diceRolled: number;
  rolls: number[];
  successes: number;
  criticals: number;
  threshold: number;
}

export interface HitResult extends PhaseResult {
  sustainedHits: number;
  lethalHits: number;
  totalHits: number;
}

export interface WoundResult extends PhaseResult {
  devastatingWounds: number;
  totalWounds: number;
}

export interface SaveResult extends PhaseResult {
  failedSaves: number;
}

export interface DamageResult {
  totalDamage: number;
  damageAfterFnp: number;
  modelsKilled: number;
  mortalWounds: number;
  overkillDamage: number;
}

export interface CombatLogEntry {
  phase: 'hit' | 'wound' | 'save' | 'damage' | 'fnp';
  description: string;
  roll?: number;
  threshold?: number;
  success: boolean;
  isCritical?: boolean;
  abilityTriggered?: string;
}

export interface CombatResult {
  hits: HitResult;
  wounds: WoundResult;
  saves: SaveResult;
  damage: DamageResult;
  log: CombatLogEntry[];
}

export interface SimulationSummary {
  iterations: number;
  results: CombatResult[];
  averageDamage: number;
  averageModelsKilled: number;
  medianDamage: number;
  minDamage: number;
  maxDamage: number;
  standardDeviation: number;
  killProbabilities: number[];
  damageDistribution: Record<number, number>;
}
