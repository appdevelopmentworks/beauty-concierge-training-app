import { LibraryBig, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { KnowledgeType } from "@/types/content";

interface KnowledgeBadgeProps {
  knowledgeType: KnowledgeType;
}

export function KnowledgeBadge({ knowledgeType }: KnowledgeBadgeProps) {
  const isSbc = knowledgeType === "sbc-specific";
  const Icon = isSbc ? ShieldCheck : LibraryBig;

  return (
    <Badge
      className={cn(
        "gap-1.5",
        isSbc ? "bg-amber-100 text-amber-800" : "bg-sky-100 text-sky-800",
      )}
    >
      <Icon className="size-3.5" />
      {isSbc ? "SBC独自" : "一般知識"}
    </Badge>
  );
}
