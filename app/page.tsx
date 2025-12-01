// ===========================
// インポート: 必要な機能を読み込む
// ===========================

// Supabaseクライアントを作成する関数（データベース接続用）
import { createClient } from '@/utils/supabase/server'
// 商品カードコンポーネント（個々の商品をカード形式で表示する部品）
import ProductCard from '@/components/ProductCard'

// ===========================
// メインコンポーネント: トップページ（商品一覧）
// ===========================

/**
 * トップページのコンポーネント
 * async/awaitを使用しているため、これは「Server Component」です。
 * サーバー側でデータベースからデータを取得し、HTMLを生成してからブラウザに送ります。
 */
export default async function Home() {
  // ===========================
  // データ取得: Supabaseから商品一覧を取得
  // ===========================

  // Supabaseクライアントの初期化
  const supabase = await createClient()

  // データベースへのクエリ実行
  // - from('products'): 'products'テーブルを選択
  // - select('*'): すべてのカラムを取得
  // - order('created_at', ...): 作成日時（created_at）の降順（新しい順）で並べ替え
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  // ===========================
  // エラーハンドリング
  // ===========================
  
  // データ取得中にエラーが発生した場合の表示
  if (error) {
    console.error('Error fetching products:', error)
    return (
      // エラーメッセージの表示エリア
      // - text-center: テキストを中央揃え
      // - text-red-500: 文字色を赤にする
      <div className="container mx-auto px-4 py-8 text-center text-red-500">
        商品の読み込みに失敗しました。後でもう一度お試しください。
      </div>
    )
  }

  // ===========================
  // UI レンダリング: 商品一覧の表示
  // ===========================

  return (
    // メインコンテンツエリア
    // - container: 画面幅に応じた固定幅のコンテナ
    // - mx-auto: 左右中央揃え
    // - px-4: 左右パディング 1rem (16px)
    // - py-8: 上下パディング 2rem (32px)
    <main className="container mx-auto px-4 py-8">
      {/* ページタイトル
          - text-3xl: 文字サイズ 1.875rem (30px)
          - font-bold: 太字
          - mb-8: 下マージン 2rem (32px)
          - text-center: 中央揃え
          - text-white: 文字色 白
      */}
      <h1 className="text-3xl font-bold mb-8 text-center text-white">
        うさぎグッズ一覧 🐰
      </h1>
      
      {/* 商品の有無による条件付きレンダリング */}
      {products && products.length > 0 ? (
        // 商品グリッドレイアウト
        // - grid: グリッドレイアウト有効化
        // - grid-cols-1: スマホ等は1列
        // - sm:grid-cols-2: 640px以上は2列
        // - lg:grid-cols-3: 1024px以上は3列
        // - xl:grid-cols-4: 1280px以上は4列
        // - gap-6: アイテム間の隙間 1.5rem (24px)
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* 商品の配列をループしてカードを表示 */}
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        // 商品が0件の場合の表示
        // - text-center: 中央揃え
        // - text-white: 文字色 白
        // - py-12: 上下パディング 3rem (48px)
        <div className="text-center text-white py-12">
          商品が見つかりません。
        </div>
      )}
    </main>
  )
}
