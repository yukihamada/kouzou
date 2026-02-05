# 耐震診断くん 🏠

[![CI](https://github.com/yukihamada/kouzou/actions/workflows/ci.yml/badge.svg)](https://github.com/yukihamada/kouzou/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**木造住宅の耐震性能を無料で診断できるWebアプリケーション**

🔗 **本番サイト**: [https://kouzou.fly.dev](https://kouzou.fly.dev)

![耐震診断くん](public/og-image.svg)

---

## 概要

「耐震診断くん」は、木造住宅（在来工法・2×4）の耐震性能を診断するWebアプリケーションです。専門知識がなくても使える**簡易診断**と、建築士向けの**精密診断**の2つのモードを提供しています。

### 特徴

- **完全無料** - 登録不要で今すぐ使える
- **プライバシー保護** - 全ての計算はブラウザ内で完結（サーバーにデータを送信しない）
- **専門家品質** - 2012年改訂版「木造住宅の耐震診断と補強方法」準拠
- **PWA対応** - スマートフォンにインストール可能

---

## 診断モード

### 1. 簡易診断（10問・約5分）

一般の住宅所有者向けのスクリーニングツールです。

- 10個の質問に答えるだけ
- 日本建築防災協会「誰でもできるわが家の耐震診断」に準拠
- 結果: 安全 / 要注意 / 要診断 の3段階評価

**診断項目例:**
- 建築時期（1981年6月の新耐震基準前後）
- 過去の災害被害
- 増築の有無
- シロアリ・腐食の有無
- 建物の形状・壁の配置

### 2. 精密診断（一般診断法）

建築士・専門家向けの本格的な診断ツールです。

- **上部構造評点（Iw）** を算出
- 壁量計算・偏心率・劣化度を総合評価
- 補強計画と概算費用を自動提案
- PDFレポート出力

**評価基準:**
| Iw値 | 判定 |
|------|------|
| 1.5以上 | 倒壊しない |
| 1.0〜1.5 | 一応倒壊しない |
| 0.7〜1.0 | 倒壊する可能性がある |
| 0.7未満 | 倒壊する可能性が高い |

---

## 技術スタック

| カテゴリ | 技術 |
|----------|------|
| フレームワーク | Next.js 16 (App Router) |
| 言語 | TypeScript 5 |
| UI | React 19, Tailwind CSS 4, shadcn/ui |
| 状態管理 | Zustand |
| フォーム | React Hook Form + Zod |
| PDF生成 | jsPDF |
| テスト | Vitest + React Testing Library |
| CI/CD | GitHub Actions |
| デプロイ | Fly.io (東京リージョン) |

---

## プロジェクト構成

```
src/
├── app/                      # Next.js App Router
│   ├── (diagnosis)/          # 診断フロー
│   │   ├── simple/           # 簡易診断
│   │   └── detailed/         # 精密診断
│   ├── reinforcement/        # 補強提案
│   ├── report/               # レポート出力
│   └── api/health/           # ヘルスチェック
│
├── components/
│   ├── ui/                   # shadcn/ui コンポーネント
│   ├── diagnosis/            # 診断フォーム
│   ├── layout/               # ヘッダー・フッター
│   └── visualization/        # グラフ・ゲージ
│
├── lib/
│   ├── calc/                 # 計算ロジック
│   │   ├── upper-structure-score.ts  # Iw値計算
│   │   ├── wall-strength.ts          # 壁量計算
│   │   ├── eccentricity.ts           # 偏心率計算
│   │   ├── deterioration.ts          # 劣化度計算
│   │   └── reinforcement.ts          # 補強提案
│   ├── constants/            # 定数・係数テーブル
│   ├── pdf/                  # PDF生成
│   └── report/               # レポート内容
│
├── stores/                   # Zustand ストア
└── types/                    # 型定義
```

---

## セットアップ

### 必要環境

- Node.js 20以上
- npm

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/yukihamada/kouzou.git
cd kouzou

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

---

## コマンド

| コマンド | 説明 |
|----------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | 本番ビルド |
| `npm run start` | 本番サーバー起動 |
| `npm run lint` | ESLint 実行 |
| `npm run test` | テスト実行 |
| `npm run test:watch` | テスト監視モード |
| `npm run test:coverage` | カバレッジ付きテスト |

---

## テスト

```bash
# 全テスト実行
npm run test

# カバレッジレポート
npm run test:coverage
```

**テストカバレッジ:** 87テスト / カバレッジ約90%

主なテスト対象:
- 壁量計算 (`wall-strength.test.ts`)
- 上部構造評点計算 (`upper-structure-score.test.ts`)
- 必要耐力計算 (`required-capacity.test.ts`)
- 劣化度係数計算 (`deterioration.test.ts`)
- レポート生成 (`simple-report-content.test.ts`, `detailed-report-content.test.ts`)

---

## デプロイ

### Fly.io

```bash
# Fly CLI でデプロイ
fly deploy
```

### Docker

```bash
# イメージをビルド
docker build -t kouzou .

# コンテナを起動
docker run -p 3000:3000 kouzou
```

---

## 計算ロジック

### 上部構造評点（Iw）の計算

```
Iw = edQu / Qr

edQu = Qu × eKfl × dK
```

| 記号 | 説明 |
|------|------|
| Qu | 保有耐力（壁耐力の合計） |
| Qr | 必要耐力 |
| eKfl | 偏心率による低減係数 |
| dK | 劣化低減係数 |

### 壁耐力の計算

```
Qu = Σ(Fw × L × Kj)
```

| 記号 | 説明 |
|------|------|
| Fw | 壁基準耐力（壁種類による） |
| L | 壁の長さ |
| Kj | 接合部低減係数 |

---

## ライセンス

MIT License

---

## 免責事項

本ツールは簡易的な耐震診断の参考情報を提供するものです。正確な耐震診断には、建築士等の専門家による現地調査が必要です。本ツールの結果のみに基づいて建物の安全性を判断しないでください。

---

## 関連リンク

- [本番サイト](https://kouzou.fly.dev)
- [GOD'S EYE - 外観AI診断](https://and-and.co.jp)（連携サービス）
- [日本建築防災協会](https://www.kenchiku-bosai.or.jp/)

---

## 開発者

Made with ❤️ by [@yukihamada](https://github.com/yukihamada)
