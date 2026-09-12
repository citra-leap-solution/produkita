"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2, MinusCircle, ChevronLeft, QrCode } from "lucide-react";
import { ProductQrModal } from "./qr-modal";

interface CompanyDetail {
  nama_perusahaan: string
  nama_dagang: string
  bidang_usaha: string
  tahun_berdiri: string
  bergabung: string
  email: string
  telepon: string
  website: string
  npwp: string
  jalan: string
  kota: string
  provinsi: string
  kode_pos: string
  deskripsi: string
}

const mockCompany: CompanyDetail = {
  nama_perusahaan: "PT. Cisarua Mountain Dairy Tbk",
  nama_dagang: "Cimory",
  bidang_usaha: "Produk Olahan Susu",
  tahun_berdiri: "2006",
  bergabung: "15 Januari 2024",
  email: "info@cimory.com",
  telepon: "+62 251 8254880",
  website: "www.cimory.com",
  npwp: "01.234.567.8-000.000",
  jalan: "Jl. Raya Puncak No. 435, Cisarua",
  kota: "Bogor",
  provinsi: "Jawa Barat",
  kode_pos: "16750",
  deskripsi:
    "Cimory adalah merek produk olahan susu yang didirikan di Cisarua, Bogor. Memproduksi berbagai produk seperti yogurt, keju, dan minuman susu berkualitas tinggi dengan bahan baku pilihan langsung dari peternak lokal.",
}

const fiturAktif = [
  { label: "Manajemen Sertifikasi", paket: "(4/5)" },
  { label: "Analytics & Laporan", paket: "(2/4)" },
  { label: "Support", paket: "(2/5)" },
]

const fiturNonAktif = ["Keamanan Data", "Regulasi & Kepatuhan", "Uji Lab"]

const mockProducts = [
  { id: "1", name: "Susu Segar Cimory 200ml", active: true, qrUrl: "/assets/qr/susu-200ml.png" },
  { id: "2", name: "Cimory Greek Yogurt 80g", active: true, qrUrl: "/assets/qr/greek-yogurt.png" },
  { id: "3", name: "Cimory Milk Stick 5g", active: false, qrUrl: "/assets/qr/milk-stick.png" },
]

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase text-slate-400 tracking-wide">{label}</p>
      <p className="mt-1 text-base font-semibold text-slate-900">{value}</p>
    </div>
  )
}

