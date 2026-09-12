import { NextResponse } from "next/server"
import { getAuthCookie } from "@/lib/auth/token"
import { getAdminTenantProductsApi } from "@/lib/admin/api"

export async function GET(_request: Request, { params }: { params: Promise<{ uuid: string }> }) {
  const { uuid } = await params
  const token = await getAuthCookie()
  if (!token) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })

  const response = await getAdminTenantProductsApi(token, uuid)
  if (!response.success) {
    return NextResponse.json(
      { ok: false, error: response.error ?? "Gagal mengambil produk UMKM" },
      { status: response.status }
    )
  }
  return NextResponse.json({ ok: true, data: response.data ?? [] })
}
