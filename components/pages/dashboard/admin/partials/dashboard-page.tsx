"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts"
import {
  Store,
  Package,
  Building2,
  TrendingUp,
  DollarSign,
  Shield,
  Settings,
  Eye,
  UserCheck,
  AlertCircle,
  ChevronRight,
  GraduationCap,
  CircleCheckBig,
} from "lucide-react"

// Mock data matching design specs
const statsData = {
  registeredUMKM: 128,
  activeUMKM: 96,
  inactiveUMKM: 32,
  totalProducts: 354,
  umkmTrend: 12,
  activeTrend: 8,
  inactiveTrend: -4,
  productsTrend: 24,
}

// Package distribution data
const packageData = [
  { name: "Gratis", tier: 1, count: 52, percentage: 40, color: "#94A3B8" },
  { name: "Basic", tier: 2, count: 38, percentage: 30, color: "#60A5FA" },
  { name: "Pro", tier: 3, count: 28, percentage: 22, color: "#7C3AED" },
  { name: "Enterprise", tier: 4, count: 10, percentage: 8, color: "#312E81" },
]

// Status data for donut chart
const statusData = [
  { name: "UMKM Aktif", value: 96, percentage: 75, color: "#22C55E" },
  { name: "UMKM Non Aktif", value: 32, percentage: 25, color: "#EF4444" },
]

// Product category data
const productCategoryData = [
  { name: "F&B", value: 142, percentage: 40, color: "#7C3AED" },
  { name: "Kecantikan", value: 89, percentage: 25, color: "#A78BFA" },
  { name: "Obat & Kesehatan", value: 67, percentage: 19, color: "#60A5FA" },
  { name: "Elektronik", value: 34, percentage: 10, color: "#34D399" },
  { name: "Fashion & Lainnya", value: 22, percentage: 6, color: "#94A3B8" },
]

const chartConfig = {
  users: { label: "Users", color: "#2563eb" },
  tenants: { label: "Tenants", color: "#10b981" },
} satisfies ChartConfig

const formatCompactIDR = (val: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(val)
}

// Trend colors
const trendColors = {
  positive: "text-green-600",
  negative: "text-red-600",
  bgPositive: "bg-green-100",
  bgNegative: "bg-red-100",
}

