"use client"

import Image from "next/image"
import { Upload, Camera } from "lucide-react"
import { useRef } from "react"

interface PhotosPartialProps {
  userUuid: string
  tenantUuid: string
  logoUrl: string | null
  placeUrl: string | null
  onLogoChange: (url: string | null) => void
  onPlaceChange: (url: string | null) => void
  onLogoPending: (file: File, preview: string) => void
  onPlacePending: (file: File, preview: string) => void
  isEditing: boolean 
}

export default function PhotosPartial({
  logoUrl,
  placeUrl,
  onLogoPending,
  onPlacePending,
  isEditing,
}: PhotosPartialProps) {
  const logoRef = useRef<HTMLInputElement>(null)
  const placeRef = useRef<HTMLInputElement>(null)

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const preview = URL.createObjectURL(file)
    onLogoPending(file, preview)
    e.target.value = ""
  }

  const handlePlaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const preview = URL.createObjectURL(file)
    onPlacePending(file, preview)
    e.target.value = ""
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="text-[15px] font-bold text-gray-900 mb-4">Foto Perusahaan</h2>
      <div className="space-y-4">

        {/* Logo */}
        <div>
          <p className="text-xs text-gray-500 mb-2">Logo Perusahaan</p>
          <input
            ref={logoRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleLogoChange}
          />
          {logoUrl ? (
            <div
              onClick={() => isEditing && logoRef.current?.click()}
              className={`relative w-full h-24 rounded-xl overflow-hidden border border-gray-200 ${isEditing ? "cursor-pointer group" : "cursor-default"}`}
            >
              <Image src={logoUrl} alt="Logo" fill className="object-contain p-2" />
              {isEditing && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                  <Camera size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
            </div>
          ) : (
            <div
              onClick={() => isEditing && logoRef.current?.click()}
              className={`border-2 border-dashed border-gray-200 rounded-xl p-5 flex flex-col items-center gap-1.5 text-gray-400 transition-colors ${
                isEditing ? "cursor-pointer hover:border-blue-400 hover:text-blue-500" : "cursor-default opacity-50"
              }`}
            >
              <Upload size={20} />
              <p className="text-xs font-medium">Upload Logo</p>
              <p className="text-[11px] text-gray-400">PNG, JPG, SVG</p>
            </div>
          )}
        </div>

        {/* Foto Tempat */}
        <div>
          <p className="text-xs text-gray-500 mb-2">Foto Tempat / Gedung</p>
          <input
            ref={placeRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePlaceChange}
          />
          {placeUrl ? (
            <div
              onClick={() => isEditing && placeRef.current?.click()}
              className={`relative w-full h-36 rounded-xl overflow-hidden border border-gray-200 ${isEditing ? "cursor-pointer group" : "cursor-default"}`}
            >
              <Image src={placeUrl} alt="Foto gedung" fill className="object-cover" />
              {isEditing && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                  <Camera size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
            </div>
          ) : (
            <div
              onClick={() => isEditing && placeRef.current?.click()}
              className={`relative w-full h-36 rounded-xl overflow-hidden border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1.5 text-gray-400 transition-colors ${
                isEditing ? "cursor-pointer hover:border-blue-400 hover:text-blue-500" : "cursor-default opacity-50"
              }`}
            >
              <Upload size={20} />
              <p className="text-xs font-medium">Upload Foto Tempat</p>
              <p className="text-[11px] text-gray-400">PNG, JPG, WEBP</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}