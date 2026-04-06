# Codex Initial Prompt

以下の要件で、Next.js + TypeScript + Tailwind CSS + shadcn/ui を使って
スマホファーストの研修アプリMVPを実装してください。

## Project
beauty-concierge-training-app

## Context
このアプリは、SBCコンシェルジュ職の新卒向け入職後1カ月研修にフィットした
スマホ向け学習アプリです。

注意点:
- 「ビジネスマナー」アプリはすでに別で作成済みです
- 今回はそれ以外の内容を学ぶアプリを作ります
- 主な対象は、受付フロー、カウンセリング基礎、施術知識、契約会計、問い合わせ対応、クレーム初期対応、個人情報保護などです
- 実装はMVP優先で、DB不要、ログイン不要、LocalStorage保存で構いません
- 問題データはJSONファイルで管理してください
- 将来的にカテゴリ追加しやすい構成にしてください

## Read First
必ず docs/00_project_overview.md と docs/01_requirements.md を読んでから実装してください。

## Technical Requirements
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- lucide-react
- LocalStorage for progress
- JSON content files
- Responsive mobile-first UI

## Required Features
1. トップ画面
2. カテゴリ一覧画面
3. カテゴリ詳細または学習開始画面
4. 通常クイズ画面
5. 会話シミュレーション画面
6. 結果表示画面
7. 進捗表示画面
8. LocalStorageによる進捗保存

## Initial Categories
- reception-flow
- counseling-basics
- treatment-basics
- contract-payment
- inquiry-handling
- compliance-complaint

## Content Implementation Rules
- 各カテゴリに最低5問以上のダミー問題を入れてください
- 各カテゴリのうち少なくとも1問は会話シミュレーション形式にしてください
- すべて日本語で作成してください
- 内容はSBCコンシェルジュ向け初月研修を想定したトーンにしてください
- ただし、実在の院内限定ルールを断定せず、汎用的で実務的な表現にしてください

## UI Requirements
- 清潔感のある医療・美容系の印象
- 白ベース、余白多め、読みやすい文字サイズ
- 片手操作しやすいボタンサイズ
- カードUI中心
- カテゴリ進捗が見やすい
- 説明過多になりすぎない

## Suggested File Structure
- app/
- components/
- lib/
- data/
- types/
- docs/

## Suggested Data Files
- data/categories.json
- data/reception-flow.json
- data/counseling-basics.json
- data/treatment-basics.json
- data/contract-payment.json
- data/inquiry-handling.json
- data/compliance-complaint.json

## Suggested Components
- CategoryCard
- QuizCard
- ScenarioCard
- ProgressBar
- ResultSummary
- Header
- BottomNav

## Implementation Notes
- コードは読みやすく整理してください
- 型定義を作成してください
- JSONデータの型安全性を意識してください
- まずはダミーデータで完成させてください
- エラーが出にくいシンプル構成を優先してください
- 過剰な抽象化は不要です
- MVP完成後に拡張しやすい構造にしてください

## Deliverables
- 実行可能なNext.jsプロジェクト
- 主要画面
- ダミー問題データ
- 進捗保存機能
- 使い方が分かる README