function StatCard({
  title,
  value,
  trend,
  description,
  icon: Icon,
  color,
}: {
  title: string
  value: string | number
  trend: number
  description: string
  icon: React.ElementType
  color: string
}) {
  const isPositive = trend >= 0
  const TrendIcon = isPositive ? TrendingUp : TrendingUp

  const colors: Record<string, { bg: string, text: string, iconBg: string, iconText: string }> = {
    blue: { bg: "bg-blue-50", text: "text-blue-600", iconBg: "bg-blue-50", iconText: "text-blue-600" },
    green: { bg: "bg-emerald-50", text: "text-emerald-600", iconBg: "bg-emerald-50", iconText: "text-emerald-600" },
    red: { bg: "bg-rose-50", text: "text-rose-600", iconBg: "bg-rose-50", iconText: "text-rose-600" },
    purple: { bg: "bg-violet-50", text: "text-violet-600", iconBg: "bg-violet-50", iconText: "text-violet-600" },
  }

  const selectedColor = colors[color] || colors.blue

  return (
    <Card className="shadow-none border-slate-200 rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-2xl ${selectedColor.iconBg}`}>
          <Icon className={`h-6 w-6 ${selectedColor.iconText}`} />
        </div>
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${selectedColor.bg} ${selectedColor.text}`}>
          {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingUp className="h-3 w-3 rotate-180" />}
          {isPositive ? "+" : ""}{trend}%
        </div>
      </div>
      <div>
        <div className="text-4xl font-extrabold text-slate-900 mb-1">{value}</div>
        <div className="text-sm font-medium text-slate-500">{title}</div>
        <div className="text-xs text-slate-400 mt-0.5">{description}</div>
      </div>
    </Card>
  )
}

// Package card component - matching design
function PackageCard({
  title,
  tier,
  count,
  percentage,
  total,
  color,
  badgeBg,
  badgeText,
  darkBadge,
}: {
  title: string
  tier: number
  count: number
  percentage: number
  total: number
  color: string
  badgeBg: string
  badgeText: string
  darkBadge?: boolean
}) {
  return (
    <Card className="shadow-sm rounded-2xl border-slate-200 p-6 gap-0">
      <div className="flex items-center justify-between mb-4">
        <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${badgeBg} ${darkBadge ? "text-white" : badgeText}`}>
          {title}
        </span>
        <span className="text-sm text-slate-400">Tier {tier}</span>
      </div>
      <div>
        <div className="text-4xl font-extrabold text-slate-900">{count}</div>
        <div className="text-sm font-medium text-slate-500 mt-1">UMKM menggunakan paket ini</div>
      </div>
      <div className="mt-6">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-slate-400">dari {total} UMKM terdaftar</span>
          <span className="font-bold" style={{ color }}>{percentage}%</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${percentage}%`,
              backgroundColor: color,
            }}
          />
        </div>
      </div>
    </Card>
  )
}

// Donut chart legend item
function DonutChart({
  data,
  total,
  colorKey,
}: {
  data: { name: string; value: number; color: string }[]
  total: number | string
  colorKey: string
}) {
  return (
    <div className="relative w-40 h-40">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={70}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-slate-900">{total}</span>
        <span className="text-xs text-slate-400">{colorKey}</span>
      </div>
    </div>
  )
}

function LegendBar({
  color,
  label,
  count,
  percentage,
}: {
  color: string
  label: string
  count: number
  percentage: number
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
          <span className="font-medium text-slate-600">{label}</span>
        </div>
        <span className="font-bold text-slate-900">
          {count} <span className="font-normal text-slate-400">({percentage}%)</span>
        </span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

export function SuperAdminDashboardPage() {
  const [chartData] = useState([
    { month: "Jan", users: 420, tenants: 45 },
    { month: "Feb", users: 480, tenants: 52 },
    { month: "Mar", users: 520, tenants: 58 },
    { month: "Apr", users: 580, tenants: 65 },
    { month: "May", users: 620, tenants: 72 },
    { month: "Jun", users: 680, tenants: 78 },
  ])

  const totalUMKM = statsData.registeredUMKM

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Welcome Banner - Purple Gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 to-blue-600 p-6 text-white">
        <div className="space-y-2">
          <p className="text-white/80 text-sm font-medium">Selamat datang kembali 👋</p>
          <h2 className="text-2xl font-bold">Super Admin Dashboard</h2>
          <p className="text-white/80 text-sm">Pantau dan kelola seluruh aktivitas barcode UMKM</p>
        </div>
      </div>

      {/* Stats Grid - 4 cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="UMKM Terdaftar"
          value={statsData.registeredUMKM.toLocaleString("id-ID")}
          trend={statsData.umkmTrend}
          description="+12% dari bulan lalu"
          icon={Store}
          color="blue"
        />
        <StatCard
          title="UMKM Aktif"
          value={statsData.activeUMKM.toLocaleString("id-ID")}
          trend={statsData.activeTrend}
          description="+8% dari bulan lalu"
          icon={CircleCheckBig}
          color="green"
        />
        <StatCard
          title="UMKM Non Aktif"
          value={statsData.inactiveUMKM.toLocaleString("id-ID")}
          trend={statsData.inactiveTrend}
          description="-4% dari bulan lalu"
          icon={AlertCircle}
          color="red"
        />
        <StatCard
          title="Produk Terdaftar"
          value={statsData.totalProducts.toLocaleString("id-ID")}
          trend={statsData.productsTrend}
          description="+24% dari bulan lalu"
          icon={Package}
          color="purple"
        />
      </div>

      {/* Middle Section - Subscription Package Distribution */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-4">Distribusi Paket Berlangganan</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <PackageCard
            title="Gratis"
            tier={1}
            count={packageData[0].count}
            percentage={packageData[0].percentage}
            total={totalUMKM}
            color={packageData[0].color}
            badgeBg="bg-gray-100"
            badgeText="text-gray-700"
          />
          <PackageCard
            title="Basic"
            tier={2}
            count={packageData[1].count}
            percentage={packageData[1].percentage}
            total={totalUMKM}
            color={packageData[1].color}
            badgeBg="bg-blue-50"
            badgeText="text-blue-600"
          />
          <PackageCard
            title="Pro"
            tier={3}
            count={packageData[2].count}
            percentage={packageData[2].percentage}
            total={totalUMKM}
            color={packageData[2].color}
            badgeBg="bg-violet-50"
            badgeText="text-violet-600"
          />
          <PackageCard
            title="Enterprise"
            tier={4}
            count={packageData[3].count}
            percentage={packageData[3].percentage}
            total={totalUMKM}
            color={packageData[3].color}
            badgeBg="bg-[#1e1b4b]"
            badgeText="text-white"
            darkBadge
          />
        </div>
      </div>

      {/* Bottom Section - Two Donut Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Distribusi UMKM & Paket */}
        <Card className="shadow-none border-slate-200 rounded-2xl p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900">Distribusi UMKM & Paket</h3>
            <p className="text-sm text-slate-400">Status aktif dan distribusi {totalUMKM} UMKM per jenis paket berlangganan</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex justify-center">
              <DonutChart data={statusData} total={totalUMKM} colorKey="" />
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-slate-400 tracking-wider">STATUS UMKM</p>
                <div className="space-y-4">
                  <LegendBar color="#22C55E" label="UMKM Aktif" count={96} percentage={75} />
                  <LegendBar color="#EF4444" label="UMKM Non Aktif" count={32} percentage={25} />
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-slate-400 tracking-wider">DISTRIBUSI PAKET</p>
                <div className="space-y-4">
                  <LegendBar color="#94A3B8" label="Paket Gratis" count={52} percentage={41} />
                  <LegendBar color="#60A5FA" label="Paket Basic" count={38} percentage={30} />
                  <LegendBar color="#7C3AED" label="Paket Pro" count={28} percentage={22} />
                  <LegendBar color="#312E81" label="Paket Enterprise" count={10} percentage={8} />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Kategori Produk Terdaftar */}
        <Card className="shadow-none border-slate-200 rounded-2xl p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900">Kategori Produk Terdaftar</h3>
            <p className="text-sm text-slate-400">Distribusi {statsData.totalProducts} produk aktif berdasarkan kategori industri UMKM</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex justify-center">
              <DonutChart data={productCategoryData} total={statsData.totalProducts} colorKey="produk" />
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-bold text-slate-400 tracking-wider">KATEGORI PRODUK</p>
              <div className="space-y-4">
                <LegendBar color="#7C3AED" label="FnB" count={142} percentage={40} />
                <LegendBar color="#A78BFA" label="Kecantikan" count={89} percentage={25} />
                <LegendBar color="#60A5FA" label="Obat & Kesehatan" count={67} percentage={19} />
                <LegendBar color="#34D399" label="Elektronik" count={34} percentage={10} />
                <LegendBar color="#94A3B8" label="Fashion & Lainnya" count={22} percentage={6} />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}