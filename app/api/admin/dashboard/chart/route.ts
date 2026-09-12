import { NextResponse } from "next/server"
import { getAuthCookie } from "@/lib/auth/token"
import { getAdminChartApi } from "@/lib/admin/api"

export async function GET() {
  const token = await getAuthCookie()
  if (!token) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })

  const response = await getAdminChartApi(token)
  if (!response.success || !response.data) {
    return NextResponse.json(
      { ok: false, error: response.error ?? "Gagal mengambil chart admin" },
      { status: response.status }
    )
  }
  return NextResponse.json({ ok: true, data: response.data })
}
