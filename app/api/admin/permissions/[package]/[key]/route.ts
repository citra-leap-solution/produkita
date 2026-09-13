import { NextResponse } from "next/server";
import { updateAdminPermissionApi } from "@/lib/admin/api";
import type {
  AdminPermissionFeatureKey,
  AdminPermissionUpdate,
  AdminTenantPackage,
} from "@/lib/admin/api";
import { getAuthCookie } from "@/lib/auth/token";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ package: string; key: string }> },
) {
  const token = await getAuthCookie();
  if (!token)
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );

  const { package: pkg, key } = await params;
  const data = (await request
    .json()
    .catch(() => null)) as AdminPermissionUpdate | null;
  if (!data) {
    return NextResponse.json(
      { ok: false, error: "Data permission tidak valid" },
      { status: 400 },
    );
  }

  const response = await updateAdminPermissionApi(
    token,
    pkg as AdminTenantPackage,
    key as AdminPermissionFeatureKey,
    data,
  );
  if (!response.success || !response.data) {
    return NextResponse.json(
      { ok: false, error: response.error ?? "Gagal menyimpan permission" },
      { status: response.status },
    );
  }
  return NextResponse.json({ ok: true, data: response.data });
}
