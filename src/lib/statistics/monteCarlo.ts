import type { CombatResult, SimulationSummary } from '@/types/combat';
import type { CombatConfig } from '@/lib/engine/types';
import { resolveCombat } from '@/lib/engine/combat';

export function runSimulation(
  config: CombatConfig,
  iterations: number = 1000
): SimulationSummary {
  const results: CombatResult[] = [];

  for (let i = 0; i < iterations; i++) {
    results.push(resolveCombat(config));
  }

  return aggregateResults(results, config.defender.modelCount);
}

function aggregateResults(
  results: CombatResult[],
  defenderModelCount: number
): SimulationSummary {
  const damages = results.map((r) => r.damage.damageAfterFnp);
  const kills = results.map((r) => r.damage.modelsKilled);

  const sorted = [...damages].sort((a, b) => a - b);
  const sum = damages.reduce((a, b) => a + b, 0);
  const killSum = kills.reduce((a, b) => a + b, 0);
  const mean = sum / results.length;

  const variance =
    damages.reduce((acc, d) => acc + (d - mean) ** 2, 0) / results.length;

  // Damage distribution
  const damageDistribution: Record<number, number> = {};
  for (const d of damages) {
    damageDistribution[d] = (damageDistribution[d] || 0) + 1;
  }

  // Kill probabilities: probability of killing at least N models
  const killProbabilities: number[] = [];
  for (let n = 0; n <= defenderModelCount; n++) {
    const count = kills.filter((k) => k >= n).length;
    killProbabilities.push(count / results.length);
  }

  return {
    iterations: results.length,
    results,
    averageDamage: mean,
    averageModelsKilled: killSum / results.length,
    medianDamage: sorted[Math.floor(sorted.length / 2)],
    minDamage: sorted[0] ?? 0,
    maxDamage: sorted[sorted.length - 1] ?? 0,
    standardDeviation: Math.sqrt(variance),
    killProbabilities,
    damageDistribution,
  };
}
