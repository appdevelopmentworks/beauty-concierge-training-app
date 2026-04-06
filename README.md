# Beauty Concierge Training App

SBCコンシェルジュ向け初月研修を想定した、スマホファーストの学習アプリMVPです。  
Next.js 16 / TypeScript / Tailwind CSS / shadcn/ui ベースで、ダミー問題データと LocalStorage による進捗保存を実装しています。

## セットアップ

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:3000` を開くと確認できます。

リンクプレビューの絶対 URL を本番環境で正しく出したい場合は、必要に応じて `NEXT_PUBLIC_SITE_URL` を設定してください。

## 主な機能

- ホーム画面で学習概要を表示
- 6カテゴリの学習一覧
- カテゴリ詳細と問題プレビュー
- 1問ずつ進むクイズ画面
- 軽量分岐つきの会話シミュレーション画面
- 結果画面
- 進捗ダッシュボード
- LocalStorage による進捗保存

## 画面パス

- `/`
- `/categories`
- `/categories/[categoryId]`
- `/quiz/[categoryId]/[questionIndex]`
- `/scenario/[scenarioId]`
- `/results/[categoryId]`
- `/progress`

## データ構成

問題データは `data/*.json` でカテゴリごとに分かれています。現在の問題文は、SBCの公開サイトにある予約導線、支払い方法、メンズFAQ、コンシェルジュ採用情報などを軸にしつつ、一部は厚生労働省・個人情報保護委員会の公開ガイダンスをもとに、一般的な美容医療コンシェルジュ知識も補っています。

- `data/categories.json`
- `data/reception-flow.json`
- `data/counseling-basics.json`
- `data/treatment-basics.json`
- `data/contract-payment.json`
- `data/inquiry-handling.json`
- `data/compliance-complaint.json`

`lib/content.ts` で JSON を読み込み、軽いバリデーションを通した上で画面へ渡しています。

参照元サイト

- `https://www.s-b-c.net/`
- `https://www.s-b-c.net/about/clinic/flow/shoshin/`
- `https://www.s-b-c.net/about/`
- `https://www.s-b-c.net/charge_list/payment/`
- `https://www.sbc-mens.net/`
- `https://www.sbc-recruit.com/lp_2027fresh/`
- `https://www.sbc-recruit.com/faq/`
- `https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/fukyu3.html`
- `https://www.mhlw.go.jp/web/t_doc?dataId=00tc3511&dataType=1`
- `https://www.ppc.go.jp/all_faq_index/faq3-q1-2/`

## 進捗保存

学習進捗とセッション結果はブラウザの LocalStorage に保存されます。

- 進捗キー: `beauty-concierge-training-progress`
- 結果キー: `beauty-concierge-training-result`

## 補足

- 問題内容はダミーデータです
- 実在の院内ルールを断定せず、初月研修向けの汎用的な実務トーンで記述しています
- DB、ログイン、管理画面はMVP対象外です
