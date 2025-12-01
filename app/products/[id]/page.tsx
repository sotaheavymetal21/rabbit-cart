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
  // Supabaseからデータを取得し、結果を非同期で待機します。
  // 取得したデータは `product` 変数に、エラーがあれば `error` 変数に格納されます。
  //
  // - `await`: 非同期処理（Promise）の完了を待ちます。ここではSupabaseのデータベースクエリが完了するまで処理を一時停止します。
  // - `{ data: product, error }`: これは「オブジェクト分割代入（Object Destructuring Assignment）」というJavaScriptの構文です。
  //   - `data: product`: Supabaseのクエリ結果は通常 `{ data: ..., error: ... }` の形式で返されます。
  //     ここで、返されたオブジェクトの `data` プロパティを `product` という新しい変数名に割り当てています。
  //     これにより、`response.data` の代わりに `product` としてデータにアクセスできます。
  //   - `error`: 返されたオブジェクトの `error` プロパティを、同名の `error` 変数に直接割り当てています。
  // - `supabase`: これは事前に `createClient()` で作成されたSupabaseクライアントインスタンスです。
  //   このインスタンスを通じて、データベースへのクエリ（`.from().select().eq().single()`）を実行します。
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
    // コンテナ設定
    // - container: レスポンシブな固定幅のコンテナを作成
    // - mx-auto: 左右のマージンを自動（auto）にして中央揃えにする
    // - px-4: 左右の内側余白（パディング）を1rem（16px）に設定
    // - py-8: 上下の内側余白（パディング）を2rem（32px）に設定
    <div className="container mx-auto px-4 py-8">
      {/* ===========================
          戻るリンク: 商品一覧ページへのナビゲーション
          =========================== */}
      <Link
        href="/"  // トップページ（商品一覧）へのリンク
        // リンクのスタイル
        // - inline-flex: インライン要素として配置しつつ、Flexboxの機能を使う
        // - items-center: 子要素（矢印とテキスト）を垂直方向の中央に揃える
        // - text-sm: 文字サイズを小さく（0.875rem = 14px）する
        // - text-gray-500: 文字色をグレー（500番）にする
        // - hover:text-gray-700: マウスホバー時に文字色を濃いグレー（700番）にする
        // - mb-6: 下側のマージンを1.5rem（24px）空ける
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        ← 商品一覧に戻る
      </Link>

      {/* ===========================
          メインコンテンツ: 2カラムレイアウト
          - grid: グリッドレイアウトを有効化
          - grid-cols-1: デフォルト（スマホなど）は1列表示
          - md:grid-cols-2: 画面幅768px以上（タブレット・PC）は2列表示
          - gap-8: グリッドアイテム間の隙間を2rem（32px）空ける
          - lg:gap-12: 画面幅1024px以上は隙間を3rem（48px）に広げる
          =========================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        
        {/* ===========================
            左カラム: 商品画像
            - relative: 子要素の absolute 配置の基準点にする
            - aspect-square: アスペクト比を1:1（正方形）に保つ
            - bg-gray-100: 画像読み込み前などの背景色を薄いグレーにする
            - rounded-lg: 角を丸くする（半径0.5rem = 8px）
            - overflow-hidden: 角丸からはみ出た部分を切り取る
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
            /* 画像が存在しない場合のフォールバック
               - flex: Flexboxレイアウトを有効化
               - items-center: 垂直方向の中央揃え
               - justify-center: 水平方向の中央揃え
               - h-full: 高さを親要素いっぱいに広げる
               - text-gray-400: 文字色を薄いグレーにする
            */
            <div className="flex items-center justify-center h-full text-gray-400">
              画像なし
            </div>
          )}
        </div>

        {/* ===========================
            右カラム: 商品情報
            - flex: Flexboxレイアウトを有効化
            - flex-col: 子要素を縦方向に並べる
            =========================== */}
        <div className="flex flex-col">
          {/* 商品名
              - text-3xl: 文字サイズを大きく（1.875rem = 30px）
              - font-bold: 文字の太さを太字にする
              - text-gray-900: 文字色をほぼ黒（900番）にする
              - mb-4: 下側のマージンを1rem（16px）空ける
          */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>
          
          {/* 価格表示（3桁ごとにカンマ区切り）
              - text-2xl: 文字サイズをやや大きく（1.5rem = 24px）
              - font-bold: 太字
              - text-gray-900: ほぼ黒
              - mb-6: 下側のマージンを1.5rem（24px）空ける
          */}
          <div className="text-2xl font-bold text-gray-900 mb-6">
            ¥{product.price.toLocaleString()}
          </div>

          {/* 商品説明
              - prose: Tailwind Typographyプラグインのクラス。文章をきれいに表示する
              - prose-sm: 文章全体のサイズを少し小さめにする
              - text-gray-600: 文字色をグレー（600番）にする
              - mb-8: 下側のマージンを2rem（32px）空ける
          */}
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
                // ボタンのスタイル
                // - w-full: 幅を親要素いっぱいに広げる
                // - bg-pink-500: 背景色をピンク（500番）
                // - text-white: 文字色を白
                // - py-3: 上下のパディングを0.75rem（12px）
                // - px-6: 左右のパディングを1.5rem（24px）
                // - rounded-lg: 角を丸くする（0.5rem = 8px）
                // - font-medium: 文字の太さを中くらい（Medium）にする
                // - hover:bg-pink-600: ホバー時に背景色を少し濃いピンクにする
                // - transition-colors: 色の変化をアニメーションさせる
                // - focus:outline-none: フォーカス時のデフォルトの枠線を消す
                // - focus:ring-2: フォーカス時に2pxのリング（枠線）を表示
                // - focus:ring-pink-500: リングの色をピンクにする
                // - focus:ring-offset-2: リングとボタンの間に2pxの隙間を空ける
                className="w-full bg-pink-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-pink-600 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                aria-label="カートに入れる"  // アクセシビリティ対応（スクリーンリーダー用）
              >
                カートに入れる 🐰
              </button>
            ) : (
              /* 在庫がない場合: 無効化されたボタン
                 - bg-gray-300: 背景色を薄いグレーにする
                 - text-gray-500: 文字色をグレーにする
                 - cursor-not-allowed: マウスカーソルを「禁止」マークにする
              */
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
