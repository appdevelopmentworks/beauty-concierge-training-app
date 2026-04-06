import { ExternalLink, Link2 } from "lucide-react";

import { cn } from "@/lib/utils";
import type { SourceLink } from "@/types/content";

interface SourceLinksProps {
  sources: SourceLink[];
  compact?: boolean;
  className?: string;
}

export function SourceLinks({ sources, compact = false, className }: SourceLinksProps) {
  if (sources.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        <Link2 className="size-3.5" />
        参照元
      </div>
      <div className={cn("space-y-2", compact && "space-y-1.5")}>
        {sources.map((source) => (
          <a
            key={`${source.label}-${source.url}`}
            href={source.url}
            target="_blank"
            rel="noreferrer"
            className={cn(
              "flex items-start gap-2 rounded-2xl border border-border/70 bg-white/80 px-3 py-2.5 text-sm text-muted-foreground transition hover:border-primary/30 hover:text-foreground",
              compact && "px-3 py-2 text-xs",
            )}
          >
            <ExternalLink className="mt-0.5 size-3.5 shrink-0" />
            <span className="leading-5">
              <span className="font-medium text-foreground">{source.label}</span>
              <span className="block break-all text-muted-foreground">{source.url}</span>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
