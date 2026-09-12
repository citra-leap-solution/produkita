import { Suspense } from "react"
import { TrendingUp, TrendingDown, Wallet, Percent } from "lucide-react"
import { redirect } from "next/navigation"
import { getAuthCookie, verifyToken } from "@/lib/auth/token"
import { dashboardFinanceApi } from "@/lib/finance/api"
import { getTenantApi } from "@/lib/tenant/api"

import StatsCards from "@/components/pages/dashboard/financials/partials/stats-cards"
import AlertBanner from "@/components/pages/dashboard/financials/partials/alert-banner"
import ReportCalendar from "@/components/pages/dashboard/financials/partials/report-calendar"
import RevenueChart from "@/components/pages/dashboard/financials/partials/revenue-chart"
import RecentTransactions from "@/components/pages/dashboard/financials/partials/recent-transactions"
import { StatItem } from "@/components/pages/dashboard/financials/partials/stats-cards"
import { formatIDR } from "@/lib/format-currency"

export default async function FinancialsPage({ dateParam }: { dateParam?: string }) {
  const token = await getAuthCookie()
  if (!token) redirect("/login")
  const user = await verifyToken(token)

  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1

  const prevMonth = month === 1 ? 12 : month - 1
  const prevYear = month === 1 ? year - 1 : year

  const [dashboardRes, tenantRes] = await Promise.all([
    dashboardFinanceApi(token, year, month, prevYear, prevMonth),
    getTenantApi(token),
  ])

  if (!dashboardRes.success || !dashboardRes.data) redirect("/login")
  const { summary, prevSummary, chartData, transactionDates, records } = dashboardRes.data

  if (!tenantRes.success || !tenantRes.data) redirect("/login")
  const tenant = tenantRes.data

  const getChange = (curr: number, prev: number) => {
    if (prev === 0) return curr > 0 ? "+100.0%" : "0.0%"
    const diff = ((curr - prev) / prev) * 100
    return (diff >= 0 ? "+" : "") + diff.toFixed(1) + "%"
  }

  const stats: StatItem[] = [
    {
      title: "Total Pendapatan",
      value: formatIDR(summary.totalIncome),
      change: `${getChange(summary.totalIncome, prevSummary.totalIncome)} dari bulan lalu`,
      trend: summary.totalIncome >= prevSummary.totalIncome ? "up" : "down",
      icon: TrendingUp,
      color: "blue",
    },
    {
      title: "Total Pengeluaran",
      value: formatIDR(summary.totalExpense),
      change: `${getChange(summary.totalExpense, prevSummary.totalExpense)} dari bulan lalu`,
      trend: summary.totalExpense <= prevSummary.totalExpense ? "up" : "down",
      icon: TrendingDown,
      color: "red",
    },
    {
      title: "Keuntungan Bersih",
      value: formatIDR(summary.netProfit),
      change: `${getChange(summary.netProfit, prevSummary.netProfit)} dari bulan lalu`,
      trend: summary.netProfit >= prevSummary.netProfit ? "up" : "down",
      icon: Wallet,
      color: "green",
    },
    {
      title: "Margin Keuntungan",
      value: `${summary.profitMargin.toFixed(1)}%`,
      change: `${getChange(summary.profitMargin, prevSummary.profitMargin)} dari bulan lalu`,
      trend: summary.profitMargin >= prevSummary.profitMargin ? "up" : "down",
      icon: Percent,
      color: "yellow",
    },
  ]

  const active_date = dateParam ? new Date(`${dateParam}T00:00:00`) : now
  const has_input_selected_date = transactionDates.includes(active_date.getDate())
  const is_today = active_date.toDateString() === now.toDateString()
  const active_date_str = `${active_date.getFullYear()}-${String(active_date.getMonth() + 1).padStart(2, "0")}-${String(active_date.getDate()).padStart(2, "0")}`

  const registeredAt = new Date(tenant.created_at)
  const registeredAtStr = `${registeredAt.getFullYear()}-${String(registeredAt.getMonth() + 1).padStart(2, "0")}-${String(registeredAt.getDate()).padStart(2, "0")}`

  return (
    <main className="min-h-screen space-y-6 bg-slate-50/50 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-slate-950">Manajemen Keuangan</h1>
      </div>

      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="flex flex-col space-y-4 lg:col-span-5">
          {!has_input_selected_date && (
            <AlertBanner activeDate={active_date} isToday={is_today} />
          )}
          <Suspense fallback={<div className="h-64 w-full animate-pulse rounded-xl bg-slate-200" />}>
            <ReportCalendar
              transactionDates={transactionDates}
              activeDateStr={active_date_str}
              registeredAtStr={registeredAtStr}
              year={year}
              month={month}
            />
          </Suspense>
        </div>

        <div className="flex lg:col-span-7">
          <RevenueChart
            data={chartData.map((d) => ({
              date: d.day,
              pemasukan: d.income,
              pengeluaran: d.expense,
            }))}
            summary={{
              total_pemasukan: summary.totalIncome.toString(),
              trend_pemasukan: getChange(summary.totalIncome, prevSummary.totalIncome),
              total_pengeluaran: summary.totalExpense.toString(),
              trend_pengeluaran: getChange(summary.totalExpense, prevSummary.totalExpense),
            }}
          />
        </div>
      </div>

      <RecentTransactions
        records={records}
        activeDate={active_date}
        userUuid={user.uuid}
      />
    </main>
  )
}