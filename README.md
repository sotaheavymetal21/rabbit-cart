# Rabbit Cart 🐰

うさぎグッズ専門の簡易 EC サイトです。
Next.js (App Router) と Supabase を使用して構築されています。

## 🚀 技術スタック

- **Frontend:**
  - Next.js 15+ (App Router)
  - TypeScript
  - Tailwind CSS
- **Backend:**
  - Supabase (PostgreSQL, Auth, Storage)
- **Package Manager:**
  - pnpm

## 🛠️ セットアップ手順

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd rabbit-cart
```

### 2. 依存関係のインストール

```bash
pnpm install
```

### 3. 環境変数の設定

`.env.local` ファイルを作成し、Supabase の接続情報を設定してください。

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. データベースのセットアップ

Supabase の SQL エディタで以下のファイルを実行し、テーブル作成と初期データの投入を行ってください。

1. `supabase/schema.sql` (テーブル作成)
2. `supabase/seed.sql` (初期データ投入)

### 5. 開発サーバーの起動

```bash
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) にアクセスしてください。

## 📦 機能一覧

- **商品閲覧機能**
  - トップページでの商品一覧表示
  - 商品詳細ページ (`/products/[id]`)
  - 在庫状況の表示 (売り切れ表示)

## 📁 ディレクトリ構成

```
rabbit-cart/
├── app/                # Next.js App Router
│   ├── page.tsx        # トップページ
│   └── products/       # 商品詳細ページ
├── components/         # UIコンポーネント
├── utils/              # ユーティリティ (Supabaseクライアント等)
├── types/              # TypeScript型定義
├── supabase/           # SQLファイル
└── public/             # 静的ファイル (画像など)
```
