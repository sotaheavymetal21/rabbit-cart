'use client'

import { useCartStore } from '@/utils/store'
import { useState } from 'react'

// コンポーネントのprops型定義
interface AddToCartButtonProps {
  product: {
    id: string
    name: string
    price: number
    image_url: string | null
    stock: number
  }
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  // ZustandストアからaddItemアクションを取得
  const addItem = useCartStore((state) => state.addItem)
  // 追加完了時のフィードバック用state
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = () => {
    // カートに追加
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    })
    
    // フィードバックを表示
    setIsAdded(true)
    // 2秒後に元に戻す
    setTimeout(() => setIsAdded(false), 2000)
  }

  // 在庫がない場合
  if (product.stock <= 0) {
    return (
      <button
        disabled
        className="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-lg font-medium cursor-not-allowed"
      >
        売り切れ
      </button>
    )
  }

  // 在庫がある場合
  return (
    <button
      onClick={handleAddToCart}
      // 追加済みかどうかでスタイルを切り替え
      className={`w-full py-3 px-6 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${
        isAdded
          ? 'bg-green-500 text-white hover:bg-green-600'
          : 'bg-pink-500 text-white hover:bg-pink-600'
      }`}
      aria-label="カートに入れる"
    >
      {isAdded ? 'カートに追加しました！ 🐰' : 'カートに入れる 🐰'}
    </button>
  )
}
