import { NextResponse } from "next/server"
import { getAuthCookie } from "@/lib/auth/token"
import { getAdminTenantsApi } from "@/lib/admin/api"

export async function GET() {
  const token = await getAuthCookie()
  if (!token) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })

  const response = await getAdminTenantsApi(token)
  if (!response.success) {
    return NextResponse.json(
      { ok: false, error: response.error ?? "Gagal mengambil daftar UMKM" },
      { status: response.status }
    )
  }
  return NextResponse.json({ ok: true, data: response.data ?? [] })
}
