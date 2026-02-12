'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { UnitSelector } from '@/components/units/UnitSelector';
import { UnitStatBlock } from '@/components/units/UnitStatBlock';
import { useSimulatorStore } from '@/stores/simulatorStore';

export function DefenderPanel() {
  const {
    defenderUnit,
    defenderModelCount,
    hasLineOfSight,
    hasCover,
    setDefenderUnit,
    setDefenderModelCount,
    setHasLineOfSight,
    setHasCover,
  } = useSimulatorStore();

  return (
    <Card className="border-blue-900/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-blue-400 flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-blue-500" />
          Defender
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Unit Selection */}
        <div className="space-y-2">
          <Label>Unit</Label>
          <UnitSelector
            value={defenderUnit?.id}
            onSelect={setDefenderUnit}
            label="Select defending unit..."
          />
        </div>

        {defenderUnit && (
          <>
            {/* Unit Stats */}
            <UnitStatBlock profile={defenderUnit.profile} />

            {/* Model Count */}
            <div className="space-y-2">
              <Label>Number of Models</Label>
              <Input
                type="number"
                min={1}
                max={30}
                value={defenderModelCount}
                onChange={(e) => setDefenderModelCount(Number(e.target.value))}
                className="w-24"
              />
            </div>

            {/* Keywords Display */}
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Keywords</Label>
              <div className="flex flex-wrap gap-1">
                {defenderUnit.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="rounded bg-muted px-2 py-0.5 text-[10px] font-medium uppercase text-muted-foreground"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Defender Modifiers */}
            <div className="space-y-3 pt-2 border-t border-border">
              <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                Modifiers
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={hasLineOfSight}
                    onCheckedChange={setHasLineOfSight}
                    id="los"
                  />
                  <Label htmlFor="los" className="text-xs cursor-pointer">
                    Line of Sight
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={hasCover}
                    onCheckedChange={setHasCover}
                    id="cover"
                  />
                  <Label htmlFor="cover" className="text-xs cursor-pointer">
                    Benefit of Cover
                  </Label>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
