import { NextResponse } from "next/server";
import { getAdminPackagePricesApi } from "@/lib/admin/api";
import { getAuthCookie } from "@/lib/auth/token";

export async function GET() {
  const token = await getAuthCookie();
  if (!token)
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );

  const response = await getAdminPackagePricesApi(token);
  if (!response.success) {
    return NextResponse.json(
      { ok: false, error: response.error ?? "Gagal mengambil harga paket" },
      { status: response.status },
    );
  }
  return NextResponse.json({ ok: true, data: response.data ?? [] });
}
