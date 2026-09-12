import { NextResponse } from "next/server"
import { getAuthCookie } from "@/lib/auth/token"
import { getAdminDistributionApi } from "@/lib/admin/api"

export async function GET() {
  const token = await getAuthCookie()
  if (!token) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })

  const response = await getAdminDistributionApi(token)
  if (!response.success || !response.data) {
    return NextResponse.json(
      { ok: false, error: response.error ?? "Gagal mengambil distribusi paket" },
      { status: response.status }
    )
  }
  return NextResponse.json({ ok: true, data: response.data })
}
