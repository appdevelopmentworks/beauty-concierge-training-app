import { Progress } from "@/components/ui/progress";
import { cn, formatPercent } from "@/lib/utils";

interface ProgressMeterProps {
  label: string;
  value: number;
  helper?: string;
  className?: string;
}

export function ProgressMeter({ label, value, helper, className }: ProgressMeterProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-sm font-semibold text-muted-foreground">{formatPercent(value)}</span>
      </div>
      <Progress value={value} />
      {helper ? <p className="text-xs leading-5 text-muted-foreground">{helper}</p> : null}
    </div>
  );
}
