"use client"

import { useCallback, useState } from "react"
import type {
  AdminChart,
  AdminDistribution,
  AdminProductListItem,
  AdminStatistics,
  AdminTenantDetail,
  AdminTenantListItem,
} from "@/lib/admin/api"

type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string }

async function apiCall<T>(path: string): Promise<ApiResult<T>> {
  const response = await fetch(path)
  const payload = await response.json().catch(() => ({}))
  if (!response.ok || !payload.ok) {
    return { ok: false, error: payload.error ?? "Terjadi kesalahan" }
  }
  return { ok: true, data: payload.data }
}

export type AdminDashboardData = {
  statistics: AdminStatistics
  distribution: AdminDistribution
  chart: AdminChart
}

export type AdminTenantDetailData = {
  tenant: AdminTenantDetail
  products: AdminProductListItem[]
}

export function useAdmin() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async <T>(request: () => Promise<ApiResult<T>>) => {
    setLoading(true)
    setError(null)
    try {
      const result = await request()
      if (!result.ok) {
        setError(result.error)
        return null
      }
      return result.data
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan"
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const getDashboard = useCallback(
    () =>
      execute<AdminDashboardData>(async () => {
        const [statistics, distribution, chart] = await Promise.all([
          apiCall<AdminStatistics>("/api/admin/dashboard/statistics"),
          apiCall<AdminDistribution>("/api/admin/dashboard/distribution"),
          apiCall<AdminChart>("/api/admin/dashboard/chart"),
        ])

        if (!statistics.ok) return statistics
        if (!distribution.ok) return distribution
        if (!chart.ok) return chart

        return {
          ok: true,
          data: {
            statistics: statistics.data,
            distribution: distribution.data,
            chart: chart.data,
          },
        }
      }),
    [execute]
  )

  const getTenants = useCallback(
    () => execute(() => apiCall<AdminTenantListItem[]>("/api/admin/users")),
    [execute]
  )

  const getTenantDetail = useCallback(
    (uuid: string) =>
      execute<AdminTenantDetailData>(async () => {
        const encodedUUID = encodeURIComponent(uuid)
        const [tenant, products] = await Promise.all([
          apiCall<AdminTenantDetail>(`/api/admin/users/${encodedUUID}`),
          apiCall<AdminProductListItem[]>(`/api/admin/users/${encodedUUID}/products`),
        ])

        if (!tenant.ok) return tenant
        if (!products.ok) return products

        return { ok: true, data: { tenant: tenant.data, products: products.data } }
      }),
    [execute]
  )

  return { loading, error, getDashboard, getTenants, getTenantDetail }
}
