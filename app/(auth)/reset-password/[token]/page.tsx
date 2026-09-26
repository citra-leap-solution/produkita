import ResetPasswordForm from '@/components/pages/auth/reset-password'
import AuthSideImage from '@/components/pages/auth/partials/side-image'
import InvalidLink from '@/components/pages/auth/partials/invalid-link'
import { verifyResetTokenApi } from '@/lib/auth/api'

interface ResetPasswordPageProps {
  params: Promise<{ token: string }>
}

export default async function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const { token: rawToken } = await params
  const token = decodeURIComponent(rawToken)

  const res = await verifyResetTokenApi(token).catch(() => null)
  const email = res?.success ? res.data?.email : undefined

  return (
    <div className="min-h-screen flex">
      <AuthSideImage />
      <div className="flex-1 bg-white">
        {email ? <ResetPasswordForm email={email} token={token} /> : <InvalidLink />}
      </div>
    </div>
  )
}
