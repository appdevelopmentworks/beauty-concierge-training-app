# Requirements

## 1. Overview
本アプリは、SBCコンシェルジュ職の新卒向け入職後1カ月研修に対応する
スマホ向け学習アプリである。

すでに作成済みの「ビジネスマナー」アプリとは別系統として、
それ以外の基礎知識・基礎業務を学べるアプリとして実装する。

## 2. Development Goal
MVPでは、以下を実現する。

- 初月研修向けの学習カテゴリを表示する
- 各カテゴリ内で問題を解く
- 正誤と解説を表示する
- 会話シミュレーション問題に対応する
- 学習進捗を端末内保存する
- スマホで快適に使えるUIを提供する

## 3. Target Learning Areas
### 3.1 Reception Flow
- 来院時の初動
- 受付の流れ
- 問診案内
- 待ち時間案内
- お見送りまでの基本動線
- 受付時の注意点

### 3.2 Counseling Basics
- お悩みヒアリング
- 要望確認
- 不安の受け止め方
- 比較検討中のお客様対応
- 医師への引き継ぎ観点
- 適切な案内姿勢

### 3.3 Treatment / Menu Basic Knowledge
- 施術カテゴリの基礎理解
- よくあるお悩みと施術方向性の対応関係
- ダウンタイムの概念
- 費用説明の基本姿勢
- FAQ基礎

### 3.4 Contract / Payment Basics
- 契約前確認
- 会計時の確認項目
- 案内漏れ防止
- 説明順序の理解
- ミスしやすいポイント

### 3.5 Inquiry Handling
- 電話応対の基本
- 予約変更・キャンセル対応
- お問い合わせの初期対応
- メール・テキストベースの返信方針

### 3.6 Complaint First Response
- 待ち時間への不満
- 認識違いが発生した際の初期対応
- 感情的なお客様への初動
- エスカレーション判断

### 3.7 Compliance / Privacy
- 個人情報の扱い
- 情報の見せ方・話し方の注意
- SNSや院内情報の取り扱い
- 守秘意識の基礎

### 3.8 SBC Mind / Culture
- 理念理解
- 行動基準の理解
- チームワーク
- 素直さ
- 挑戦
- 目標意識の基礎理解

## 4. Problem Types
アプリは以下の問題形式を扱う。

### 4.1 Multiple Choice Quiz
- 4択または3択
- 単一選択
- 正解後に解説表示

### 4.2 True / False Quiz
- ○×形式
- 初学者向けの導入問題として使う

### 4.3 Scenario Branching
- 会話シミュレーション
- 状況文を読んで最適な返答を選ぶ
- 分岐は軽量でよいが、少なくとも1〜2段階の遷移に対応する

### 4.4 Order / Flow Quiz
- 受付や会計などの順序並べ替え
- MVPでは簡易的に「正しい順番を選ぶ」方式でもよい

### 4.5 Checklist Learning
- 実務前に確認すべきポイントを学べる
- クイズではなくチェック項目閲覧型も許容する

## 5. Functional Requirements

### FR-01 Home Screen
- アプリ起動時にトップ画面を表示する
- 学習カテゴリ一覧へ遷移できる
- 学習進捗概要を表示する

### FR-02 Category List
- カテゴリ一覧を表示する
- 各カテゴリの問題数と進捗を表示する
- カテゴリ選択で問題一覧または学習開始画面に遷移できる

### FR-03 Lesson / Quiz Screen
- 1問ずつ問題を表示する
- 選択肢を表示する
- 回答後に正誤と解説を表示する
- 次の問題へ進める

### FR-04 Scenario Screen
- 会話シナリオを表示する
- 状況文と選択肢を表示する
- 選択に応じて結果と解説を表示する

### FR-05 Result Screen
- セッション終了後に結果を表示する
- 正答数、正答率、カテゴリ名を表示する
- 再挑戦できる

### FR-06 Progress Persistence
- 学習進捗をLocalStorageに保存する
- 再訪時に進捗が復元される
- カテゴリごとの完了率を保持する

### FR-07 Content Management
- 問題データをJSONファイルで管理する
- カテゴリごとにJSONを分けてもよい
- 問題文、選択肢、正解、解説、難易度、タグを持てるようにする

### FR-08 Responsive UI
- スマホ画面を最優先で最適化する
- タブレット・PCでも崩れない

## 6. Non-Functional Requirements

### NFR-01 Performance
- 初回表示は軽快であること
- MVPではサーバー通信なしでも動く構成を優先する

### NFR-02 Usability
- 新人でも迷わない構造
- 1〜2タップで学習開始できる
- 文字サイズと余白を十分に確保する

### NFR-03 Maintainability
- コンテンツ追加しやすい構成
- コンポーネント分割を行う
- 問題データ形式を共通化する

### NFR-04 Accessibility
- ボタンのタップ領域を十分に取る
- 色だけに依存せず正誤を表示する
- 日本語UIを基本とする

## 7. Recommended Tech Stack
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- lucide-react
- LocalStorage
- JSON-based content files

## 8. Suggested Screen Structure
- /
- /categories
- /categories/[categoryId]
- /quiz/[categoryId]/[questionIndex]
- /scenario/[scenarioId]
- /results/[categoryId]
- /progress

## 9. Data Model Draft

### Category
- id
- title
- description
- icon
- color
- totalQuestions

### QuizQuestion
- id
- categoryId
- type
- title
- prompt
- choices
- correctAnswer
- explanation
- difficulty
- tags

### ScenarioQuestion
- id
- categoryId
- title
- situation
- choices
- correctChoiceId
- feedbackCorrect
- feedbackIncorrect
- explanation
- tags

### Progress
- categoryId
- answeredCount
- correctCount
- completed
- lastPlayedAt

## 10. Initial Category Proposal for MVP
MVPでは以下の6カテゴリを実装対象にする。

1. 受付フロー
2. カウンセリング基礎
3. 施術・メニュー基礎知識
4. 契約・会計基礎
5. 問い合わせ・電話対応
6. 個人情報・クレーム初期対応

※ 「理念・行動基準」はトップ画面または導入コンテンツとして持たせてもよい

## 11. Initial Content Volume
MVPの初期問題数の目安

- 各カテゴリ 10〜15問
- 合計 60〜90問程度
- うち会話シミュレーション 8〜12問程度

## 12. Acceptance Criteria
以下を満たしたらMVP完了とする。

- スマホでカテゴリを選んで学習開始できる
- 各カテゴリに問題が入っている
- 回答後に正誤と解説が表示される
- 進捗が保存される
- UIがシンプルで崩れない
- JSONを編集して問題追加できる