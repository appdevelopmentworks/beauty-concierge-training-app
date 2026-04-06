"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, LineChart } from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "ホーム", icon: Home },
  { href: "/categories", label: "カテゴリ", icon: BookOpen },
  { href: "/progress", label: "進捗", icon: LineChart },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto flex max-w-md justify-center px-4 pb-4">
      <div className="soft-ring flex w-full items-center justify-between rounded-full border border-white/70 bg-white/92 p-2 backdrop-blur-xl">
        {items.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center gap-1 rounded-full px-3 py-2 text-xs font-medium transition",
                isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent",
              )}
            >
              <Icon className="size-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
