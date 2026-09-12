"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, X } from "lucide-react"
import { toast } from "sonner"
import { useAuthStore } from "@/stores/useAuthStore"
import { useFinance } from "@/hooks/useFinance"
import { TransactionType } from "@/lib/enums"

interface TransactionFormProps {
  initialData?: any
  className?: string
}

export function TransactionForm({ initialData, className }: TransactionFormProps) {
  const router = useRouter()
  const { uuid } = useAuthStore()
  const { createFinancialRecord, updateFinancialRecord } = useFinance()
  const [loading, setLoading] = React.useState(false)

  const getLocalDateString = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const [formData, setFormData] = React.useState({
    product_name: initialData?.product_name || "",
    transaction_type: (initialData?.transaction_type || "income") as TransactionType,
    amount: initialData?.amount?.toString() || "",
    transaction_date: initialData?.transaction_date
      ? new Date(initialData.transaction_date).toISOString().split("T")[0]
      : getLocalDateString(),
    notes: initialData?.notes || "",
  })

  const todaydate = getLocalDateString()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!uuid) return
    setLoading(true)

    try {
      let result
      if (initialData?.cuid) {
        result = await updateFinancialRecord(initialData.cuid, {
          product_name: formData.product_name,
          transaction_type: formData.transaction_type,
          amount: Number(formData.amount),
          transaction_date: new Date(formData.transaction_date),
          notes: formData.notes,
        })
        if (result) toast.success("Laporan berhasil diperbarui")
      } else {
        result = await createFinancialRecord({
          product_name: formData.product_name,
          transaction_type: formData.transaction_type,
          amount: Number(formData.amount),
          transaction_date: new Date(formData.transaction_date),
          notes: formData.notes,
        })
        if (result) toast.success("Laporan berhasil ditambahkan")
      }

      if (!result) {
        toast.error("Gagal menyimpan laporan")
        return
      }

      router.push("/dashboard/financials")
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8", className)}>
      <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-blue-600">
          {initialData?.id ? "Edit Laporan" : "Tambah Laporan"}
        </h2>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          aria-label="Tutup form"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6">
        <div className="grid gap-2.5">
          <Label htmlFor="product_name" className="text-sm font-semibold text-slate-700">
            Nama / Keterangan <span className="text-red-500">*</span>
          </Label>
          <Input
            id="product_name"
            required
            value={formData.product_name}
            onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
            placeholder="Nama produk atau keterangan transaksi"
            className="h-11 rounded-lg border-slate-200 bg-white px-4 text-sm focus-visible:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="grid gap-2.5">
            <Label htmlFor="transaction_date" className="text-sm font-semibold text-slate-700">
              Tanggal <span className="text-red-500">*</span>
            </Label>
            <Input
              id="transaction_date"
              type="date"
              required
              max={todaydate}
              value={formData.transaction_date}
              onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
              className="h-11 rounded-lg border-slate-200 bg-white px-4 text-sm focus-visible:ring-blue-500"
            />
          </div>

          <div className="grid gap-2.5">
            <Label className="text-sm font-semibold text-slate-700">
              Tipe <span className="text-red-500">*</span>
            </Label>
            <div className="flex h-11 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, transaction_type: "income" })}
                className={cn(
                  "flex flex-1 items-center justify-center rounded-lg border text-sm font-semibold transition-all",
                  formData.transaction_type === "income"
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                )}
              >
                Masuk
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, transaction_type: "expense" })}
                className={cn(
                  "flex flex-1 items-center justify-center rounded-lg border text-sm font-semibold transition-all",
                  formData.transaction_type === "expense"
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                )}
              >
                Keluar
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-2.5">
          <Label htmlFor="amount" className="text-sm font-semibold text-slate-700">
            Jumlah (Rp) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="amount"
            type="number"
            step="1"
            min="1"
            required
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="1000000"
            className="h-11 rounded-lg border-slate-200 bg-white px-4 text-sm focus-visible:ring-blue-500"
          />
        </div>

        <div className="grid gap-2.5">
          <Label htmlFor="notes" className="text-sm font-semibold text-slate-700">
            Catatan
          </Label>
          <Input
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Catatan tambahan..."
            className="h-11 rounded-lg border-slate-200 bg-white px-4 text-sm focus-visible:ring-blue-500"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="mt-2 h-12 w-full gap-2 rounded-lg bg-blue-600 text-base font-semibold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50"
        >
          <Save className="h-4.5 w-4.5" />
          {loading ? "Menyimpan..." : initialData?.id ? "Simpan Perubahan" : "Tambahkan Laporan"}
        </Button>
      </form>
    </div>
  )
}