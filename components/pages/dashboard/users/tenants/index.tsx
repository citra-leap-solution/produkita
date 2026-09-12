"use client"

import { useState, useEffect } from "react"
import { Building2, CheckCircle, Pencil, X, Check, Camera } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import ProfilePartial from "./partials/profile"
import ContactPartial from "./partials/contact"
import PhotosPartial from "./partials/photos"
import { useAuthStore } from "@/stores/useAuthStore"
import { useTenant } from "@/hooks/useTenants"
import { emptyData, TenantData } from "./types/tenants.i"

export default function TenantsPage() {
  const { uuid } = useAuthStore()
  const { getTenant, updateTenant, uploadLogo, uploadPlace } = useTenant()

  const [isEditing, setIsEditing] = useState(false)
  const [savedData, setSavedData] = useState<TenantData>(emptyData)
  const [tempData, setTempData] = useState<TenantData>(emptyData)
  const [tenantUuid, setTenantUuid] = useState<string | null>(null)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [placeUrl, setPlaceUrl] = useState<string | null>(null)
  const [isFetching, setIsFetching] = useState(true)

  const [pendingLogo, setPendingLogo] = useState<File | null>(null)
  const [pendingPlace, setPendingPlace] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [placePreview, setPlacePreview] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!uuid) return

    const fetchTenant = async () => {
      setIsFetching(true)
      const result = await getTenant()
      if (!result) {
        setIsFetching(false)
        return
      }

      setTenantUuid(result.uuid)
      setLogoUrl(result.logo_url ?? null)
      setPlaceUrl(result.place_url ?? null)

      const mapped: TenantData = {
        companyName: result.name ?? "",
        tradeName: result.trade_name ?? "",
        businessField: result.business_field ?? "",
        npwp: result.npwp ?? "",
        businessDescription: result.description ?? "",
        address: result.address ?? "",
        district: result.city ?? "",
        postalCode: result.postal_code ?? "",
        province: result.province ?? "",
        mapsQuery: `${result.city ?? ""} ${result.province ?? ""}`,
        phone: result.phonenumber ?? "",
        email: result.email ?? "",
        website: result.website ?? "",
        foundedYear: result.year?.toString() ?? "",
        productCount: (result.products_count ?? 0).toString(),
        latitude: result.latitude ?? null,
        longitude: result.longitude ?? null,
      }

      setSavedData(mapped)
      setTempData(mapped)
      setIsFetching(false)
    }

    fetchTenant()
  }, [uuid])

  const data = isEditing ? tempData : savedData

  const handleEdit = () => {
    setTempData({ ...savedData })
    setIsEditing(true)
  }

  const handleCancel = () => {
    setTempData({ ...savedData })
    setPendingLogo(null)
    setPendingPlace(null)
    setLogoPreview(null)
    setPlacePreview(null)
    setIsEditing(false)
  }

  const handleSave = async () => {
    if (!uuid) return
    setIsSaving(true)

    try {
      const [result, logoResult, placeResult] = await Promise.all([
        updateTenant({
          name: tempData.companyName,
          trade_name: tempData.tradeName,
          business_field: tempData.businessField,
          npwp: tempData.npwp,
          description: tempData.businessDescription,
          address: tempData.address,
          city: tempData.district,
          postal_code: tempData.postalCode,
          province: tempData.province,
          phonenumber: tempData.phone,
          email: tempData.email,
          website: tempData.website,
          year: tempData.foundedYear ? parseInt(tempData.foundedYear) : undefined,
          latitude: tempData.latitude ?? undefined,
          longitude: tempData.longitude ?? undefined,
        }),
        pendingLogo ? uploadLogo(pendingLogo) : Promise.resolve(null),
        pendingPlace ? uploadPlace(pendingPlace) : Promise.resolve(null),
      ])

      if (!result) {
        toast.error("Gagal menyimpan profil UMKM")
        return
      }

      if (logoResult) {
        setLogoUrl(logoResult.logo_url ?? null)
        setPendingLogo(null)
        setLogoPreview(null)
      }

      if (placeResult) {
        setPlaceUrl(placeResult.place_url ?? null)
        setPendingPlace(null)
        setPlacePreview(null)
      }

      setSavedData({ ...tempData })
      setIsEditing(false)
      toast.success("Profil UMKM berhasil diperbarui")
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTempData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNpwpChange = (value: string) => {
    setTempData((prev) => ({ ...prev, npwp: value }))
  }

  const handlePostalCodeChange = (value: string) => {
    setTempData((prev) => ({ ...prev, postalCode: value }))
  }

  const handlePhoneChange = (value: string) => {
    setTempData((prev) => ({ ...prev, phone: value }))
  }

  const handleFoundedYearChange = (value: string) => {
    setTempData((prev) => ({ ...prev, foundedYear: value }))
  }

  const handleLocationChange = (lat: number, lng: number) => {
    setTempData((prev) => ({ ...prev, latitude: lat, longitude: lng }))
  }


  if (isFetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-500">Memuat data...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Photo */}
      <div className="relative h-48 bg-gray-700 overflow-hidden">
        {placeUrl ? (
          <Image
            src={placeUrl}
            alt="Foto perusahaan"
            fill
            className="object-cover"
            style={{ filter: "brightness(0.7)" }}
          />
        ) : (
          <div className="w-full h-full bg-linear-to-r from-blue-800 to-blue-600" />
        )}
        <button
          onClick={() => {}}
          className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-black/50 text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-black/60 transition-colors"
        >
          <Camera size={13} />
          Ganti Foto Tempat
        </button>
        <div className="absolute bottom-4 left-5 z-10 flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md shrink-0 overflow-hidden">
            {logoUrl ? (
              <Image src={logoUrl} alt="Logo" width={48} height={48} className="object-contain" />
            ) : (
              <Building2 className="text-blue-600" size={22} />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-white font-bold text-lg leading-tight">
                {savedData.companyName || "Nama UMKM"}
              </h1>
              <span className="flex items-center gap-1 bg-green-500 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
                <CheckCircle size={11} />
                Verified
              </span>
            </div>
            <p className="text-white/75 text-sm mt-0.5">
              {savedData.businessField || "Bidang Usaha"}
              {savedData.foundedYear ? ` · Sejak ${savedData.foundedYear}` : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Stats + Actions Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="pr-10">
            <p className="text-xs text-gray-500">Tahun Berdiri</p>
            {isEditing ? (
              <input
                name="foundedYear"
                type="number"
                min="1900"
                max={new Date().getFullYear().toString()}
                value={tempData.foundedYear}
                onChange={(e) => handleFoundedYearChange(e.target.value)}
                className="text-base font-bold text-gray-900 border-b border-gray-400 bg-transparent focus:outline-none w-24 mt-0.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            ) : (
              <p className="text-base font-bold text-gray-900 mt-0.5">
                {savedData.foundedYear || "—"}
              </p>
            )}
          </div>
          <div className="w-px h-10 bg-gray-200 mr-10" />
          <div>
            <p className="text-xs text-gray-500">Jumlah Produk</p>
            <p className="text-base font-bold text-gray-900 mt-0.5">
              {savedData.productCount || "0"}
            </p>
          </div>
        </div>

        {isEditing ? (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="flex items-center gap-1.5 border border-gray-300 text-gray-700 text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <X size={14} />
              Batal
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 bg-blue-600 text-white text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check size={14} />
              {isSaving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        ) : (
          <button
            onClick={handleEdit}
            className="flex items-center gap-1.5 border border-blue-500 text-blue-600 text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Pencil size={14} />
            Edit Informasi
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex gap-5">
        <div className="flex-1 min-w-0 space-y-4">
          <ProfilePartial
            data={data}
            isEditing={isEditing}
            tempData={tempData}
            onChange={handleChange}
            onNpwpChange={handleNpwpChange}
            onPostalCodeChange={handlePostalCodeChange}
            onFoundedYearChange={handleFoundedYearChange}
            onLocationChange={handleLocationChange}
          />
        </div>
        <div className="w-72 shrink-0 space-y-4">
          <ContactPartial
            data={data}
            isEditing={isEditing}
            onChange={handleChange}
            onPhoneChange={handlePhoneChange}
          />
          <PhotosPartial
            userUuid={uuid ?? ""}
            tenantUuid={tenantUuid ?? ""}
            logoUrl={logoPreview ?? logoUrl}
            placeUrl={placePreview ?? placeUrl}
            onLogoChange={setLogoUrl}
            onPlaceChange={setPlaceUrl}
            onLogoPending={(file, preview) => {
              setPendingLogo(file)
              setLogoPreview(preview)
            }}
            onPlacePending={(file, preview) => {
              setPendingPlace(file)
              setPlacePreview(preview)
            }}
            isEditing={isEditing} 
          />
        </div>
      </div>
    </div>
  )
}