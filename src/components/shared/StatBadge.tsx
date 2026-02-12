'use client';

import { cn } from '@/lib/utils';

interface StatBadgeProps {
  label: string;
  value: string | number;
  className?: string;
}

export function StatBadge({ label, value, className }: StatBadgeProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center rounded border border-border bg-muted/50 px-2 py-1 min-w-[3rem]',
        className
      )}
    >
      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-bold">{value}</span>
    </div>
  );
}
