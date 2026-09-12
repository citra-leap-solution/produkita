"use client"

import { useEffect, useState } from "react"
import { useAuthStore, type UserRole } from "@/stores/useAuthStore"

type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string }

async function apiCall<T>(path: string, method: string, body?: unknown): Promise<ApiResult<T>> {
  const res = await fetch(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  })
  const json = await res.json()
  if (!res.ok || !json.ok) {
    return { ok: false, error: json.error ?? "Terjadi kesalahan" }
  }
  return { ok: true, data: json.data }
}

export const useAuth = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionReady, setSessionReady] = useState(false)

  const { uuid, email, role, name, setSession, clearSession } = useAuthStore()

  useEffect(() => {
    setSessionReady(useAuthStore.persist.hasHydrated())
    return useAuthStore.persist.onFinishHydration(() => setSessionReady(true))
  }, [])

  const handleLogin = async (email: string, password: string, rememberMe: boolean = false) => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiCall<{ uuid: string; email: string; role: UserRole; name: string | null }>(
        "/api/auth/login",
        "POST",
        { email, password, rememberMe }
      )
      if (!result.ok) {
        setError(result.error)
        return null
      }
      setSession(result.data)
      return result.data
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (
    email: string,
    password: string,
    name: string,
    tenantName: string
  ) => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiCall<{ email: string }>("/api/auth/register", "POST", {
        email,
        password,
        name,
        tenantName,
      })
      if (!result.ok) {
        setError(result.error)
        return null
      }
      return result.data
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (email: string, otp: string) => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiCall<{ email: string }>("/api/auth/verify-otp", "POST", { email, otp })
      if (!result.ok) {
        setError(result.error)
        return null
      }
      return result.data
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async (email: string) => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiCall<{ email: string }>("/api/auth/resend-otp", "POST", { email })
      if (!result.ok) {
        setError(result.error)
        return null
      }
      return result.data
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    setLoading(true)
    setError(null)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      clearSession()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getSession = async () => {
    const res = await fetch("/api/auth/session")
    const json = await res.json()
    return json.session
  }

  const handleUpdateProfile = async (data: { name?: string; phonenumber?: string }) => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiCall("/api/auth/profile", "PUT", data)
      if (!result.ok) {
        setError(result.error)
        return null
      }
      return result.data
    } finally {
      setLoading(false)
    }
  }

  const handleRequestUpdateEmail = async (newEmail: string) => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiCall<{ email: string }>("/api/auth/email/request", "POST", { newEmail })
      if (!result.ok) {
        setError(result.error)
        return null
      }
      return result.data
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyUpdateEmail = async (newEmail: string, otp: string) => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiCall<{ email: string }>("/api/auth/email/verify", "POST", { newEmail, otp })
      if (!result.ok) {
        setError(result.error)
        return null
      }
      return result.data
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePassword = async (oldPassword: string, newPassword: string) => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiCall("/api/auth/password", "PUT", { oldPassword, newPassword })
      if (!result.ok) {
        setError(result.error)
        return null
      }
      return result.data
    } finally {
      setLoading(false)
    }
  }

  return {
    uuid,
    email,
    role,
    name,
    sessionReady,
    isAdmin: role === "admin" || role === "superadmin",
    isUser: role === "user",
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    verifyOtp: handleVerifyOtp,
    resendOtp: handleResendOtp,
    logout: handleLogout,
    getSession,
    updateProfile: handleUpdateProfile,
    requestUpdateEmail: handleRequestUpdateEmail,
    verifyUpdateEmail: handleVerifyUpdateEmail,
    updatePassword: handleUpdatePassword,
  }
}
