# Phase 3 Quality Assurance

## Automated Checks

```bash
npm run test:run
npm run typecheck
npm run build
```

## Test Coverage Scope

- `tests/lib/content.test.ts`
  - カテゴリ数、総問題数、チェックリスト構造の整合性
  - 問題ごとの参照元URL、シナリオ step ごとの参照元URL
  - チェック項目ごとの参照元URL
- `tests/lib/progress-storage.test.ts`
  - 旧形式を含む LocalStorage データの正規化
  - クイズ回答結果の保存と重複防止
  - チェックリスト確認状態の保存、完了判定、リセット
- `tests/app/pages.test.tsx`
  - ホーム画面
  - カテゴリ一覧
  - カテゴリ詳細
  - Checklist Learning
  - 進捗ダッシュボード

## Manual QA Checklist

- iPhone 幅相当で `/` から `/categories` に遷移できる
- `/categories/[categoryId]` から `クイズ` と `チェックリスト` の両方に遷移できる
- チェックリスト項目をオンにしたあと、ページ再読込しても状態が残る
- クイズを途中で閉じてから再度開いても、続きの問題に戻れる
- 結果画面からカテゴリへ戻り、再学習できる
- 参照元URLをタップすると新しいタブで開く
- 下部ナビゲーションが主要画面で操作しやすい

## Accessibility Checklist

- 主要ボタンに意味のあるテキストラベルがある
- フォーカスリングが視認できる
- `Progress` に進捗率がテキストでも表示される
- 色だけに依存せず `完了 / 未` が文言でも判別できる
- 長い参照元URLが画面幅内で折り返される

## Notes

- 実機QAとアクセシビリティ確認項目は、このドキュメントを使って手動確認する前提です。
- 自動テストは回帰確認用の最小セットで、E2E は今後の拡張候補です。
