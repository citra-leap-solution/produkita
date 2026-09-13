import type { AdminPermissionItem, AdminTenantPackage } from "@/lib/admin/api";

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
};

export type MyPermissionData = {
  package: AdminTenantPackage;
  permissions: AdminPermissionItem[];
};

export type MyPermissionApiResponse = ApiEnvelope<MyPermissionData> & {
  status: number;
};

const BACKEND_API_URL = process.env.BACKEND_API_URL!;
const BACKEND_API_KEY = process.env.BACKEND_API_KEY!;
const API_VERSION = "v1";

export async function getMyPermissionsApi(
  token: string,
): Promise<MyPermissionApiResponse> {
  const response = await fetch(
    `${BACKEND_API_URL}/${API_VERSION}/permissions/me`,
    {
      method: "GET",
      headers: {
        "X-Api-Key": BACKEND_API_KEY,
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  const payload = (await response.json().catch(() => ({
    success: false,
    error: "Respons backend tidak valid",
  }))) as ApiEnvelope<MyPermissionData>;

  return { ...payload, status: response.status };
}
