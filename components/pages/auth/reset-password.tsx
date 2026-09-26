'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { useAuth } from '@/hooks/useAuth'

interface ResetPasswordFormProps {
  email: string
  token: string
}

export default function ResetPasswordForm({ email, token }: ResetPasswordFormProps) {
  const router = useRouter()
  const { resetPassword, loading, error } = useAuth()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    if (error) toast.error('Gagal mengganti kata sandi', { description: error })
  }, [error])

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()

    if (password.length < 6) {
      toast.error('Kata sandi terlalu pendek', { description: 'Kata sandi minimal 6 karakter.' })
      return
    }
    if (password !== confirmPassword) {
      toast.error('Kata sandi tidak sama', { description: 'Pastikan konfirmasi kata sandi sesuai.' })
      return
    }

    const result = await resetPassword(token, password)
    if (result) {
      toast.success('Kata sandi diperbarui', { description: 'Silakan masuk dengan kata sandi baru Anda.' })
      router.push('/login')
    }
  }

  const inputClass =
    'w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400'

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-12 lg:px-16 py-12 bg-white">
      <div className="max-w-md w-full">
        <Logo className="mb-8" />

        <h1 className="text-3xl font-bold text-slate-900 mb-3">Buat Kata Sandi Baru</h1>
        <p className="text-slate-600 mb-2">Masukkan kata sandi baru untuk akun</p>
        <p className="text-slate-900 font-semibold mb-8 break-all">{email}</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-900 mb-2">
              Kata Sandi Baru
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                className={inputClass}
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

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-900 mb-2">
              Konfirmasi Kata Sandi
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Ulangi kata sandi baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900 hover:cursor-pointer"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-6 rounded-lg transition-colors"
          >
            {loading ? 'Menyimpan...' : 'Simpan Kata Sandi'}
          </Button>
        </form>

        <Link
          href="/login"
          className="mt-8 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Kembali ke halaman login
        </Link>
      </div>
    </div>
  )
}
