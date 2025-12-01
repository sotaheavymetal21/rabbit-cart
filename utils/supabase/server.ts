import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// サーバーサイド（Server Components, Server Actions）でSupabaseクライアントを作成する関数
export async function createClient() {
  // Next.jsのクッキーストアを取得（非同期）
  const cookieStore = await cookies()

  // Supabaseクライアントの作成と返却
  return createServerClient(
    // 環境変数からSupabaseのURLと匿名キーを取得
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // クッキーの操作方法を定義（Supabaseが認証情報を管理するために必要）
      cookies: {
        // 全てのクッキーを取得するメソッド
        getAll() {
          return cookieStore.getAll()
        },
        // クッキーをセット（保存・更新）するメソッド
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Componentからはクッキーの書き込みができないため、エラーが発生しても無視します。
            // 実際のクッキー書き込みはMiddlewareまたはServer Actionsで行われます。
          }
        },
      },
    }
  )
}
