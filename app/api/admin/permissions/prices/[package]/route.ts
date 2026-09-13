import { NextResponse } from "next/server";
import { updateAdminPackagePriceApi } from "@/lib/admin/api";
import type {
  AdminPackagePriceUpdate,
  AdminTenantPackage,
} from "@/lib/admin/api";
import { getAuthCookie } from "@/lib/auth/token";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ package: string }> },
) {
  const token = await getAuthCookie();
  if (!token)
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );

  const { package: pkg } = await params;
  const data = (await request
    .json()
    .catch(() => null)) as AdminPackagePriceUpdate | null;
  if (!data) {
    return NextResponse.json(
      { ok: false, error: "Data harga paket tidak valid" },
      { status: 400 },
    );
  }

  const response = await updateAdminPackagePriceApi(
    token,
    pkg as AdminTenantPackage,
    data,
  );
  if (!response.success || !response.data) {
    return NextResponse.json(
      { ok: false, error: response.error ?? "Gagal menyimpan harga paket" },
      { status: response.status },
    );
  }
  return NextResponse.json({ ok: true, data: response.data });
}
