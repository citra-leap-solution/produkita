import MagicLogin from '@/components/pages/auth/magic-login'
import AuthSideImage from '@/components/pages/auth/partials/side-image'

interface MagicLoginPageProps {
  params: Promise<{ token: string }>
}

export default async function MagicLoginPage({ params }: MagicLoginPageProps) {
  const { token } = await params

  return (
    <div className="min-h-screen flex">
      <AuthSideImage />
      <div className="flex-1 bg-white">
        <MagicLogin token={decodeURIComponent(token)} />
      </div>
    </div>
  )
}
