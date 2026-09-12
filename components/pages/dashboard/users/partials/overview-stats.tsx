"use client";

import { useEffect, useState } from "react";
import { Package, Eye, ArrowUpRight } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useDashboard } from "@/hooks/useDashboard";

export function OverviewStats() {
  const { uuid } = useAuthStore();
  const { getOverviewStats } = useDashboard();

  const [stats, setStats] = useState({
    totalProducts: 0,
    productsThisMonth: 0,
    totalViews: 0,
    viewsToday: 0,
  });

  useEffect(() => {
    if (!uuid) return;

    const fetchStats = async () => {
      const result = await getOverviewStats();
      if (result) setStats(result);
    };

    fetchStats();
  }, [uuid]);

  const overviewData = [
    {
      id: "total-products",
      title: "Total Produk Terdaftar",
      value: stats.totalProducts.toLocaleString("id-ID"),
      description: "produk aktif dalam sistem",
      trend: `+${stats.productsThisMonth} dari bulan lalu`,
      icon: Package,
      gradient: "from-blue-600 to-blue-500",
      textColors: {
        title: "text-blue-100",
        description: "text-blue-100/90",
        badge: "text-blue-50",
      },
    },
    {
      id: "total-views",
      title: "Total View & Scan QR",
      value: stats.totalViews.toLocaleString("id-ID"),
      description: "interaksi pengunjung pada produk",
      trend: `+ ${stats.viewsToday} hari ini`,
      icon: Eye,
      gradient: "from-cyan-600 to-cyan-500",
      textColors: {
        title: "text-cyan-100",
        description: "text-cyan-100/90",
        badge: "text-cyan-50",
      },
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      {overviewData.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.id}
            className={`relative overflow-hidden rounded-2xl bg-linear-to-r ${stat.gradient} py-6 pl-6 pr-16 text-white shadow-sm flex items-center justify-between`}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-30 w-30 rounded-full bg-white/10 pointer-events-none"></div>

            <div className="relative z-10 flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 shadow-inner backdrop-blur-md shrink-0">
                <Icon className="h-7 w-7 text-white" />
              </div>
              <div className="flex flex-col justify-center">
                <p className={`text-sm font-medium ${stat.textColors.title}`}>
                  {stat.title}
                </p>
                <h3 className="text-4xl font-bold tracking-tight leading-tight py-0.5">
                  {stat.value}
                </h3>
                <p className={`text-sm ${stat.textColors.description}`}>
                  {stat.description}
                </p>
              </div>
            </div>

            <div
              className={`relative z-10 flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-medium ${stat.textColors.badge} backdrop-blur-md self-center mr-2`}
            >
              <ArrowUpRight className="h-3 w-3" />
              <span>{stat.trend}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
