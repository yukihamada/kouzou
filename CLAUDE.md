# CLAUDE.md — kouzou (耐震診断くん)

## Project Overview
木造住宅の耐震性能を診断するWebアプリ

## Tech Stack
- Next.js 16 / React 19 / TypeScript 5
- Tailwind CSS 4 / shadcn/ui
- Zustand (状態管理)
- jsPDF (レポート生成)

## Commands
```bash
npm run dev          # 開発サーバー
npm run build        # 本番ビルド
npm run test         # テスト実行
npm run test:coverage # カバレッジ付き
npm run lint         # ESLint
```

## Directory Structure
```
src/
├── app/           # Next.js App Router pages
├── components/    # UIコンポーネント
├── lib/
│   ├── calc/      # 計算ロジック (Iw値, 壁量, 劣化度等)
│   ├── constants/ # 定数・マスターデータ
│   ├── pdf/       # PDF生成
│   └── report/    # レポート内容生成
├── stores/        # Zustand stores
└── types/         # 型定義
```

## Key Calculation Files
- `lib/calc/upper-structure-score.ts` — Iw値(上部構造評点)計算
- `lib/calc/wall-strength.ts` — 壁量計算
- `lib/calc/deterioration.ts` — 劣化度係数計算
- `lib/calc/eccentricity.ts` — 偏心率計算

## Testing
- Vitest + React Testing Library
- テストは `__tests__/` に配置
- 計算ロジックのテストが中心

## Deploy
- Fly.io (東京リージョン)
- Docker マルチステージビルド
