"use client"

import Image from "next/image"
import { Download, QrCode } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface QrCodeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productName: string
  qrCodeUrl: string | null
}

export function QrCodeModal({ open, onOpenChange, productName, qrCodeUrl }: QrCodeModalProps) {
  const handleDownload = () => {
    if (!qrCodeUrl) return
    const link = document.createElement("a")
    link.href = qrCodeUrl
    link.download = `qr-${productName}.png`
    link.target = "_blank"
    link.rel = "noopener noreferrer"
    link.click()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-90">
        <DialogHeader className="flex-row items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50">
            <QrCode className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <DialogTitle>Kode QR Produk</DialogTitle>
            <DialogDescription>{productName}</DialogDescription>
          </div>
        </DialogHeader>

        <div className="flex flex-col items-center px-2 pb-2 pt-4">
          <div className="mb-6 flex items-center justify-center rounded-3xl bg-white p-3 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            {qrCodeUrl ? (
              <Image
                src={qrCodeUrl}
                alt={`QR Code ${productName}`}
                width={200}
                height={200}
                className="rounded-xl"
              />
            ) : (
              <div className="flex h-50 w-50 items-center justify-center rounded-xl bg-gray-50">
                <QrCode className="h-24 w-24 text-gray-300" strokeWidth={1.5} />
              </div>
            )}
          </div>

          <h4 className="mb-8 text-center text-base font-bold text-gray-800">{productName}</h4>

          <div className="flex w-full flex-col gap-3">
            <Button
              type="button"
              onClick={handleDownload}
              disabled={!qrCodeUrl}
              className="flex w-full items-center justify-center gap-2 bg-blue-600 py-3.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Download className="h-4 w-4" />
              Download PNG
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full py-3.5 text-sm font-semibold"
            >
              Tutup
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
