import { NextResponse } from "next/server"
import { magicLoginApi } from "@/lib/auth/api"
import { setAuthCookie } from "@/lib/auth/token"

export async function POST(request: Request) {
  const { token } = await request.json()

  const res = await magicLoginApi(token)
  if (!res.success || !res.data) {
    return NextResponse.json({ ok: false, error: res.error ?? "Link tidak valid atau sudah kedaluwarsa" }, { status: 401 })
  }

  // Store the session token issued by the backend, never the one-time link token.
  await setAuthCookie(res.data.token)

  const { uuid, email, role, name } = res.data.user
  return NextResponse.json({ ok: true, data: { uuid, email, role, name } })
}
