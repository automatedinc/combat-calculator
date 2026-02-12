'use client';

import { Button } from '@/components/ui/button';
import { useSimulatorStore } from '@/stores/simulatorStore';

export function SimulationControls() {
  const {
    selectedWeapon,
    defenderUnit,
    isSimulating,
    rollOnce,
    simulate,
    reset,
  } = useSimulatorStore();

  const canRun = !!selectedWeapon && !!defenderUnit;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        onClick={rollOnce}
        disabled={!canRun || isSimulating}
        className="bg-red-700 hover:bg-red-600 text-white"
      >
        Roll Once
      </Button>
      <Button
        onClick={() => simulate(1000)}
        disabled={!canRun || isSimulating}
        variant="outline"
        className="border-amber-700/50 text-amber-400 hover:bg-amber-950/50"
      >
        {isSimulating ? 'Simulating...' : 'Simulate x1000'}
      </Button>
      <Button onClick={reset} variant="ghost" className="text-muted-foreground">
        Reset
      </Button>
      {!canRun && (
        <span className="text-xs text-muted-foreground">
          Select an attacker weapon and defender unit to begin
        </span>
      )}
    </div>
  );
}
