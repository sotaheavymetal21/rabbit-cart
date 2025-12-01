import { createBrowserClient } from '@supabase/ssr'

// クライアントサイド（Client Components）でSupabaseクライアントを作成する関数
export function createClient() {
  // 環境変数からSupabaseのURLと匿名キーを取得してクライアントを作成
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
