export type ApiEnvelope<T> = {
  success: boolean
  message?: string
  data?: T
  error?: string
}

export type AdminApiResponse<T> = ApiEnvelope<T> & { status: number }

export type AdminStatCard = {
  total: number
  percent_from_last_month: number
}

export type AdminStatistics = {
  total_tenants: AdminStatCard
  active_tenants: AdminStatCard
  inactive_tenants: AdminStatCard
  total_products: AdminStatCard
}

export type AdminPackageDistributionItem = {
  package: string
  total: number
  percentage: number
}

export type AdminStatusDistributionItem = {
  status: string
  total: number
  percentage: number
}

export type AdminCategoryDistributionItem = {
  category: string
  total: number
  percentage: number
}

export type AdminDistribution = {
  total_tenants: number
  package_distribution: AdminPackageDistributionItem[]
}

export type AdminChart = {
  total_tenants: number
  total_products: number
  status_distribution: AdminStatusDistributionItem[]
  package_distribution: AdminPackageDistributionItem[]
  category_distribution: AdminCategoryDistributionItem[]
}

export type AdminTenantListItem = {
  uuid: string
  name: string
  products_count: number
  package: string
  status: string
}

export type AdminTenantDetail = {
  uuid: string
  name: string | null
  trade_name: string | null
  business_field: string | null
  npwp: string | null
  description: string | null
  address: string | null
  city: string | null
  postal_code: string | null
  province: string | null
  email: string | null
  phonenumber: string | null
  website: string | null
  year: number | null
  status: string
  package: string
  joined_at: string
  pic_name: string | null
  pic_email: string
  products_count: number
}

export type AdminProductListItem = {
  uuid: string
  name: string
  status: string
  qr_code_url: string | null
}

const BACKEND_API_URL = process.env.BACKEND_API_URL!
const BACKEND_API_KEY = process.env.BACKEND_API_KEY!
const API_VERSION = "v1"

async function callAdminApi<T>(path: string, token: string): Promise<AdminApiResponse<T>> {
  const response = await fetch(`${BACKEND_API_URL}/${API_VERSION}/admin${path}`, {
    method: "GET",
    headers: {
      "X-Api-Key": BACKEND_API_KEY,
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  })

  const payload = (await response.json().catch(() => ({
    success: false,
    error: "Respons backend tidak valid",
  }))) as ApiEnvelope<T>

  return { ...payload, status: response.status }
}

export const getAdminStatisticsApi = (token: string) =>
  callAdminApi<AdminStatistics>("/dashboard/statistics", token)

export const getAdminDistributionApi = (token: string) =>
  callAdminApi<AdminDistribution>("/dashboard/distribution", token)

export const getAdminChartApi = (token: string) =>
  callAdminApi<AdminChart>("/dashboard/chart", token)

export const getAdminTenantsApi = (token: string) =>
  callAdminApi<AdminTenantListItem[]>("/users", token)

export const getAdminTenantDetailApi = (token: string, uuid: string) =>
  callAdminApi<AdminTenantDetail>(`/users/${encodeURIComponent(uuid)}`, token)

export const getAdminTenantProductsApi = (token: string, uuid: string) =>
  callAdminApi<AdminProductListItem[]>(`/users/${encodeURIComponent(uuid)}/products`, token)
