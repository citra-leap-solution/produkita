'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Logo } from '@/components/ui/logo'
import { useAuth } from '@/hooks/useAuth'
import InvalidLink from '@/components/pages/auth/partials/invalid-link'

interface MagicLoginProps {
  token: string
}

export default function MagicLogin({ token }: MagicLoginProps) {
  const { magicLogin } = useAuth()
  const [failed, setFailed] = useState(false)
  // The link token is single-use; guard against StrictMode running the effect twice.
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    magicLogin(token).then((result) => {
      if (result) {
        toast.success('Berhasil masuk', { description: 'Selamat datang kembali.' })
        window.location.replace('/dashboard')
      } else {
        setFailed(true)
      }
    })
  }, [magicLogin, token])

  if (failed) return <InvalidLink />

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-12 lg:px-16 py-12 bg-white">
      <div className="max-w-md w-full">
        <Logo className="mb-8" />
        <div className="flex items-center gap-3 mb-3">
          <Loader2 size={28} className="text-blue-600 animate-spin" />
          <h1 className="text-3xl font-bold text-slate-900">Sedang Masuk...</h1>
        </div>
        <p className="text-slate-600">Mohon tunggu, kami sedang memverifikasi link Anda.</p>
      </div>
    </div>
  )
}
