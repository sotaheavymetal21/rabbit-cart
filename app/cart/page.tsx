'use client'

import { useCartStore } from '@/utils/store'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Plus, Minus } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function CartPage() {
  // Zustandストアから状態とアクションを取得
  const { items, removeItem, updateQuantity, getTotalAmount } = useCartStore()
  
  // Hydration Mismatchを防ぐためのマウント状態管理
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // マウントされるまでは何も表示しない（サーバーとクライアントのHTML不一致を防ぐ）
  if (!mounted) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">カート 🛒</h1>

      {items.length === 0 ? (
        // カートが空の場合の表示
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-6">カートは空です 🐰</p>
          <Link
            href="/"
            className="inline-block bg-pink-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-pink-600 transition-colors"
          >
            商品一覧へ戻る
          </Link>
        </div>
      ) : (
        // カートに商品がある場合の表示（2カラムレイアウト）
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左側: 商品リスト */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100"
              >
                {/* 商品画像 */}
                <div className="relative w-24 h-24 shrink-0">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                </div>

                {/* 商品情報 */}
                <div className="grow text-center sm:text-left">
                  <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                  <p className="text-gray-500">¥{item.price.toLocaleString()}</p>
                </div>

                {/* 操作エリア（数量変更・削除） */}
                <div className="flex items-center gap-4">
                  {/* 数量変更ボタン */}
                  <div className="flex items-center border rounded-md">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-gray-50 text-gray-600"
                      aria-label="数量を減らす"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium text-gray-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-gray-50 text-gray-600"
                      aria-label="数量を増やす"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 削除ボタン */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    aria-label="削除"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 右側: 注文サマリー */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">注文内容</h2>
              <div className="flex justify-between mb-4 text-lg">
                <span className="text-gray-600">合計</span>
                <span className="font-bold text-gray-900">¥{getTotalAmount().toLocaleString()}</span>
              </div>
              <button
                className="w-full bg-pink-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-pink-600 transition-colors"
                onClick={() => alert('注文機能はまだ実装されていません 🐰')}
              >
                注文へ進む
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
