"use client"

import { useState } from "react"
import { ChevronLeft, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { AdminTenantDetailData } from "@/hooks/useAdmin"
import type { AdminProductListItem } from "@/lib/admin/api"
import { ProductQrModal } from "./qr-modal"

const valueOrDash = (value: string | number | null | undefined) =>
  value === null || value === undefined || value === "" ? "-" : String(value)

const formatDate = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "-"
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(date)
}

function Field({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-base font-semibold text-slate-900">{valueOrDash(value)}</p>
    </div>
  )
}

function isActiveStatus(status: string) {
  return status === "active" || status === "UMKM Aktif"
}

export function UserDetailPage({ data, onBack }: { data: AdminTenantDetailData; onBack: () => void }) {
  const [tab, setTab] = useState<"info" | "produk">("info")
  const [selectedProduct, setSelectedProduct] = useState<AdminProductListItem | null>(null)
  const { tenant, products } = data
  const tenantActive = isActiveStatus(tenant.status)

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center gap-2 text-sm">
        <button onClick={onBack} className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-700">
          <ChevronLeft className="h-4 w-4" />
          List User
        </button>
        <span className="text-slate-400">/</span>
        <span className="font-medium text-slate-900">Detail {valueOrDash(tenant.trade_name ?? tenant.name)}</span>
      </div>

      <Card className="flex items-center justify-between rounded-3xl border-slate-200 p-5 shadow-none">
        <h2 className="text-xl font-bold text-slate-900">{valueOrDash(tenant.name)}</h2>
        <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium ${
          tenantActive
            ? "border-emerald-200 bg-emerald-50 text-emerald-600"
            : "border-red-200 bg-red-50 text-red-600"
        }`}>
          <span className={`h-2 w-2 rounded-full ${tenantActive ? "bg-emerald-500" : "bg-red-500"}`} />
          {tenant.status}
        </span>
      </Card>

      <div className="inline-flex w-fit gap-1 rounded-full border border-slate-200 bg-white p-1.5">
        <Button
          variant="ghost"
          onClick={() => setTab("info")}
          className={`h-9 rounded-full px-5 text-sm font-semibold ${tab === "info" ? "bg-violet-600 text-white hover:bg-violet-600 hover:text-white" : "text-slate-600"}`}
        >
          Informasi User
        </Button>
        <Button
          variant="ghost"
          onClick={() => setTab("produk")}
          className={`h-9 rounded-full px-5 text-sm font-semibold ${tab === "produk" ? "bg-violet-600 text-white hover:bg-violet-600 hover:text-white" : "text-slate-600"}`}
        >
          Daftar Produk ({products.length})
        </Button>
      </div>

      {tab === "info" && (
        <div className="flex items-start gap-4 max-lg:flex-col">
          <Card className="w-full flex-1 gap-0 rounded-3xl border-slate-200 p-6 shadow-none">
            <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
              <div className="space-y-5">
                <Field label="Nama Perusahaan" value={tenant.name} />
                <Field label="Bidang Usaha" value={tenant.business_field} />
                <Field label="Bergabung" value={formatDate(tenant.joined_at)} />
                <Field label="Email Usaha" value={tenant.email} />
                <Field label="NPWP" value={tenant.npwp} />
                <Field label="Kota" value={tenant.city} />
                <Field label="Provinsi" value={tenant.province} />
              </div>
              <div className="space-y-5">
                <Field label="Nama Dagang" value={tenant.trade_name} />
                <Field label="Tahun Berdiri" value={tenant.year} />
                <Field label="Telepon" value={tenant.phonenumber} />
                <Field label="Website" value={tenant.website} />
                <Field label="Jalan / Alamat" value={tenant.address} />
                <Field label="Kode Pos" value={tenant.postal_code} />
                <Field label="Penanggung Jawab" value={tenant.pic_name} />
                <Field label="Email Akun" value={tenant.pic_email} />
              </div>
            </div>
            <hr className="my-6 border-slate-200" />
            <Field label="Deskripsi Usaha" value={tenant.description} />
          </Card>

          <Card className="w-full shrink-0 gap-0 overflow-hidden rounded-3xl border-slate-200 shadow-none lg:w-80">
            <div className="bg-violet-600 px-5 py-3">
              <span className="text-sm font-bold text-white">Paket {tenant.package}</span>
            </div>
            <div className="space-y-4 bg-violet-50/50 px-5 py-5">
              <div>
                <span className="text-3xl font-extrabold text-violet-600">{tenant.products_count}</span>
                <span className="ml-1 text-sm text-slate-400">produk aktif</span>
              </div>
              <Field label="Status UMKM" value={tenant.status} />
              <Field label="Jenis Paket" value={tenant.package} />
            </div>
          </Card>
        </div>
      )}

      {tab === "produk" && (
        <Card className="gap-0 rounded-3xl border-slate-200 p-6 shadow-none">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200 hover:bg-transparent">
                <TableHead className="w-16 py-4 text-xs font-bold uppercase text-slate-400">No</TableHead>
                <TableHead className="py-4 text-xs font-bold uppercase text-slate-400">Nama Produk</TableHead>
                <TableHead className="py-4 text-xs font-bold uppercase text-slate-400">Status</TableHead>
                <TableHead className="py-4 text-xs font-bold uppercase text-slate-400">QR Code</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="py-10 text-center text-sm text-slate-500">Belum ada produk.</TableCell></TableRow>
              ) : products.map((product, index) => {
                const active = isActiveStatus(product.status)
                return (
                  <TableRow key={product.uuid} className="border-slate-200 hover:bg-transparent">
                    <TableCell className="py-4 text-sm text-slate-400">{index + 1}</TableCell>
                    <TableCell className="py-4 text-sm font-medium text-slate-900">{product.name}</TableCell>
                    <TableCell className="py-4">
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${active ? "border-emerald-200 bg-emerald-50 text-emerald-600" : "border-red-200 bg-red-50 text-red-600"}`}>
                        {active ? "Aktif" : "Non-aktif"}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <button
                        className="inline-flex items-center gap-2 rounded-lg bg-violet-50 px-4 py-1.5 text-sm font-medium text-violet-600 hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() => setSelectedProduct(product)}
                        disabled={!product.qr_code_url}
                      >
                        <QrCode className="h-4 w-4" />
                        Lihat QR Code
                      </button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          {selectedProduct && (
            <ProductQrModal
              open
              onOpenChange={(open) => { if (!open) setSelectedProduct(null) }}
              productName={selectedProduct.name}
              companyName={tenant.name ?? "-"}
              isActive={isActiveStatus(selectedProduct.status)}
              qrCodeUrl={selectedProduct.qr_code_url}
            />
          )}
        </Card>
      )}
    </div>
  )
}
