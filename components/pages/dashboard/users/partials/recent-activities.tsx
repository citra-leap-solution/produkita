"use client"

import { useEffect, useState } from "react"
import { Clock, ArrowRight } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { id as idLocale } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useAuthStore } from "@/stores/useAuthStore"
import { useDashboard } from "@/hooks/useDashboard"

interface Activity {
  id: number
  message: string
  created_at: string
}

export function RecentActivities() {
  const { uuid } = useAuthStore()
  const { getRecentActivities } = useDashboard()
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    if (!uuid) return

    const fetchActivities = async () => {
      const result = await getRecentActivities()
      if (result) setActivities(result)
    }

    fetchActivities()
  }, [uuid])

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-50">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100">
            <Clock className="h-4 w-4 text-slate-600" />
          </div>
          <CardTitle className="text-base font-semibold">
            Aktivitas Terakhir
          </CardTitle>
        </div>
        <Link
          href="/dashboard/activities"
          className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          Lihat Semua
          <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent className="mt-4">
        {activities.length === 0 ? (
          <p className="text-sm text-slate-400">Belum ada aktivitas tercatat.</p>
        ) : (
          <div className="space-y-6">
            {activities.map((activity) => (
              <div key={activity.id} className="relative flex items-start gap-4">
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600 z-10 ring-4 ring-white" />
                <div className="flex flex-1 items-center justify-between border-b border-slate-50 pb-4">
                  <span className="text-sm text-slate-700">
                    {activity.message}
                  </span>
                  <span className="text-xs text-slate-400 whitespace-nowrap ml-4">
                    {formatDistanceToNow(new Date(activity.created_at), {
                      addSuffix: true,
                      locale: idLocale,
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
