import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// カート内の商品アイテムの型定義
export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image_url: string | null
}

// カートストアの状態とアクションの型定義
interface CartStore {
  items: CartItem[] // カート内の商品リスト
  addItem: (item: Omit<CartItem, 'quantity'>) => void // 商品を追加する関数
  removeItem: (id: string) => void // 商品を削除する関数
  updateQuantity: (id: string, quantity: number) => void // 数量を変更する関数
  clearCart: () => void // カートを空にする関数
  getTotalAmount: () => number // 合計金額を計算する関数
}

// Zustandストアの作成
// persistミドルウェアを使用して、データをローカルストレージに保存します
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [], // 初期状態は空配列

      // 商品を追加する処理
      addItem: (item) => {
        const currentItems = get().items
        // 既にカートに同じ商品があるか確認
        const existingItem = currentItems.find((i) => i.id === item.id)

        if (existingItem) {
          // ある場合は数量を+1
          set({
            items: currentItems.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          })
        } else {
          // ない場合は新規追加（数量1）
          set({ items: [...currentItems, { ...item, quantity: 1 }] })
        }
      },

      // 商品を削除する処理
      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) })
      },

      // 数量を変更する処理
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          // 0以下になったら削除
          get().removeItem(id)
        } else {
          // それ以外は数量を更新
          set({
            items: get().items.map((i) =>
              i.id === id ? { ...i, quantity } : i
            ),
          })
        }
      },

      // カートをクリアする処理
      clearCart: () => set({ items: [] }),

      // 合計金額を計算する処理
      getTotalAmount: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
    }),
    {
      name: 'cart-storage', // ローカルストレージのキー名
    }
  )
)
