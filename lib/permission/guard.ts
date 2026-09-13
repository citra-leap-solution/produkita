import { notFound } from "next/navigation";
import { getAuthCookie } from "@/lib/auth/token";
import { getMyPermissionsApi } from "@/lib/permission/api";
import type { AdminPermissionFeatureKey } from "@/lib/admin/api";

export async function requireFeatureAccess(
  featureKey: AdminPermissionFeatureKey,
) {
  const token = await getAuthCookie();
  if (!token) notFound();

  const response = await getMyPermissionsApi(token);
  const permission = response.data?.permissions.find(
    (item) => item.feature_key === featureKey,
  );
  if (!response.success || !permission?.is_access) notFound();
}
