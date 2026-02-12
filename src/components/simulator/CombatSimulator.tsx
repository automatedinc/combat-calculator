'use client';

import { AttackerPanel } from './AttackerPanel';
import { DefenderPanel } from './DefenderPanel';
import { SimulationControls } from './SimulationControls';
import { ResultsDisplay } from './ResultsDisplay';
import { PhaseBreakdown } from './PhaseBreakdown';
import { DiceLog } from './DiceLog';

export function CombatSimulator() {
  return (
    <div className="space-y-6">
      {/* Configuration Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttackerPanel />
        <DefenderPanel />
      </div>

      {/* Controls */}
      <div className="flex justify-center">
        <SimulationControls />
      </div>

      {/* Results */}
      <ResultsDisplay />

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PhaseBreakdown />
        <DiceLog />
      </div>
    </div>
  );
}
