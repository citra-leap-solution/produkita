import { NextResponse } from "next/server"
import { resetPasswordApi } from "@/lib/auth/api"

export async function POST(request: Request) {
  const { token, newPassword } = await request.json()

  const res = await resetPasswordApi(token, newPassword)
  if (!res.success) {
    return NextResponse.json({ ok: false, error: res.error ?? "Gagal mengganti password" }, { status: 400 })
  }

  return NextResponse.json({ ok: true, data: { reset: true } })
}
