"use client"

import { useEffect, useState } from "react"
import { AlertCircle, CircleCheckBig, Package, Store, TrendingUp } from "lucide-react"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
import { Card } from "@/components/ui/card"
import { useAdmin, type AdminDashboardData } from "@/hooks/useAdmin"

const PACKAGE_COLORS = ["#94A3B8", "#60A5FA", "#7C3AED"]
const STATUS_COLORS = ["#22C55E", "#EF4444", "#F59E0B"]
const CATEGORY_COLORS = ["#7C3AED", "#A78BFA", "#60A5FA", "#34D399", "#94A3B8"]

const formatPercentage = (value: number) =>
  new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 }).format(value)

function StatCard({
  title,
  total,
  trend,
  icon: Icon,
  color,
}: {
  title: string
  total: number
  trend: number
  icon: React.ElementType
  color: "blue" | "green" | "red" | "purple"
}) {
  const isPositive = trend >= 0
  const colors = {
    blue: { bg: "bg-blue-50", text: "text-blue-600" },
    green: { bg: "bg-emerald-50", text: "text-emerald-600" },
    red: { bg: "bg-rose-50", text: "text-rose-600" },
    purple: { bg: "bg-violet-50", text: "text-violet-600" },
  }
  const selected = colors[color]

  return (
    <Card className="rounded-2xl border-slate-200 p-6 shadow-none">
      <div className="mb-4 flex items-start justify-between">
        <div className={`rounded-2xl p-3 ${selected.bg}`}>
          <Icon className={`h-6 w-6 ${selected.text}`} />
        </div>
        <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${selected.bg} ${selected.text}`}>
          <TrendingUp className={`h-3 w-3 ${isPositive ? "" : "rotate-180"}`} />
          {isPositive ? "+" : ""}{formatPercentage(trend)}%
        </div>
      </div>
      <div className="mb-1 text-4xl font-extrabold text-slate-900">
        {total.toLocaleString("id-ID")}
      </div>
      <div className="text-sm font-medium text-slate-500">{title}</div>
      <div className="mt-0.5 text-xs text-slate-400">Perubahan dari bulan lalu</div>
    </Card>
  )
}

function PackageCard({
  title,
  tier,
  count,
  percentage,
  total,
  color,
}: {
  title: string
  tier: number
  count: number
  percentage: number
  total: number
  color: string
}) {
  return (
    <Card className="gap-0 rounded-2xl border-slate-200 p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">
          {title}
        </span>
        <span className="text-sm text-slate-400">Tier {tier}</span>
      </div>
      <div className="text-4xl font-extrabold text-slate-900">{count.toLocaleString("id-ID")}</div>
      <div className="mt-1 text-sm font-medium text-slate-500">UMKM menggunakan paket ini</div>
      <div className="mt-6">
        <div className="mb-2 flex justify-between text-xs">
          <span className="text-slate-400">dari {total.toLocaleString("id-ID")} UMKM terdaftar</span>
          <span className="font-bold" style={{ color }}>{formatPercentage(percentage)}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full" style={{ width: `${percentage}%`, backgroundColor: color }} />
        </div>
      </div>
    </Card>
  )
}

type DistributionItem = { name: string; value: number; percentage: number; color: string }

function DonutChart({ data, total, label }: { data: DistributionItem[]; total: number; label: string }) {
  return (
    <div className="relative h-40 w-40">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={70} paddingAngle={5} dataKey="value">
            {data.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-slate-900">{total.toLocaleString("id-ID")}</span>
        <span className="text-xs text-slate-400">{label}</span>
      </div>
    </div>
  )
}

function LegendBar({ item }: { item: DistributionItem }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
          <span className="font-medium text-slate-600">{item.name}</span>
        </div>
        <span className="font-bold text-slate-900">
          {item.value.toLocaleString("id-ID")} <span className="font-normal text-slate-400">({formatPercentage(item.percentage)}%)</span>
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full" style={{ width: `${item.percentage}%`, backgroundColor: item.color }} />
      </div>
    </div>
  )
}

export function AdminDashboardPage() {
  const { getDashboard, loading, error } = useAdmin()
  const [dashboard, setDashboard] = useState<AdminDashboardData | null>(null)

  useEffect(() => {
    let active = true
    void getDashboard().then((result) => {
      if (active && result) setDashboard(result)
    })
    return () => { active = false }
  }, [getDashboard])

  if (!dashboard) {
    return (
      <Card className="rounded-2xl border-slate-200 p-8 text-center shadow-none">
        <p className={error ? "text-red-600" : "text-slate-500"}>
          {error ?? (loading ? "Memuat dashboard admin..." : "Data dashboard belum tersedia")}
        </p>
      </Card>
    )
  }

  const { statistics, distribution, chart } = dashboard
  const packageData: DistributionItem[] = distribution.package_distribution.map((item, index) => ({
    name: item.package,
    value: item.total,
    percentage: item.percentage,
    color: PACKAGE_COLORS[index % PACKAGE_COLORS.length],
  }))
  const statusData: DistributionItem[] = chart.status_distribution.map((item, index) => ({
    name: item.status,
    value: item.total,
    percentage: item.percentage,
    color: STATUS_COLORS[index % STATUS_COLORS.length],
  }))
  const categoryData: DistributionItem[] = chart.category_distribution.map((item, index) => ({
    name: item.category,
    value: item.total,
    percentage: item.percentage,
    color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
  }))

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 p-6 text-white">
        <div className="space-y-2">
          <p className="text-sm font-medium text-white/80">Selamat datang kembali 👋</p>
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <p className="text-sm text-white/80">Pantau dan kelola seluruh aktivitas barcode UMKM</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="UMKM Terdaftar" total={statistics.total_tenants.total} trend={statistics.total_tenants.percent_from_last_month} icon={Store} color="blue" />
        <StatCard title="UMKM Aktif" total={statistics.active_tenants.total} trend={statistics.active_tenants.percent_from_last_month} icon={CircleCheckBig} color="green" />
        <StatCard title="UMKM Non Aktif" total={statistics.inactive_tenants.total} trend={statistics.inactive_tenants.percent_from_last_month} icon={AlertCircle} color="red" />
        <StatCard title="Produk Terdaftar" total={statistics.total_products.total} trend={statistics.total_products.percent_from_last_month} icon={Package} color="purple" />
      </div>

      <section>
        <h3 className="mb-4 text-sm font-semibold text-muted-foreground">Distribusi Paket Berlangganan</h3>
        {packageData.length === 0 ? (
          <Card className="rounded-2xl border-slate-200 p-6 text-sm text-slate-500 shadow-none">Belum ada data paket.</Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {packageData.map((item, index) => (
              <PackageCard key={item.name} title={item.name} tier={index + 1} count={item.value} percentage={item.percentage} total={distribution.total_tenants} color={item.color} />
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-2xl border-slate-200 p-6 shadow-none">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900">Distribusi UMKM & Paket</h3>
            <p className="text-sm text-slate-400">Status dan paket dari {chart.total_tenants.toLocaleString("id-ID")} UMKM</p>
          </div>
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
            <div className="flex justify-center"><DonutChart data={statusData} total={chart.total_tenants} label="UMKM" /></div>
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-[10px] font-bold tracking-wider text-slate-400">STATUS UMKM</p>
                {statusData.map((item) => <LegendBar key={item.name} item={item} />)}
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-bold tracking-wider text-slate-400">DISTRIBUSI PAKET</p>
                {packageData.map((item) => <LegendBar key={item.name} item={item} />)}
              </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border-slate-200 p-6 shadow-none">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900">Kategori Produk Terdaftar</h3>
            <p className="text-sm text-slate-400">Distribusi {chart.total_products.toLocaleString("id-ID")} produk aktif</p>
          </div>
          {categoryData.length === 0 ? (
            <p className="text-sm text-slate-500">Belum ada produk terdaftar.</p>
          ) : (
            <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
              <div className="flex justify-center"><DonutChart data={categoryData} total={chart.total_products} label="produk" /></div>
              <div className="space-y-4">{categoryData.map((item) => <LegendBar key={item.name} item={item} />)}</div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
