"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { formatCompactIDR, formatIDR } from "@/lib/format-currency"

const chartConfig = {
  pemasukan: { label: "Pemasukan", color: "#3b82f6" },
  pengeluaran: { label: "Pengeluaran", color: "#ef4444" },
}

type DailyData = {
  date: number | string
  pemasukan: number
  pengeluaran: number
}

interface RevenueChartProps {
  data: DailyData[]
  summary?: {
    total_pemasukan: string
    trend_pemasukan: string
    total_pengeluaran: string
    trend_pengeluaran: string
  }
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const pemasukan = payload.find((p: any) => p.dataKey === "pemasukan")?.value || 0
    const pengeluaran = payload.find((p: any) => p.dataKey === "pengeluaran")?.value || 0
    const selisih = pemasukan - pengeluaran

    return (
      <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-lg">
        <p className="mb-2 text-xs font-bold text-slate-500">Tgl {label}</p>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-6 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-slate-600">
              <span className="h-2 w-2 rounded-full bg-[#3b82f6]"></span>
              Pemasukan
            </div>
            <span className="font-bold text-slate-900">{formatIDR(pemasukan)}</span>
          </div>
          <div className="flex items-center justify-between gap-6 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-slate-600">
              <span className="h-2 w-2 rounded-full bg-[#ef4444]"></span>
              Pengeluaran
            </div>
            <span className="font-bold text-slate-900">{formatIDR(pengeluaran)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between gap-6 border-t border-slate-100 pt-1.5 text-xs">
            <span className="font-semibold text-slate-400">Selisih</span>
            <span className="font-bold text-blue-600">{formatIDR(selisih)}</span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

export default function RevenueChart({ data, summary }: RevenueChartProps) {
  const dateSubtitle = useMemo(() => {
    const now = new Date()
    const monthYear = now.toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
    })
    const today = now.getDate()
    return `Tgl 1 – ${today} ${monthYear}`
  }, [])

  const TotalPemasukan = useMemo(() => {
    if (summary?.total_pemasukan !== undefined && summary.total_pemasukan !== "") {
      return Number(summary.total_pemasukan)
    }
    return data.reduce((sum, item) => sum + (item.pemasukan || 0), 0)
  }, [summary, data])

  const TotalPengeluaran = useMemo(() => {
    if (summary?.total_pengeluaran !== undefined && summary.total_pengeluaran !== "") {
      return Number(summary.total_pengeluaran)
    }
    return data.reduce((sum, item) => sum + (item.pengeluaran || 0), 0)
  }, [summary, data])

  const Trends = useMemo(() => {
    if (!data || data.length < 2) {
      return {
        pemasukan: summary?.trend_pemasukan || "↑0%",
        pengeluaran: summary?.trend_pengeluaran || "↑0%",
      }
    }

    const current = data[data.length - 1]
    const previous = data[data.length - 2]

    const calculatePercent = (currVal: number, prevVal: number) => {
      if (prevVal === 0) {
        if (currVal === 0) return "↑0%"
        return "↑100%"
      }
      const difference = currVal - prevVal
      const percent = Math.round((difference / prevVal) * 100)
      return `${percent >= 0 ? "↑" : "↓"}${Math.abs(percent)}%`
    }

    return {
      pemasukan: calculatePercent(current.pemasukan || 0, previous.pemasukan || 0),
      pengeluaran: calculatePercent(current.pengeluaran || 0, previous.pengeluaran || 0),
    }
  }, [data, summary])

  return (
    <Card className="flex w-full flex-col justify-between rounded-xl border-slate-100 shadow-sm">
      <CardHeader className="pt-5 pb-0">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <CardTitle className="text-base font-bold text-slate-900">Grafik Keuangan</CardTitle>
            <CardDescription className="mt-1 text-sm font-medium text-slate-400">{dateSubtitle}</CardDescription>
          </div>
          <div className="flex items-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#3b82f6]"></span>
              <span className="font-semibold text-slate-500">Pemasukan</span>
              <span className="font-bold text-blue-600">{formatCompactIDR(TotalPemasukan)}</span>
              <span className="font-semibold text-green-500">{Trends.pemasukan}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]"></span>
              <span className="font-semibold text-slate-500">Pengeluaran</span>
              <span className="font-bold text-blue-600">{formatCompactIDR(TotalPengeluaran)}</span>
              <span className="font-semibold text-blue-500">{Trends.pengeluaran}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-end pt-6 pb-4">
        <ChartContainer config={chartConfig} className="h-70 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="fillPemasukan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fillPengeluaran" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                className="text-xs font-semibold text-slate-400"
                dy={10}
                minTickGap={20}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                className="text-xs font-semibold text-slate-400"
                ticks={[0, 8000000, 15000000, 23000000, 30000000]}
                tickFormatter={(value) => `${value / 1000000}Jt`}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: "#cbd5e1",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
              />

              <Area
                type="monotone"
                dataKey="pengeluaran"
                stroke="#ef4444"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#fillPengeluaran)"
                activeDot={{
                  r: 4,
                  fill: "#ef4444",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              />

              <Area
                type="monotone"
                dataKey="pemasukan"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#fillPemasukan)"
                activeDot={{
                  r: 4,
                  fill: "#3b82f6",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
