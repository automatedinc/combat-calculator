'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { UnitSelector } from '@/components/units/UnitSelector';
import { WeaponSelector } from '@/components/units/WeaponSelector';
import { UnitStatBlock } from '@/components/units/UnitStatBlock';
import { WeaponStatBlock } from '@/components/units/WeaponStatBlock';
import { useSimulatorStore } from '@/stores/simulatorStore';

export function AttackerPanel() {
  const {
    attackerUnit,
    selectedWeapon,
    attackerModelCount,
    isStationary,
    hasCharged,
    hasAdvanced,
    withinHalfRange,
    setAttackerUnit,
    setSelectedWeapon,
    setAttackerModelCount,
    setIsStationary,
    setHasCharged,
    setHasAdvanced,
    setWithinHalfRange,
  } = useSimulatorStore();

  return (
    <Card className="border-red-900/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-red-400 flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-red-500" />
          Attacker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Unit Selection */}
        <div className="space-y-2">
          <Label>Unit</Label>
          <UnitSelector
            value={attackerUnit?.id}
            onSelect={setAttackerUnit}
            label="Select attacking unit..."
          />
        </div>

        {attackerUnit && (
          <>
            {/* Unit Stats */}
            <UnitStatBlock profile={attackerUnit.profile} />

            {/* Model Count */}
            <div className="space-y-2">
              <Label>Number of Models Attacking</Label>
              <Input
                type="number"
                min={1}
                max={30}
                value={attackerModelCount}
                onChange={(e) => setAttackerModelCount(Number(e.target.value))}
                className="w-24"
              />
            </div>

            {/* Weapon Selection */}
            <div className="space-y-2">
              <Label>Weapon</Label>
              <WeaponSelector
                weapons={attackerUnit.weapons}
                value={selectedWeapon?.id}
                onSelect={setSelectedWeapon}
              />
            </div>

            {selectedWeapon && <WeaponStatBlock weapon={selectedWeapon} />}

            {/* Combat Modifiers */}
            <div className="space-y-3 pt-2 border-t border-border">
              <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                Modifiers
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={isStationary}
                    onCheckedChange={setIsStationary}
                    id="stationary"
                  />
                  <Label htmlFor="stationary" className="text-xs cursor-pointer">
                    Remained Stationary
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={hasCharged}
                    onCheckedChange={setHasCharged}
                    id="charged"
                  />
                  <Label htmlFor="charged" className="text-xs cursor-pointer">
                    Charged
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={hasAdvanced}
                    onCheckedChange={setHasAdvanced}
                    id="advanced"
                  />
                  <Label htmlFor="advanced" className="text-xs cursor-pointer">
                    Advanced
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={withinHalfRange}
                    onCheckedChange={setWithinHalfRange}
                    id="halfrange"
                  />
                  <Label htmlFor="halfrange" className="text-xs cursor-pointer">
                    Within Half Range
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
