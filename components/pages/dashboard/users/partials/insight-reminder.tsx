"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Bell, Clock, CheckCircle2, ChevronRight, ChevronDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthStore } from "@/stores/useAuthStore"
import { useDashboard } from "@/hooks/useDashboard"

interface InsightChild {
  id: string
  message: string
  href?: string
}

interface Insight {
  id: string
  message: string
  type: "warning" | "success"
  href?: string
  children?: InsightChild[]
}

function InsightRow({ item }: { item: Insight }) {
  const [isOpen, setIsOpen] = useState(false)
  const Icon = item.type === "success" ? CheckCircle2 : Clock
  const hasChildren = !!item.children?.length

  const rowContent = (
    <>
      <Icon
        className={`mt-0.5 h-4 w-4 shrink-0 ${item.type === "success" ? "text-blue-600" : "text-blue-500"}`}
      />
      <span className="flex-1 text-slate-700">{item.message}</span>
      {hasChildren ? (
        <ChevronDown
          className={`mt-0.5 h-4 w-4 shrink-0 text-blue-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      ) : (
        item.href && <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
      )}
    </>
  )

  const rowClassName =
    "flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/50 p-3 text-sm transition-colors hover:bg-blue-50"

  if (hasChildren) {
    return (
      <div className="rounded-xl border border-blue-100 bg-blue-50/50">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex w-full items-start gap-3 p-3 text-left text-sm"
        >
          {rowContent}
        </button>
        {isOpen && (
          <div className="flex flex-col gap-2 border-t border-blue-100 p-3 pt-2">
            {item.children!.map((child) =>
              child.href ? (
                <Link
                  key={child.id}
                  href={child.href}
                  className="flex items-center justify-between gap-2 rounded-lg bg-white px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-blue-50 hover:text-slate-900"
                >
                  {child.message}
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-blue-400" />
                </Link>
              ) : (
                <div key={child.id} className="rounded-lg bg-white px-3 py-2 text-sm text-slate-600">
                  {child.message}
                </div>
              )
            )}
          </div>
        )}
      </div>
    )
  }

  if (item.href) {
    return (
      <Link href={item.href} className={rowClassName}>
        {rowContent}
      </Link>
    )
  }

  return <div className={rowClassName}>{rowContent}</div>
}

export function InsightReminder() {
  const { uuid } = useAuthStore()
  const { getInsights } = useDashboard()
  const [insights, setInsights] = useState<Insight[]>([])

  useEffect(() => {
    if (!uuid) return

    const fetchInsights = async () => {
      const result = await getInsights()
      if (result) setInsights(result)
    }

    fetchInsights()
  }, [uuid])

  return (
    <Card className="shadow-sm h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-orange-500">
            <Bell className="h-4 w-4" />
          </div>
          <CardTitle className="text-sm font-semibold">Insight & Reminder</CardTitle>
        </div>
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
          {insights.length}
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden">
        {insights.length === 0 ? (
          <p className="text-sm text-slate-400">Belum ada insight untuk ditampilkan.</p>
        ) : (
          <div className="scrollbar-thin flex max-h-100 flex-col gap-3 overflow-y-auto pr-1">
            {insights.map((item) => (
              <InsightRow key={item.id} item={item} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
