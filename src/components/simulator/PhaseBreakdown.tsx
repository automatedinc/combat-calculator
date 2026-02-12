'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useSimulatorStore } from '@/stores/simulatorStore';

export function PhaseBreakdown() {
  const { lastResult } = useSimulatorStore();

  if (!lastResult) return null;

  const { hits, wounds, saves, damage } = lastResult;

  return (
    <Accordion type="multiple" defaultValue={['hits', 'wounds', 'saves', 'damage']}>
      <AccordionItem value="hits">
        <AccordionTrigger className="text-sm">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            Hit Phase
            <span className="text-muted-foreground font-normal">
              {hits.totalHits} / {hits.diceRolled || hits.totalHits} hits
            </span>
          </span>
        </AccordionTrigger>
        <AccordionContent className="text-xs space-y-1">
          <div className="grid grid-cols-3 gap-2">
            <PhaseStatBox label="Dice Rolled" value={hits.diceRolled || 'Auto'} />
            <PhaseStatBox label="Hits" value={hits.successes} />
            <PhaseStatBox label="Crits" value={hits.criticals} />
          </div>
          {hits.sustainedHits > 0 && (
            <div className="text-amber-400">
              +{hits.sustainedHits} extra hits from Sustained Hits
            </div>
          )}
          {hits.lethalHits > 0 && (
            <div className="text-red-400">
              {hits.lethalHits} Lethal Hits (auto-wound)
            </div>
          )}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="wounds">
        <AccordionTrigger className="text-sm">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            Wound Phase
            <span className="text-muted-foreground font-normal">
              {wounds.totalWounds} wounds ({wounds.threshold}+ to wound)
            </span>
          </span>
        </AccordionTrigger>
        <AccordionContent className="text-xs space-y-1">
          <div className="grid grid-cols-3 gap-2">
            <PhaseStatBox label="Dice Rolled" value={wounds.diceRolled} />
            <PhaseStatBox label="Wounds" value={wounds.successes} />
            <PhaseStatBox label="Crits" value={wounds.criticals} />
          </div>
          {wounds.devastatingWounds > 0 && (
            <div className="text-purple-400">
              {wounds.devastatingWounds} Devastating Wounds (bypass saves)
            </div>
          )}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="saves">
        <AccordionTrigger className="text-sm">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            Save Phase
            <span className="text-muted-foreground font-normal">
              {saves.failedSaves} failed / {saves.diceRolled} saves ({saves.threshold}
              +)
            </span>
          </span>
        </AccordionTrigger>
        <AccordionContent className="text-xs">
          <div className="grid grid-cols-3 gap-2">
            <PhaseStatBox label="Dice Rolled" value={saves.diceRolled} />
            <PhaseStatBox label="Saved" value={saves.successes} />
            <PhaseStatBox label="Failed" value={saves.failedSaves} />
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="damage">
        <AccordionTrigger className="text-sm">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            Damage Phase
            <span className="text-muted-foreground font-normal">
              {damage.damageAfterFnp} damage, {damage.modelsKilled} killed
            </span>
          </span>
        </AccordionTrigger>
        <AccordionContent className="text-xs">
          <div className="grid grid-cols-3 gap-2">
            <PhaseStatBox label="Total Damage" value={damage.totalDamage} />
            <PhaseStatBox label="After FNP" value={damage.damageAfterFnp} />
            <PhaseStatBox label="Models Killed" value={damage.modelsKilled} />
          </div>
          {damage.mortalWounds > 0 && (
            <div className="mt-1 text-purple-400">
              {damage.mortalWounds} mortal wounds from Devastating Wounds
            </div>
          )}
          {damage.overkillDamage > 0 && (
            <div className="mt-1 text-muted-foreground">
              {damage.overkillDamage} overkill damage wasted
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function PhaseStatBox({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded bg-muted/30 px-2 py-1 text-center">
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div className="font-bold">{value}</div>
    </div>
  );
}
