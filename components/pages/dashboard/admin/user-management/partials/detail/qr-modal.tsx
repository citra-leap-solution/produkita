"use client"

import Image from "next/image"
import { X, QrCode } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ProductQrModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productName: string
  companyName: string
  isActive?: boolean
  qrCodeUrl?: string | null
}

export function ProductQrModal({
  open,
  onOpenChange,
  productName,
  companyName,
  isActive = true,
  qrCodeUrl,
}: ProductQrModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-[420px] p-0 overflow-hidden rounded-3xl border-none gap-0 shadow-2xl">
        <DialogTitle className="sr-only">QR Code {productName}</DialogTitle>
        {/* Header Ungu */}
        <div className="bg-violet-600 px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-violet-200 tracking-wider">QR CODE PRODUK</p>
            <h3 className="text-lg font-bold text-white mt-0.5">{productName}</h3>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 bg-white flex flex-col items-center">
          {/* QR Code Container */}
          <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-8 flex items-center justify-center mb-5">
            {qrCodeUrl ? (
              <Image
                src={qrCodeUrl}
                alt={`QR ${productName}`}
                width={200}
                height={200}
                className="mix-blend-multiply"
              />
            ) : (
              <div className="w-48 h-48 bg-white p-4 rounded-xl border border-slate-200 flex flex-col items-center justify-center">
                <QrCode className="w-36 h-36 text-slate-800" strokeWidth={1.5} />
              </div>
            )}
          </div>

          {/* Info Footer Row */}
          <div className="w-full flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100 mb-5">
            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">PERUSAHAAN</p>
              <p className="text-xs font-bold text-slate-900 mt-0.5">{companyName}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {isActive ? "Aktif" : "Non-aktif"}
            </span>
          </div>

          {/* Action Button */}
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full py-2.5 rounded-xl border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
          >
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