export function UserDetailPage() {
  const [tab, setTab] = useState<"info" | "produk">("info")
  const [selectedProduct, setSelectedProduct] = useState<{name: string, active: boolean, url: string | null} | null>(null)
  const company = mockCompany

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={() => history.back()}
          className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-700"
        >
          List User
        </button>
        <span className="text-slate-400">{" > "}</span>
        <span className="text-slate-900 font-medium">Detail Admin {company.nama_dagang}</span>
      </div>

      {/* Header card */}
      <Card className="shadow-none border-slate-200 rounded-3xl p-5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">{company.nama_perusahaan}</h2>
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-600">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Aktif
        </span>
      </Card>

      {/* Tabs */}
      <div className="inline-flex p-1.5 bg-white border border-slate-200 rounded-full w-fit gap-1">
        <Button
          variant="ghost"
          onClick={() => setTab("info")}
          className={`rounded-full h-9 px-5 text-sm font-semibold transition-all ${
            tab === "info"
              ? "bg-violet-600 text-white hover:bg-violet-600 hover:text-white"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          Informasi User
        </Button>
        <Button
          variant="ghost"
          onClick={() => setTab("produk")}
          className={`rounded-full h-9 px-5 text-sm font-semibold transition-all ${
            tab === "produk"
              ? "bg-violet-600 text-white hover:bg-violet-600 hover:text-white"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          Daftar Produk
        </Button>
      </div>

      {/* Tab Content */}
      {tab === "info" && (
        <div className="flex flex-col lg:flex-row gap-4 items-start">
          {/* Info card */}
          <Card className="shadow-none border-slate-200 rounded-3xl p-6 flex-1 w-full gap-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              <div className="space-y-5">
                <Field label="Nama Perusahaan" value={company.nama_perusahaan} />
                <Field label="Bidang Usaha" value={company.bidang_usaha} />
                <Field label="Bergabung" value={company.bergabung} />
                <Field label="Email" value={company.email} />
                <Field label="NPWP" value={company.npwp} />
                <Field label="Kota" value={company.kota} />
                <Field label="Provinsi" value={company.provinsi} />
              </div>
              <div className="space-y-5">
                <Field label="Nama Dagang" value={company.nama_dagang} />
                <Field label="Tahun Berdiri" value={company.tahun_berdiri} />
                <Field label="Telepon" value={company.telepon} />
                <Field label="Website" value={company.website} />
                <Field label="Jalan / Alamat" value={company.jalan} />
                <Field label="Kode Pos" value={company.kode_pos} />
              </div>
            </div>
            <hr className="my-6 border-slate-200" />
            <Field label="Deskripsi Usaha" value={company.deskripsi} />
          </Card>

          {/* Paket card */}
          <Card className="shadow-none border-slate-200 rounded-3xl overflow-hidden w-full lg:w-80 shrink-0 gap-0">
            <div className="bg-violet-600 px-5 py-3">
              <span className="text-sm font-bold text-white">Paket A</span>
            </div>
            <div className="bg-violet-50/50 px-5 py-5 space-y-4">
              <div>
                <span className="text-3xl font-extrabold text-violet-600">8</span>
                <span className="ml-1 text-sm text-slate-400">/ 26 fitur</span>
              </div>
              <div className="space-y-3">
                {fiturAktif.map((f) => (
                  <div key={f.label} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-violet-600 shrink-0" />
                    <span className="text-violet-600 font-medium">{f.label}</span>
                    <span className="text-slate-400">{f.paket}</span>
                  </div>
                ))}
                {fiturNonAktif.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <MinusCircle className="h-4 w-4 text-slate-300 shrink-0" />
                    <span className="text-slate-400">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {tab === "produk" && (
        <Card className="shadow-none border-slate-200 rounded-3xl p-6 gap-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-slate-200">
                <TableHead className="text-xs font-bold text-slate-400 uppercase py-4 w-16">No</TableHead>
                <TableHead className="text-xs font-bold text-slate-400 uppercase py-4">Nama Produk</TableHead>
                <TableHead className="text-xs font-bold text-slate-400 uppercase py-4">Status</TableHead>
                <TableHead className="text-xs font-bold text-slate-400 uppercase py-4">QR Code</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockProducts.map((product) => (
                <TableRow key={product.id} className="hover:bg-transparent border-slate-200">
                  <TableCell className="py-4 text-sm text-slate-400">{product.id}</TableCell>
                  <TableCell className="py-4 text-sm font-medium text-slate-900">{product.name}</TableCell>
                  <TableCell className="py-4">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${
                        product.active
                          ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                          : "border-red-200 bg-red-50 text-red-600"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${product.active ? "bg-emerald-500" : "bg-red-500"}`} />
                      {product.active ? "Aktif" : "Non-aktif"}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    <button className="inline-flex items-center gap-2 bg-violet-50 hover:bg-violet-100 text-violet-600 rounded-lg px-4 py-1.5 text-sm font-medium transition-colors" onClick={() => setSelectedProduct({name: product.name, active: product.active, url: product.qrUrl})}>
                      <QrCode className="h-4 w-4" />
                      Lihat QR Code
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* QrCodeModal */}
          {selectedProduct && (
            <ProductQrModal
              open={true}
              onOpenChange={() => setSelectedProduct(null)}
              productName={selectedProduct.name}
              companyName={mockCompany.nama_perusahaan}
              isActive={selectedProduct.active}
              qrCodeUrl={selectedProduct.url}
            />
          )}
        </Card>
      )}

    </div>
  )
}