import Link from 'next/link'
import { LinkIcon } from 'lucide-react'
import { Logo } from '@/components/ui/logo'

interface InvalidLinkProps {
  message?: string
}

export default function InvalidLink({
  message = 'Link sudah pernah digunakan atau sudah melewati batas waktu. Silakan minta link baru.',
}: InvalidLinkProps) {
  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-12 lg:px-16 py-12 bg-white">
      <div className="max-w-md w-full">
        <Logo className="mb-8" />

        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-6">
          <LinkIcon size={26} className="text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Link Tidak Valid</h1>
        <p className="text-slate-600 mb-8">{message}</p>

        <Link
          href="/forgot-password"
          className="flex w-full items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 rounded-lg transition-colors"
        >
          Minta Link Baru
        </Link>

        <p className="text-center text-sm text-slate-600 mt-6">
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Kembali ke halaman login
          </Link>
        </p>
      </div>
    </div>
  )
}
