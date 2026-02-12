import { create } from 'zustand';
import type { Unit } from '@/types/unit';
import type { Weapon } from '@/types/weapon';
import type { CombatResult, SimulationSummary } from '@/types/combat';
import type { CombatConfig } from '@/lib/engine/types';
import { resolveCombat } from '@/lib/engine/combat';
import { runSimulation } from '@/lib/statistics/monteCarlo';

interface SimulatorState {
  // Attacker
  attackerUnit: Unit | null;
  selectedWeapon: Weapon | null;
  attackerModelCount: number;
  isStationary: boolean;
  hasCharged: boolean;
  hasAdvanced: boolean;
  withinHalfRange: boolean;

  // Defender
  defenderUnit: Unit | null;
  defenderModelCount: number;
  hasLineOfSight: boolean;
  hasCover: boolean;

  // Results
  lastResult: CombatResult | null;
  simulationSummary: SimulationSummary | null;
  isSimulating: boolean;

  // Actions
  setAttackerUnit: (unit: Unit) => void;
  setSelectedWeapon: (weapon: Weapon) => void;
  setAttackerModelCount: (count: number) => void;
  setDefenderUnit: (unit: Unit) => void;
  setDefenderModelCount: (count: number) => void;
  setIsStationary: (v: boolean) => void;
  setHasCharged: (v: boolean) => void;
  setHasAdvanced: (v: boolean) => void;
  setWithinHalfRange: (v: boolean) => void;
  setHasLineOfSight: (v: boolean) => void;
  setHasCover: (v: boolean) => void;
  rollOnce: () => void;
  simulate: (iterations?: number) => void;
  reset: () => void;
}

function buildConfig(state: SimulatorState): CombatConfig | null {
  if (!state.selectedWeapon || !state.defenderUnit) return null;

  return {
    attacker: {
      weapon: state.selectedWeapon,
      modelCount: state.attackerModelCount,
      isStationary: state.isStationary,
      hasCharged: state.hasCharged,
      hasAdvanced: state.hasAdvanced,
      withinHalfRange: state.withinHalfRange,
    },
    defender: {
      profile: state.defenderUnit.profile,
      modelCount: state.defenderModelCount,
      keywords: state.defenderUnit.keywords,
      hasLineOfSight: state.hasLineOfSight,
      hasCover: state.hasCover,
    },
  };
}

export const useSimulatorStore = create<SimulatorState>((set, get) => ({
  // Defaults
  attackerUnit: null,
  selectedWeapon: null,
  attackerModelCount: 1,
  isStationary: false,
  hasCharged: false,
  hasAdvanced: false,
  withinHalfRange: false,

  defenderUnit: null,
  defenderModelCount: 1,
  hasLineOfSight: true,
  hasCover: false,

  lastResult: null,
  simulationSummary: null,
  isSimulating: false,

  setAttackerUnit: (unit) =>
    set({
      attackerUnit: unit,
      selectedWeapon: unit.weapons[0] ?? null,
      attackerModelCount: unit.modelCount,
    }),

  setSelectedWeapon: (weapon) => set({ selectedWeapon: weapon }),

  setAttackerModelCount: (count) =>
    set({ attackerModelCount: Math.max(1, count) }),

  setDefenderUnit: (unit) =>
    set({
      defenderUnit: unit,
      defenderModelCount: unit.modelCount,
    }),

  setDefenderModelCount: (count) =>
    set({ defenderModelCount: Math.max(1, count) }),

  setIsStationary: (v) => set({ isStationary: v }),
  setHasCharged: (v) => set({ hasCharged: v }),
  setHasAdvanced: (v) => set({ hasAdvanced: v }),
  setWithinHalfRange: (v) => set({ withinHalfRange: v }),
  setHasLineOfSight: (v) => set({ hasLineOfSight: v }),
  setHasCover: (v) => set({ hasCover: v }),

  rollOnce: () => {
    const config = buildConfig(get());
    if (!config) return;
    const result = resolveCombat(config);
    set({ lastResult: result, simulationSummary: null });
  },

  simulate: (iterations = 1000) => {
    const config = buildConfig(get());
    if (!config) return;
    set({ isSimulating: true });
    // Use setTimeout to avoid blocking the UI
    setTimeout(() => {
      const summary = runSimulation(config, iterations);
      set({ simulationSummary: summary, lastResult: null, isSimulating: false });
    }, 0);
  },

  reset: () =>
    set({
      attackerUnit: null,
      selectedWeapon: null,
      attackerModelCount: 1,
      defenderUnit: null,
      defenderModelCount: 1,
      lastResult: null,
      simulationSummary: null,
      isStationary: false,
      hasCharged: false,
      hasAdvanced: false,
      withinHalfRange: false,
      hasLineOfSight: true,
      hasCover: false,
    }),
}));
