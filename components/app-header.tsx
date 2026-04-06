"use client";

import { Sparkles } from "lucide-react";

interface AppHeaderProps {
  title: string;
  subtitle: string;
}

export function AppHeader({ title, subtitle }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/60 bg-white/75 px-4 pb-4 pt-5 backdrop-blur-xl">
      <div className="mx-auto flex max-w-md items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" />
            Beauty Concierge Lab
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">{title}</h1>
            <p className="text-sm leading-6 text-muted-foreground">{subtitle}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
