'use client'

import Link from 'next/link'
import { ShoppingCart, User } from 'lucide-react'

import { useCartStore } from '@/utils/store'
import { useEffect, useState } from 'react'

export default function Header() {
  // カート内の商品数を取得
  // Hydration Mismatchを防ぐため、マウント状態を管理
  const items = useCartStore((state) => state.items)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // カート内の商品総数を計算
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)

  return (
    // ヘッダー全体: 白背景、影付き、上部固定（sticky）
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* コンテナ: 高さ指定、Flexboxで左右配置 */}
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* ロゴエリア */}
        <Link href="/" className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <span>🐰</span>
          <span>rabbit-cart</span>
        </Link>

        {/* ナビゲーションエリア */}
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium">
            商品一覧
          </Link>
          
          {/* カートリンク */}
          <Link href="/cart" className="relative text-gray-600 hover:text-gray-900">
            <ShoppingCart className="w-6 h-6" />
            {/* カートバッジ: マウント後かつ商品がある場合のみ表示 */}
            {mounted && totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {/* ログインリンク（仮） */}
          <Link href="/login" className="text-gray-600 hover:text-gray-900 flex items-center gap-2 font-medium">
            <User className="w-5 h-5" />
            <span>ログイン</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}
