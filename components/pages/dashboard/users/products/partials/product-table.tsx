"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Eye, Trash2, QrCode } from "lucide-react"
import { toast } from "sonner"
import { CertBadge } from "./cert-badge"
import { QrCodeModal } from "./qr-code-modal"
import { useAuthStore } from "@/stores/useAuthStore"
import { useProduct } from "@/hooks/useProducts"
import { CERT_TYPES } from "@/lib/utils"
import { IProductTable } from "../types/product.i"


export function ProductTable({ search, onTotalChange }: IProductTable) {
  const router = useRouter()
  const { uuid } = useAuthStore()
  const { getProductsByTenant, softDeleteProduct, loading } = useProduct()

  const [products, setProducts] = useState<any[]>([])
  const [isFetching, setIsFetching] = useState(true)
  const [selectedQrProduct, setSelectedQrProduct] = useState<{ name: string; qrCodeUrl: string | null } | null>(null)

  useEffect(() => {
    if (!uuid) return

    const fetchProducts = async () => {
      setIsFetching(true)
      const result = await getProductsByTenant()
      if (result) {
        setProducts(result)
        onTotalChange(result.length)
      }
      setIsFetching(false)
    }

    fetchProducts()
  }, [uuid])

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const hasCert = (product: any, type: string) =>
    product.certificate_types?.includes(type) ?? false

  const handleDelete = async (productUuid: string) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return
    const result = await softDeleteProduct(productUuid)
    if (result) {
      toast.success("Produk berhasil dihapus")
      const updated = products.filter((p) => p.uuid !== productUuid)
      setProducts(updated)
      onTotalChange(updated.length)
    } else {
      toast.error("Gagal menghapus produk")
    }
  }

  if (isFetching) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <p className="text-sm text-gray-500">Memuat produk...</p>
      </div>
    )
  }

  if (filtered.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <p className="text-sm text-gray-500">
          {search ? "Produk tidak ditemukan" : "Belum ada produk terdaftar"}
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="border-b border-gray-100 bg-gray-50/50 text-[11px] font-bold uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-6 py-4">No</th>
              <th className="px-6 py-4">Nama Produk</th>
              <th className="px-6 py-4">Sertifikat</th>
              <th className="px-6 py-4 text-center">Total View</th>
              <th className="px-6 py-4 text-center">Kode QR</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((product, index) => (
              <tr key={product.uuid} className="bg-white transition-colors hover:bg-gray-50/50">
                <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-500">
                  {index + 1}
                </td>
                <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2 flex-wrap">
                    {CERT_TYPES.map((type) => (
                      <CertBadge
                        key={type}
                        type={type.toUpperCase() as "BPOM" | "HALAL" | "PIRT" | "COA"}
                        active={hasCert(product, type)}
                      />
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-center font-medium text-gray-700">
                  {(product.views_count ?? 0).toLocaleString("id-ID")}
                </td>
                <td className="px-6 py-4 text-center">
                  {product.qr_code_url ? (
                    <button
                      onClick={() => setSelectedQrProduct({ name: product.name, qrCodeUrl: product.qr_code_url })}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-50"
                    >
                      <QrCode className="h-4 w-4" />
                      Lihat QR
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400">Belum ada</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => router.push(`/dashboard/products/${product.uuid}`)}
                      className="text-blue-500 transition-colors hover:text-blue-700"
                      title="Lihat Produk"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.uuid)}
                      disabled={loading}
                      className="text-red-500 transition-colors hover:text-red-700 disabled:opacity-50"
                      title="Hapus"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <QrCodeModal
        open={!!selectedQrProduct}
        onOpenChange={(open) => { if (!open) setSelectedQrProduct(null) }}
        productName={selectedQrProduct?.name ?? ""}
        qrCodeUrl={selectedQrProduct?.qrCodeUrl ?? null}
      />
    </div>
  )
}