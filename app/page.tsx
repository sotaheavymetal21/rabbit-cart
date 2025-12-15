// ===========================
// インポート: 必要な機能を読み込む
// ===========================

import ProductCard from '@/components/ProductCard'
import { apiRequest } from '@/lib/api'
import { Product } from '@/types/product'

// ===========================
// メインコンポーネント: トップページ（商品一覧）
// ===========================

/**
 * トップページのコンポーネント
 * async/awaitを使用しているため、これは「Server Component」です。
 * サーバー側でバックエンドAPIからデータを取得し、HTMLを生成してからブラウザに送ります。
 */
export default async function Home() {
  // ===========================
  // データ取得: バックエンドAPIから商品一覧を取得
  // ===========================

  let products: Product[] = []
  let error: unknown = null

  try {
    products = await apiRequest<Product[]>('/products') || []
  } catch (e) {
    error = e
    console.error('Error fetching products:', e)
  }

  // ===========================
  // エラーハンドリング
  // ===========================
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-500">
        商品の読み込みに失敗しました。後でもう一度お試しください。
      </div>
    )
  }

  // ===========================
  // UI レンダリング: 商品一覧の表示
  // ===========================

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">
        うさぎグッズ一覧 🐰
      </h1>
      
      { products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center text-white py-12">
          商品が見つかりません。
        </div>
      )}
    </main>
  )
}
