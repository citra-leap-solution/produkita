'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { useAuth } from '@/hooks/useAuth'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, loading, error } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  useEffect(() => {
    if (error) toast.error('Gagal masuk', { description: error })
  }, [error])

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()

    const result = await login(email, password, rememberMe)
    if (result) {
      toast.success('Berhasil masuk', { description: 'Selamat datang kembali.' })
      const redirect = searchParams.get('redirect')
      const destination = redirect?.startsWith('/dashboard') ? redirect : '/dashboard'
      router.push(destination)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-12 lg:px-16 py-12 bg-white">
      <div className="max-w-md w-full">
        <Logo className="mb-8" />

        {/* Title */}
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Selamat Datang Kembali</h1>
        <p className="text-slate-600 mb-8">Masuk untuk mengelola produk & keuangan Anda.</p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-900 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="contoh@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-900 mb-2">
              Kata Sandi
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan kata sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900 hover:cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-slate-700 cursor-pointer">
              Ingat Saya
            </label>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-6 rounded-lg transition-colors"
          >
            {loading ? 'Loading...' : 'Login'}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-8">
          Tidak punya akun?{' '}
          <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
            Daftarkan UMKM Anda Sekarang
          </Link>
        </p>
      </div>
    </div>
  )
}
