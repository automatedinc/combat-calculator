import { CombatSimulator } from '@/components/simulator/CombatSimulator';

export default function SimulatorPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Combat Simulator</h1>
        <p className="text-muted-foreground mt-1">
          Select your attacking and defending units, choose weapons, and resolve combat.
        </p>
      </div>
      <CombatSimulator />
    </div>
  );
}
