'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSimulatorStore } from '@/stores/simulatorStore';

export function ResultsDisplay() {
  const { lastResult, simulationSummary } = useSimulatorStore();

  if (simulationSummary) {
    return (
      <Card className="border-amber-900/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-amber-400">
            Simulation Results ({simulationSummary.iterations} iterations)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ResultStat
              label="Avg Damage"
              value={simulationSummary.averageDamage.toFixed(1)}
              highlight
            />
            <ResultStat
              label="Avg Models Killed"
              value={simulationSummary.averageModelsKilled.toFixed(1)}
              highlight
            />
            <ResultStat
              label="Median Damage"
              value={simulationSummary.medianDamage.toString()}
            />
            <ResultStat
              label="Std Dev"
              value={simulationSummary.standardDeviation.toFixed(1)}
            />
            <ResultStat
              label="Min Damage"
              value={simulationSummary.minDamage.toString()}
            />
            <ResultStat
              label="Max Damage"
              value={simulationSummary.maxDamage.toString()}
            />
          </div>

          {/* Kill probability table */}
          {simulationSummary.killProbabilities.length > 1 && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">
                Kill Probabilities
              </p>
              <div className="flex flex-wrap gap-2">
                {simulationSummary.killProbabilities.slice(1).map((prob, i) => (
                  <div
                    key={i}
                    className="text-center rounded bg-muted/50 px-2 py-1 min-w-[3.5rem]"
                  >
                    <div className="text-[10px] text-muted-foreground">
                      {i + 1}+ kills
                    </div>
                    <div className="text-sm font-bold">
                      {(prob * 100).toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (!lastResult) {
    return (
      <Card className="border-border/50">
        <CardContent className="py-12 text-center text-muted-foreground">
          Select your units and weapons, then hit <strong>Roll Once</strong> or{' '}
          <strong>Simulate x1000</strong> to see results.
        </CardContent>
      </Card>
    );
  }

  const { hits, wounds, saves, damage } = lastResult;

  return (
    <Card className="border-amber-900/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-amber-400">Combat Result</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ResultStat label="Total Hits" value={hits.totalHits.toString()} />
          <ResultStat label="Total Wounds" value={wounds.totalWounds.toString()} />
          <ResultStat label="Failed Saves" value={saves.failedSaves.toString()} />
          <ResultStat
            label="Damage Dealt"
            value={damage.damageAfterFnp.toString()}
            highlight
          />
          <ResultStat
            label="Models Killed"
            value={damage.modelsKilled.toString()}
            highlight
          />
          {damage.mortalWounds > 0 && (
            <ResultStat
              label="Mortal Wounds"
              value={damage.mortalWounds.toString()}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ResultStat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="text-center rounded bg-muted/50 px-3 py-2">
      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
        {label}
      </div>
      <div
        className={`text-xl font-bold ${highlight ? 'text-amber-400' : ''}`}
      >
        {value}
      </div>
    </div>
  );
}
