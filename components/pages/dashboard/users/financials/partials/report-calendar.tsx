"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

export default function ReportCalendar({
  transactionDates,
  activeDateStr,
  registeredAtStr,
  year,
  month,
}: {
  transactionDates: number[]
  activeDateStr: string
  registeredAtStr?: string
  year: number
  month: number
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const safeDateStr = activeDateStr.includes("T") ? activeDateStr : `${activeDateStr}T00:00:00`
  const activeDate = new Date(safeDateStr)
  const today = new Date()

  const registeredAt = registeredAtStr
    ? new Date(`${registeredAtStr}T00:00:00`)
    : null

  const [viewMonth, setViewMonth] = useState(activeDate.getMonth())
  const [viewYear, setViewYear] = useState(activeDate.getFullYear())

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear(viewYear - 1)
    } else {
      setViewMonth(viewMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear(viewYear + 1)
    } else {
      setViewMonth(viewMonth + 1)
    }
  }

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay()

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyCells = Array.from({ length: firstDayOfMonth }, (_, i) => i)

  const monthName = new Date(viewYear, viewMonth, 1).toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  })

  const getDayStatus = (day: number) => {
    const currentDate = new Date(viewYear, viewMonth, day)
    const isToday = currentDate.toDateString() === today.toDateString()

    // hanya cek transactionDates kalau bulan dan tahun yang dilihat sama dengan data
    const isCurrentMonthYear = viewMonth === month - 1 && viewYear === year
    const hasRecord = isCurrentMonthYear && transactionDates.includes(day)

    if (isToday) return "today"
    if (currentDate > today) return "upcoming"
    if (registeredAt && currentDate < registeredAt) return "before-registration"
    if (hasRecord) return "completed"
    return "missing"
  }

  const handleDateClick = (day: number) => {
    const yearStr = viewYear
    const monthStr = String(viewMonth + 1).padStart(2, "0")
    const dayStr = String(day).padStart(2, "0")
    const dateString = `${yearStr}-${monthStr}-${dayStr}`

    const params = new URLSearchParams(searchParams?.toString() || "")
    params.set("date", dateString)

    router.push(`${pathname}?${params.toString()}`, { scroll: false })
    router.refresh()
  }

  if (isNaN(activeDate.getTime())) {
    return (
      <div className="rounded-xl bg-red-50 p-4 text-red-500">
        Error: Format tanggal tidak valid.
      </div>
    )
  }

  return (
    <Card className="flex-1 rounded-xl border-slate-100 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
        <CardTitle className="text-sm font-semibold text-slate-900">Kalender Laporan</CardTitle>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="rounded border p-1 text-slate-600 transition-colors hover:bg-slate-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <span className="w-26 text-center text-xs font-bold text-slate-700">{monthName}</span>

          <button
            type="button"
            onClick={handleNextMonth}
            className="rounded border p-1 text-slate-600 transition-colors hover:bg-slate-100"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="mb-2 grid grid-cols-7 gap-x-2 gap-y-3 text-center text-xs font-semibold text-slate-400">
          <span>MINGGU</span>
          <span>SENIN</span>
          <span>SELASA</span>
          <span>RABU</span>
          <span>KAMIS</span>
          <span>JUMAT</span>
          <span>SABTU</span>
        </div>

        <div className="grid grid-cols-7 gap-x-2 gap-y-3 text-center text-sm font-medium">
          {emptyCells.map((cell) => (
            <div key={`empty-${cell}`} />
          ))}

          {daysArray.map((day) => {
            const status = getDayStatus(day)
            const isSelected =
              activeDate.getDate() === day &&
              activeDate.getMonth() === viewMonth &&
              activeDate.getFullYear() === viewYear

            return (
              <button
                key={day}
                type="button"
                onClick={() => handleDateClick(day)}
                className={`relative flex h-8 min-w-8 cursor-pointer flex-col items-center justify-center rounded-lg px-1 transition-all
                  ${isSelected ? "ring-2 ring-blue-600 ring-offset-2" : ""}
                  ${status === "today" ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700" : ""}
                  ${status === "completed" ? "bg-green-50 text-green-700 hover:bg-green-100" : ""}
                  ${status === "missing" ? "bg-red-50 text-red-700 hover:bg-red-100" : ""}
                  ${status === "upcoming" ? "text-slate-400 hover:bg-slate-50" : ""}
                  ${status === "before-registration" ? "text-slate-300 hover:bg-slate-50" : ""}
                `}
              >
                <span className="text-xs font-bold">{day}</span>
                {status === "completed" && (
                  <span className="absolute bottom-1 h-1 w-1 rounded-full bg-green-500" />
                )}
                {status === "missing" && (
                  <span className="absolute bottom-1 h-1 w-1 rounded-full bg-red-500" />
                )}
              </button>
            )
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-4 border-t border-slate-100 pt-4 text-[10px] font-bold text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-[3px] bg-green-500" />
            Sudah dicatat
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-[3px] bg-red-500" />
            Belum dicatat
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-[3px] bg-blue-600" />
            Hari ini
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-[3px] bg-slate-300" />
            Mendatang
          </div>
        </div>
      </CardContent>
    </Card>
  )
}