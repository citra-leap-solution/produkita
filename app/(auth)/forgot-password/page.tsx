import ForgotPasswordForm from '@/components/pages/auth/forgot-password'
import AuthSideImage from '@/components/pages/auth/partials/side-image'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex">
      <AuthSideImage />

      <div className="flex-1 bg-white">
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
