'use client'

import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import Link from 'next/link'

export default function SignupPage() {
  // フォームの状態管理
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const supabase = createClient()

  // 新規登録処理
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // バリデーション
    if (password !== confirmPassword) {
      setError('パスワードが一致しません')
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError('パスワードは8文字以上で入力してください')
      setLoading(false)
      return
    }

    // Supabase Authでサインアップ
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true) // 成功フラグを立てる
      setLoading(false)
    }
  }

  // 登録成功時の表示
  if (success) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md text-center">
        <div className="bg-green-50 text-green-700 p-8 rounded-lg mb-6">
          <h2 className="text-2xl font-bold mb-4">確認メールを送信しました 🐰</h2>
          <p>
            {email} 宛に確認メールを送信しました。<br />
            メール内のリンクをクリックして登録を完了してください。
          </p>
        </div>
        <Link href="/login" className="text-pink-500 hover:text-pink-600 font-medium">
          ログイン画面へ戻る
        </Link>
      </div>
    )
  }

  // 登録フォーム
  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">新規登録 🐰</h1>
      
      <form onSubmit={handleSignup} className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">メールアドレス</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">パスワード (8文字以上)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
            required
            minLength={8}
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">パスワード (確認)</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
            required
            minLength={8}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-500 text-white py-3 rounded-lg font-medium hover:bg-pink-600 transition-colors disabled:opacity-50"
        >
          {loading ? '登録中...' : '登録する'}
        </button>

        <div className="mt-6 text-center text-sm text-gray-600">
          すでにアカウントをお持ちの方は{' '}
          <Link href="/login" className="text-pink-500 hover:text-pink-600 font-medium">
            ログイン
          </Link>
        </div>
      </form>
    </div>
  )
}
