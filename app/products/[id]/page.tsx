// ===========================
// インポート: 必要な機能を読み込む
// ===========================

// Supabaseクライアントを作成する関数（データベース接続用）
import { createClient } from '@/utils/supabase/server'
// Next.jsの画像最適化コンポーネント（自動的にWebP変換、遅延読み込みなどを行う）
import Image from 'next/image'
// Next.jsのリンクコンポーネント（ページ遷移を高速化するプリフェッチ機能付き）
import Link from 'next/link'
// 404ページを表示するための関数
import { notFound } from 'next/navigation'

// ===========================
// 型定義: TypeScriptの型安全性を確保
// ===========================

/**
 * ページコンポーネントのpropsの型定義
 * Next.js 15以降では、paramsはPromise型になっている
 */
interface PageProps {
  params: Promise<{
    id: string  // URLパラメータから取得する商品ID（例: /products/123 の "123"）
  }>
}

// ===========================
// メインコンポーネント: 商品詳細ページ
// ===========================

/**
 * 商品詳細ページのコンポーネント
 * 
 * このコンポーネントは「Server Component」として動作します（async関数）
 * - サーバー側でデータを取得してからHTMLを生成
 * - SEOに有利（検索エンジンがコンテンツを読み取れる）
 * - 初回表示が速い
 * 
 * @param params - URLパラメータ（商品ID）を含むPromise
 */
export default async function ProductDetailPage({ params }: PageProps) {
  // ===========================
  // データ取得: Supabaseから商品情報を取得
  // ===========================
  
  // paramsはPromise型なので、awaitで値を取り出す
  const { id } = await params
  
  // Supabaseクライアントを作成（データベース接続）
  const supabase = await createClient()

  // データベースから特定の商品を取得
  const { data: product, error } = await supabase
    .from('products')        // 'products'テーブルから
    .select('*')             // すべてのカラムを選択
    .eq('id', id)            // idカラムがURLパラメータのidと一致するものを検索
    .single()                // 1件のみ取得（配列ではなくオブジェクトとして返す）

  // ===========================
  // エラーハンドリング: 商品が見つからない場合
  // ===========================
  
  // エラーが発生した、または商品が存在しない場合
  if (error || !product) {
    console.error('Error fetching product:', error)
    notFound()  // Next.jsの404ページを表示
  }

  // ===========================
  // UI レンダリング: 商品詳細画面の表示
  // ===========================
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* ===========================
          戻るリンク: 商品一覧ページへのナビゲーション
          =========================== */}
      <Link
        href="/"  // トップページ（商品一覧）へのリンク
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        ← 商品一覧に戻る
      </Link>

      {/* ===========================
          メインコンテンツ: 2カラムレイアウト
          - 画面サイズによってカラム数が変わる（レスポンシブデザイン）
          - スマホ: 1カラム（縦並び）
          - タブレット以上: 2カラム（横並び）
          =========================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        
        {/* ===========================
            左カラム: 商品画像
            =========================== */}
        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
          {/* 画像が存在する場合 */}
          {product.image_url ? (
            <Image
              src={product.image_url}  // 画像のURL
              alt={product.name}        // 代替テキスト（アクセシビリティ対応）
              fill                      // 親要素いっぱいに画像を表示
              className="object-cover"  // 画像を切り抜いて表示（アスペクト比を維持）
              sizes="(max-width: 768px) 100vw, 50vw"  // レスポンシブ画像の最適化設定
              priority                  // 優先的に読み込む（LCP改善）
            />
          ) : (
            /* 画像が存在しない場合のフォールバック */
            <div className="flex items-center justify-center h-full text-gray-400">
              画像なし
            </div>
          )}
        </div>

        {/* ===========================
            右カラム: 商品情報
            =========================== */}
        <div className="flex flex-col">
          {/* 商品名 */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>
          
          {/* 価格表示（3桁ごとにカンマ区切り） */}
          <div className="text-2xl font-bold text-gray-900 mb-6">
            ¥{product.price.toLocaleString()}
          </div>

          {/* 商品説明 */}
          <div className="prose prose-sm text-gray-600 mb-8">
            <p>{product.description}</p>
          </div>

          {/* ===========================
              カートボタンエリア
              - mt-auto: 下部に配置（flexboxの自動マージン）
              =========================== */}
          <div className="mt-auto">
            {/* 在庫がある場合: カートに入れるボタン */}
            {product.stock > 0 ? (
              <button
                className="w-full bg-pink-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-pink-600 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                aria-label="カートに入れる"  // アクセシビリティ対応（スクリーンリーダー用）
              >
                カートに入れる 🐰
              </button>
            ) : (
              /* 在庫がない場合: 無効化されたボタン */
              <button
                disabled  // ボタンを無効化
                className="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-lg font-medium cursor-not-allowed"
              >
                売り切れ
              </button>
            )}
            {/* 在庫数の表示 */}
            <p className="mt-2 text-sm text-center text-gray-500">
              在庫: {product.stock}点
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
