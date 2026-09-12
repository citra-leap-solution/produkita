"use client";

import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ArrowUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatCompactIDR, formatIDR } from "@/lib/format-currency";
import { useAuthStore } from "@/stores/useAuthStore";
import { useDashboard } from "@/hooks/useDashboard";

const chartConfig = {
  pemasukan: {
    label: "Pemasukan",
    color: "#2563eb",
  },
  pengeluaran: {
    label: "Pengeluaran",
    color: "#ef4444",
  },
} satisfies ChartConfig;

export function RevenueChart() {
  const { uuid } = useAuthStore();
  const { getRevenueChart } = useDashboard();
  const [chartData, setChartData] = useState<
    { month: string; pemasukan: number; pengeluaran: number }[]
  >([]);

  useEffect(() => {
    if (!uuid) return;

    const fetchChart = async () => {
      const result = await getRevenueChart();
      if (result) setChartData(result);
    };

    fetchChart();
  }, [uuid]);

  const TotalPemasukan = useMemo(() => {
    return chartData.reduce((sum, item) => sum + (item.pemasukan || 0), 0);
  }, [chartData]);

  const TotalPengeluaran = useMemo(() => {
    return chartData.reduce((sum, item) => sum + (item.pengeluaran || 0), 0);
  }, [chartData]);

  const Trends = useMemo(() => {
    if (!chartData || chartData.length < 2) {
      return {
        pemasukan: { percent: 0, isUp: true },
        pengeluaran: { percent: 0, isUp: true },
      };
    }

    const current = chartData[chartData.length - 1];
    const previous = chartData[chartData.length - 2];

    const calculatePercent = (currVal: number, prevVal: number) => {
      if (prevVal === 0) {
        return { percent: currVal === 0 ? 0 : 100, isUp: true };
      }
      const difference = currVal - prevVal;
      const percent = Math.round((difference / prevVal) * 100);
      return { percent: Math.abs(percent), isUp: percent >= 0 };
    };

    return {
      pemasukan: calculatePercent(
        current.pemasukan || 0,
        previous.pemasukan || 0,
      ),
      pengeluaran: calculatePercent(
        current.pengeluaran || 0,
        previous.pengeluaran || 0,
      ),
    };
  }, [chartData]);

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-semibold">
            Grafik Keuangan
          </CardTitle>
          <CardDescription className="text-xs">
            Ringkasan pemasukan & pengeluaran — detail ada di Manajemen Keuangan
          </CardDescription>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-600" />
            <span className="text-muted-foreground">Pemasukan</span>
            <span className="font-semibold text-blue-600">
              {formatCompactIDR(TotalPemasukan)}
            </span>
            <span
              className={`flex items-center text-xs ${Trends.pemasukan.isUp ? "text-green-500" : "text-red-500"}`}
            >
              <ArrowUp
                className={`h-3 w-3 ${!Trends.pemasukan.isUp && "rotate-180"}`}
              />
              {Trends.pemasukan.percent}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500" />
            <span className="text-muted-foreground">Pengeluaran</span>
            <span className="font-semibold text-red-500">
              {formatCompactIDR(TotalPengeluaran)}
            </span>
            <span
              className={`flex items-center text-xs ${Trends.pengeluaran.isUp ? "text-blue-400" : "text-red-500"}`}
            >
              <ArrowUp
                className={`h-3 w-3 ${!Trends.pengeluaran.isUp && "rotate-180"}`}
              />
              {Trends.pengeluaran.percent}%
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-100 w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 0,
              right: 12,
              top: 12,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="fillPemasukan" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-pemasukan)"
                  stopOpacity={0.15}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-pemasukan)"
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="fillPengeluaran" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-pengeluaran)"
                  stopOpacity={0.15}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-pengeluaran)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={true}
              horizontal={true}
              strokeDasharray="3 3"
              opacity={0.3}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
              className="text-xs text-muted-foreground"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={5}
              width={40}
              ticks={[0, 8000000, 15000000, 23000000, 30000000]}
              tickFormatter={(value) =>
                value === 0 ? "0" : `${value / 1000000}Jt`
              }
              className="text-xs text-muted-foreground"
            />
            <ChartTooltip
              cursor={{ stroke: "#cbd5e1", strokeWidth: 1 }}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  formatter={(value) => formatIDR(value as number)}
                />
              }
            />
            <Area
              dataKey="pemasukan"
              type="monotone"
              fill="url(#fillPemasukan)"
              fillOpacity={0.4}
              stroke="var(--color-pemasukan)"
              strokeWidth={2}
              dot={false}
              activeDot={false}
            />
            <Area
              dataKey="pengeluaran"
              type="monotone"
              fill="url(#fillPengeluaran)"
              fillOpacity={0.4}
              stroke="var(--color-pengeluaran)"
              strokeWidth={2}
              dot={{
                r: 3,
                fill: "var(--color-pemasukan)",
                stroke: "white",
                strokeWidth: 3,
              }}
              activeDot={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
