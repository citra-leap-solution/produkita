type ApiEnvelope<T> = {
  success: boolean
  message?: string
  data?: T
  error?: string
}

const BACKEND_API_URL = process.env.BACKEND_API_URL!
const BACKEND_API_KEY = process.env.BACKEND_API_KEY!
const API_VERSION = "v1"

async function callAuthApi<T>(path: string, body: unknown): Promise<ApiEnvelope<T>> {
  const res = await fetch(`${BACKEND_API_URL}/${API_VERSION}/auth${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": BACKEND_API_KEY,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  })

  return (await res.json()) as ApiEnvelope<T>
}

async function callAuthApiWithToken<T>(path: string, token: string, method: string, body?: unknown): Promise<ApiEnvelope<T>> {
  const res = await fetch(`${BACKEND_API_URL}/${API_VERSION}/auth${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": BACKEND_API_KEY,
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  })

  return (await res.json()) as ApiEnvelope<T>
}

export const registerApi = (email: string, password: string, name: string, tenantName: string) => {
  return callAuthApi<{ email: string }>("/register", {
    email,
    password,
    name,
    tenant_name: tenantName,
  })
}

export const loginApi = (email: string, password: string, rememberMe: boolean) => {
  return callAuthApi<{
    token: string
    user: { uuid: string; email: string; role: string; name: string | null }
  }>("/login", {
    email,
    password,
    remember_me: rememberMe,
  })
}

export const verifyOtpApi = (email: string, otp: string) => {
  return callAuthApi<{ email: string }>("/verify-otp", { email, otp })
}

export const resendOtpApi = (email: string) => {
  return callAuthApi<{ email: string }>("/resend-otp", { email })
}

export const updateProfileApi = (token: string, data: { name?: string; phonenumber?: string }) => {
  return callAuthApiWithToken("/profile", token, "PUT", data)
}

export const requestUpdateEmailApi = (token: string, newEmail: string) => {
  return callAuthApiWithToken<{ email: string }>("/update-email/request", token, "POST", { new_email: newEmail })
}

export const verifyUpdateEmailApi = (token: string, newEmail: string, otp: string) => {
  return callAuthApiWithToken<{ email: string }>("/update-email/verify", token, "POST", { new_email: newEmail, otp })
}

export const updatePasswordApi = (token: string, oldPassword: string, newPassword: string) => {
  return callAuthApiWithToken("/password", token, "PUT", { old_password: oldPassword, new_password: newPassword })
}

export const forgotPasswordApi = (email: string) => {
  return callAuthApi<{ email: string }>("/forgot-password", { email })
}

export const verifyResetTokenApi = (token: string) => {
  return callAuthApi<{ email: string }>("/reset-password/verify", { token })
}

export const resetPasswordApi = (token: string, newPassword: string) => {
  return callAuthApi<{ reset: boolean }>("/reset-password", { token, new_password: newPassword })
}

export const magicLoginApi = (token: string) => {
  return callAuthApi<{
    token: string
    user: { uuid: string; email: string; role: string; name: string | null }
  }>("/magic-login", { token })
}
