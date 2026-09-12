"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Download, Pencil, Trash2, Plus } from "lucide-react"
import { toast } from "sonner"
import { formatIDR } from "@/lib/format-currency"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useFinance } from "@/hooks/useFinance"

export default function RecentTransactions({
  records,
  activeDate,
  userUuid,
}: {
  records: any[]
  activeDate: Date
  userUuid: string
}) {
  const router = useRouter()
  const { deleteFinancialRecord, exportFinancialRecords } = useFinance()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [exportLoading, setExportLoading] = useState(false)

  const formattedActiveDate = activeDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus transaksi ini?")) return
    setDeletingId(id)
    try {
      const result = await deleteFinancialRecord(id)
      if (!result) {
        toast.error("Gagal menghapus transaksi")
        return
      }
      toast.success("Transaksi berhasil dihapus")
      router.refresh()
    } finally {
      setDeletingId(null)
    }
  }

  const handleExport = async () => {
    setExportLoading(true)
    const now = new Date()

    toast.promise(
      (async () => {
        const result = await exportFinancialRecords(now.getFullYear(), now.getMonth() + 1)
        if (!result) throw new Error("Gagal mengunduh laporan")
      })(),
      {
        loading: "Menyiapkan laporan...",
        success: "Laporan berhasil diunduh",
        error: "Gagal mengunduh laporan",
        finally: () => setExportLoading(false),
      }
    )
  }

  return (
    <Card className="rounded-xl border-slate-100 shadow-sm">
      <CardHeader className="flex flex-col gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-sm font-semibold text-slate-900">Transaksi Terbaru</CardTitle>
          <CardDescription className="mt-0.5 text-xs text-slate-400">
            Menampilkan {records.length} transaksi untuk tanggal{" "}
            <strong className="text-slate-600">{formattedActiveDate}</strong>
          </CardDescription>
        </div>
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={exportLoading}
            className="h-10 gap-2 rounded-lg border-blue-500 bg-white px-4 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            {exportLoading ? "Mengunduh..." : "Download Laporan"}
          </Button>
          <Link href="/dashboard/financials/records">
            <Button className="h-10 gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
              <Plus className="h-4 w-4" /> Tambah Laporan
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        {records.length === 0 ? (
          <div className="py-10 text-center text-sm font-semibold text-slate-400">
            Tidak ada transaksi pada tanggal ini.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="text-xs font-bold text-slate-400">KETERANGAN</TableHead>
                <TableHead className="text-xs font-bold text-slate-400">TANGGAL</TableHead>
                <TableHead className="text-xs font-bold text-slate-400">TIPE TRANSAKSI</TableHead>
                <TableHead className="text-xs font-bold text-slate-400">JUMLAH</TableHead>
                <TableHead className="text-center text-xs font-bold text-slate-400">AKSI</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <TableCell className="text-sm font-semibold text-slate-800">
                    {record.product_name}
                  </TableCell>
                  <TableCell className="text-sm font-medium text-slate-500">
                    {new Date(record.transaction_date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <span className={`rounded-md px-2 py-1 text-xs font-bold ${
                      record.transaction_type === "income" ? "text-green-600" : "text-red-600"
                    }`}>
                      {record.transaction_type === "income" ? "Masuk" : "Keluar"}
                    </span>
                  </TableCell>
                  <TableCell className={`text-sm font-bold ${
                    record.transaction_type === "income" ? "text-green-600" : "text-red-600"
                  }`}>
                    {record.transaction_type === "income" ? "+ " : "- "}
                    {formatIDR(record.amount)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Link href={`/dashboard/financials/${record.cuid}`}>
                        <button className="rounded-md bg-blue-600 p-1.5 text-white transition hover:bg-blue-700">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(record.cuid)}
                        disabled={deletingId === record.cuid}
                        className="rounded-md bg-red-50 p-1.5 text-red-500 transition hover:bg-red-100 disabled:opacity-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}