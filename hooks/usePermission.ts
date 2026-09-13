"use client";

import { useCallback, useState } from "react";
import type {
  AdminPackagePriceItem,
  AdminPackagePriceUpdate,
  AdminPermissionFeatureKey,
  AdminPermissionItem,
  AdminPermissionUpdate,
  AdminTenantPackage,
} from "@/lib/admin/api";
import type { MyPermissionData } from "@/lib/permission/api";

type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

type PermissionUpdateItem = {
  package: AdminTenantPackage;
  key: AdminPermissionFeatureKey;
  data: AdminPermissionUpdate;
};

type PriceUpdateItem = {
  package: AdminTenantPackage;
  data: AdminPackagePriceUpdate;
};

async function apiCall<T>(
  path: string,
  method: "GET" | "PUT" = "GET",
  body?: unknown,
): Promise<ApiResult<T>> {
  const response = await fetch(path, {
    method,
    headers:
      body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.ok) {
    return { ok: false, error: payload.error ?? "Terjadi kesalahan" };
  }
  return { ok: true, data: payload.data };
}

export type PermissionConfiguration = {
  permissions: AdminPermissionItem[];
  prices: AdminPackagePriceItem[];
};

export function usePermission() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async <T>(request: () => Promise<ApiResult<T>>) => {
      setLoading(true);
      setError(null);
      try {
        const result = await request();
        if (!result.ok) {
          setError(result.error);
          return null;
        }
        return result.data;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Terjadi kesalahan";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getConfiguration = useCallback(
    () =>
      execute<PermissionConfiguration>(async () => {
        const [permissions, prices] = await Promise.all([
          apiCall<AdminPermissionItem[]>("/api/admin/permissions"),
          apiCall<AdminPackagePriceItem[]>("/api/admin/permissions/prices"),
        ]);

        if (!permissions.ok) return permissions;
        if (!prices.ok) return prices;
        return {
          ok: true,
          data: { permissions: permissions.data, prices: prices.data },
        };
      }),
    [execute],
  );

  const getMyPermissions = useCallback(
    () => execute(() => apiCall<MyPermissionData>("/api/permissions/me")),
    [execute],
  );

  const savePermissions = useCallback(
    (updates: PermissionUpdateItem[]) =>
      execute<AdminPermissionItem[]>(async () => {
        const results = await Promise.all(
          updates.map(({ package: pkg, key, data }) =>
            apiCall<AdminPermissionItem>(
              `/api/admin/permissions/${encodeURIComponent(pkg)}/${encodeURIComponent(key)}`,
              "PUT",
              data,
            ),
          ),
        );
        const data: AdminPermissionItem[] = [];
        for (const result of results) {
          if (!result.ok) return result;
          data.push(result.data);
        }
        return { ok: true, data };
      }),
    [execute],
  );

  const savePrices = useCallback(
    (updates: PriceUpdateItem[]) =>
      execute<AdminPackagePriceItem[]>(async () => {
        const results = await Promise.all(
          updates.map(({ package: pkg, data }) =>
            apiCall<AdminPackagePriceItem>(
              `/api/admin/permissions/prices/${encodeURIComponent(pkg)}`,
              "PUT",
              data,
            ),
          ),
        );
        const data: AdminPackagePriceItem[] = [];
        for (const result of results) {
          if (!result.ok) return result;
          data.push(result.data);
        }
        return { ok: true, data };
      }),
    [execute],
  );

  return {
    loading,
    error,
    getConfiguration,
    getMyPermissions,
    savePermissions,
    savePrices,
  };
}
