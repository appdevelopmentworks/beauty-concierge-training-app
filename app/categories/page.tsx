"use client";

import { CategoryCard } from "@/components/category-card";
import { useProgressOverview } from "@/hooks/use-progress-overview";
import { categories } from "@/lib/content";

export default function CategoriesPage() {
  const progress = useProgressOverview();

  return (
    <div className="space-y-4">
      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">カテゴリ一覧</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          6カテゴリ・合計60問とチェックリスト学習を収録しています。途中からでもそのまま再開できます。
        </p>
      </section>

      <section className="space-y-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} progress={progress[category.id]} />
        ))}
      </section>
    </div>
  );
}
