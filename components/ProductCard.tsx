import Image from 'next/image'
import { Product } from '@/types/product'
import Link from 'next/link'

// コンポーネントが受け取るpropsの型定義
interface ProductCardProps {
  product: Product // 商品データの型
}

// 商品カードを表示するコンポーネント
export default function ProductCard({ product }: ProductCardProps) {
  return (
    // カード全体をリンクにする。クリックすると商品詳細ページへ遷移。
    // group: 子要素のホバー時のスタイル制御に使用
    <Link href={`/products/${product.id}`} className="group block">
      {/* カードの外枠：ボーダー、角丸、影、ホバー時の影の強調 */}
      <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
        
        {/* 商品画像の表示エリア：正方形（aspect-square）を維持 */}
        <div className="relative w-full aspect-square bg-gray-100">
          {product.image_url ? (
            // 画像がある場合：Next.jsのImageコンポーネントで最適化して表示
            <Image
              src={product.image_url}
              alt={product.name}
              fill // 親要素いっぱいに広げる
              // object-cover: アスペクト比を維持して隙間なく埋める
              // group-hover:scale-105: カードホバー時に画像を少し拡大
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              // レスポンシブ対応の画像サイズ指定
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            // 画像がない場合のプレースホルダー
            <div className="flex items-center justify-center h-full text-gray-400">
              画像なし
            </div>
          )}
        </div>

        {/* 商品情報の表示エリア */}
        <div className="p-4">
          {/* 商品名：ホバー時にピンク色に変化 */}
          <h3 className="text-lg font-medium text-gray-900 group-hover:text-pink-500 transition-colors">
            {product.name}
          </h3>
          {/* 商品説明：2行を超えたら「...」で省略（line-clamp-2） */}
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
            {product.description}
          </p>
          
          {/* 価格と在庫状況 */}
          <div className="mt-2 flex items-center justify-between">
            {/* 価格：3桁区切りで表示 */}
            <span className="text-xl font-bold text-gray-900">
              ¥{product.price.toLocaleString()}
            </span>
            {/* 在庫が0の場合のみ「売り切れ」を表示 */}
            {product.stock === 0 && (
              <span className="text-sm font-medium text-red-500">売り切れ</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
