import { NextResponse } from "next/server";
import { getAdminPermissionsApi } from "@/lib/admin/api";
import { getAuthCookie } from "@/lib/auth/token";

export async function GET() {
  const token = await getAuthCookie();
  if (!token)
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );

  const response = await getAdminPermissionsApi(token);
  if (!response.success) {
    return NextResponse.json(
      { ok: false, error: response.error ?? "Gagal mengambil permission" },
      { status: response.status },
    );
  }
  return NextResponse.json({ ok: true, data: response.data ?? [] });
}
