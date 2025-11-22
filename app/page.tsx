import { createClient } from '@/utils/supabase/server'
import ProductCard from '@/components/ProductCard'

export default async function Home() {
  const supabase = await createClient()
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-500">
        商品の読み込みに失敗しました。後でもう一度お試しください。
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        うさぎグッズ一覧 🐰
      </h1>
      
      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-12">
          商品が見つかりません。
        </div>
      )}
    </main>
  )
}
