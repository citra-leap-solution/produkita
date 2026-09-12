import { AlertCircle } from "lucide-react"

export default function AlertBanner({ activeDate, isToday }: { activeDate: Date; isToday: boolean }) {
  const formattedDate = activeDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="flex items-start gap-3 rounded-xl bg-blue-600 p-4 text-white shadow-sm">
      <div className="mt-0.5 rounded-lg bg-white/20 p-1.5">
        <AlertCircle className="h-5 w-5 text-white" />
      </div>
      <div>
        <h4 className="text-sm font-semibold">
          {isToday ? "Belum Mengisi Laporan Hari Ini!" : `Belum Mengisi Laporan: ${formattedDate}`}
        </h4>
        <p className="mt-0.5 text-xs text-blue-100">
          {isToday
            ? "Segera isi laporan keuangan hari ini sebelum hari berakhir."
            : `Data untuk tanggal ${formattedDate} belum tersedia. Silakan tambahkan laporan.`}
        </p>
      </div>
    </div>
  )
}
