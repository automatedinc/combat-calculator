'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSimulatorStore } from '@/stores/simulatorStore';
import { cn } from '@/lib/utils';

const phaseColors: Record<string, string> = {
  hit: 'text-red-400',
  wound: 'text-orange-400',
  save: 'text-blue-400',
  damage: 'text-amber-400',
  fnp: 'text-green-400',
};

export function DiceLog() {
  const { lastResult } = useSimulatorStore();
  const [expanded, setExpanded] = useState(false);

  if (!lastResult || lastResult.log.length === 0) return null;

  const visibleLog = expanded ? lastResult.log : lastResult.log.slice(0, 20);

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground flex items-center justify-between">
          Dice Log ({lastResult.log.length} entries)
          {lastResult.log.length > 20 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-6"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? 'Collapse' : 'Show All'}
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-64 overflow-y-auto space-y-0.5 text-xs font-mono">
          {visibleLog.map((entry, i) => (
            <div
              key={i}
              className={cn(
                'flex items-start gap-2 py-0.5',
                !entry.success && 'opacity-50'
              )}
            >
              <span
                className={cn(
                  'shrink-0 w-14 text-right uppercase text-[10px] font-bold pt-0.5',
                  phaseColors[entry.phase]
                )}
              >
                {entry.phase}
              </span>
              <span
                className={cn(
                  entry.isCritical && 'text-amber-300 font-bold',
                  entry.abilityTriggered && 'text-purple-300'
                )}
              >
                {entry.description}
              </span>
            </div>
          ))}
          {!expanded && lastResult.log.length > 20 && (
            <div className="text-muted-foreground text-center py-2">
              ...{lastResult.log.length - 20} more entries
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
