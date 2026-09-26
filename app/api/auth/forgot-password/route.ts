import { NextResponse } from "next/server"
import { forgotPasswordApi } from "@/lib/auth/api"

export async function POST(request: Request) {
  const { email } = await request.json()

  const res = await forgotPasswordApi(email)
  if (!res.success || !res.data) {
    return NextResponse.json({ ok: false, error: res.error ?? "Gagal mengirim email" }, { status: 400 })
  }

  return NextResponse.json({ ok: true, data: { email: res.data.email } })
}
