'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, MailCheck } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { useAuth } from '@/hooks/useAuth'

export default function ForgotPasswordForm() {
  const { forgotPassword, loading, error } = useAuth()

  const [email, setEmail] = useState('')
  const [sentTo, setSentTo] = useState<string | null>(null)

  useEffect(() => {
    if (error) toast.error('Gagal', { description: error })
  }, [error])

  const sendLink = async () => {
    const result = await forgotPassword(email)
    if (result) {
      setSentTo(email)
      toast.success('Email terkirim', { description: 'Silakan cek kotak masuk email Anda.' })
    }
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    await sendLink()
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-12 lg:px-16 py-12 bg-white">
      <div className="max-w-md w-full">
        <Logo className="mb-8" />

        {sentTo ? (
          <>
            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-6">
              <MailCheck size={28} className="text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-3">Cek Email Anda</h1>
            <p className="text-slate-600 mb-2">
              Jika email berikut terdaftar, kami telah mengirimkan link untuk mengganti kata sandi atau
              masuk langsung ke akun Anda:
            </p>
            <p className="text-slate-900 font-semibold mb-8 break-all">{sentTo}</p>

            <p className="text-sm text-slate-600">
              Tidak menerima email?{' '}
              <button
                type="button"
                onClick={sendLink}
                disabled={loading}
                className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 hover:cursor-pointer"
              >
                {loading ? 'Mengirim...' : 'Kirim ulang'}
              </button>
              {' '}atau{' '}
              <button
                type="button"
                onClick={() => setSentTo(null)}
                className="text-blue-600 hover:text-blue-700 font-medium hover:cursor-pointer"
              >
                ganti email
              </button>
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-slate-900 mb-3">Lupa Kata Sandi</h1>
            <p className="text-slate-600 mb-8">
              Masukkan email akun Anda. Kami akan mengirimkan link untuk mengganti kata sandi atau masuk langsung.
            </p>

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

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-6 rounded-lg transition-colors"
              >
                {loading ? 'Mengirim...' : 'Kirim Link'}
              </Button>
            </form>
          </>
        )}

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
