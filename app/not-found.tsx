import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFound() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ページが見つかりません</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-muted-foreground">
          指定されたカテゴリまたは問題データが見つかりませんでした。カテゴリ一覧から学習を再開してください。
        </p>
        <Button asChild>
          <Link href="/categories">
            <ArrowLeft className="size-4" />
            カテゴリ一覧へ戻る
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
