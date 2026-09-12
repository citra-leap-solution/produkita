import { NextResponse } from "next/server"
import { getAuthCookie } from "@/lib/auth/token"
import { getAdminStatisticsApi } from "@/lib/admin/api"

export async function GET() {
  const token = await getAuthCookie()
  if (!token) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })

  const response = await getAdminStatisticsApi(token)
  if (!response.success || !response.data) {
    return NextResponse.json(
      { ok: false, error: response.error ?? "Gagal mengambil statistik admin" },
      { status: response.status }
    )
  }
  return NextResponse.json({ ok: true, data: response.data })
}
