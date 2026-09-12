import { Card, CardContent } from "@/components/ui/card"
import { type LucideIcon } from "lucide-react"

export type StatItem = {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: LucideIcon
  color: string
}

export default function StatsCards({ stats }: { stats: StatItem[] }) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-50 text-blue-600"
      case "red":
        return "bg-red-50 text-red-500"
      case "green":
        return "bg-green-50 text-green-600"
      case "yellow":
        return "bg-yellow-50 text-yellow-600"
      default:
        return "bg-slate-50 text-slate-600"
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon

        return (
          <Card key={index} className="rounded-xl border-slate-100 shadow-sm">
            <CardContent className="flex items-start gap-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${getColorClasses(stat.color)}`}
              >
                <Icon className="h-5 w-5" strokeWidth={2.5} />
              </div>

              <div className="flex flex-col">
                <p className="text-sm font-semibold text-slate-500">{stat.title}</p>
                <h3 className="mt-1 text-[20px] font-bold text-slate-800">{stat.value}</h3>
                <p className={`mt-1 text-xs font-semibold ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                  {stat.change}
                </p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
