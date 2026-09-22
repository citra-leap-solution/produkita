import { NextResponse } from "next/server";
import {
  getAdminPackagePricesApi,
  updateAdminPackagePricesApi,
} from "@/lib/admin/api";
import type { AdminPackagePricesUpdate } from "@/lib/admin/api";
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

export async function PUT(request: Request) {
  const token = await getAuthCookie();
  if (!token)
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );

  const data = (await request
    .json()
    .catch(() => null)) as AdminPackagePricesUpdate | null;
  if (!data) {
    return NextResponse.json(
      { ok: false, error: "Data harga paket tidak valid" },
      { status: 400 },
    );
  }

  const response = await updateAdminPackagePricesApi(token, data);
  if (!response.success || !response.data) {
    return NextResponse.json(
      { ok: false, error: response.error ?? "Gagal menyimpan harga paket" },
      { status: response.status },
    );
  }
  return NextResponse.json({ ok: true, data: response.data });
}
