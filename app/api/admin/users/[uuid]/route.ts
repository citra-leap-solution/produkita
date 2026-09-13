import { NextResponse } from "next/server"
import { getAuthCookie } from "@/lib/auth/token"
import { getAdminTenantDetailApi, updateAdminTenantApi } from "@/lib/admin/api"
import type { AdminTenantUpdate } from "@/lib/admin/api"

export async function GET(_request: Request, { params }: { params: Promise<{ uuid: string }> }) {
  const { uuid } = await params
  const token = await getAuthCookie()
  if (!token) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })

  const response = await getAdminTenantDetailApi(token, uuid)
  if (!response.success || !response.data) {
    return NextResponse.json(
      { ok: false, error: response.error ?? "UMKM tidak ditemukan" },
      { status: response.status }
    )
  }
  return NextResponse.json({ ok: true, data: response.data })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ uuid: string }> }) {
  const { uuid } = await params
  const token = await getAuthCookie()
  if (!token) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })

  const data = (await request.json().catch(() => null)) as AdminTenantUpdate | null
  if (!data) {
    return NextResponse.json({ ok: false, error: "Data UMKM tidak valid" }, { status: 400 })
  }

  const response = await updateAdminTenantApi(token, uuid, data)
  if (!response.success || !response.data) {
    return NextResponse.json(
      { ok: false, error: response.error ?? "Gagal memperbarui UMKM" },
      { status: response.status }
    )
  }
  return NextResponse.json({ ok: true, data: response.data })
}
