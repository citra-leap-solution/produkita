"use client"

import { MapPin } from "lucide-react"
import { TenantData, ViewFieldProps } from "../types/tenants.i"
import { formatNpwp } from "@/lib/utils"
import dynamic from "next/dynamic"
import { useRef, useState } from "react"

const LocationMap = dynamic(
  () => import("./maps"),
  {
    ssr: false,
    loading: () => <div className="h-48 rounded-xl border border-gray-200 bg-gray-100 animate-pulse" />
  }
)

const ViewField = ({ label, value }: ViewFieldProps) => (
  <div>
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <p className="text-sm font-semibold text-gray-900">{value || "—"}</p>
  </div>
)

interface EditFieldProps {
  label: string
  name: string
  value: string
  multiline?: boolean
  rows?: number
  type?: string
  min?: string
  max?: string
  maxLength?: number
  placeholder?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

const EditField = ({
  label, name, value, multiline = false, rows = 3,
  type = "text", min, max, maxLength, placeholder, onChange
}: EditFieldProps) => (
  <div>
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    {multiline ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        maxLength={maxLength}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      />
    )}
  </div>
)

interface NominatimResult {
  place_id: number
  display_name: string
  lat: string
  lon: string
}

interface ProfilePartialProps {
  data: TenantData
  isEditing: boolean
  tempData: TenantData
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onNpwpChange: (value: string) => void
  onPostalCodeChange: (value: string) => void
  onFoundedYearChange: (value: string) => void
  onLocationChange: (lat: number, lng: number) => void
}

export default function ProfilePartial({
  data,
  isEditing,
  tempData,
  onChange,
  onNpwpChange,
  onPostalCodeChange,
  onLocationChange,
}: ProfilePartialProps) {
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([])
  const [searching, setSearching] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e)

    const val = e.target.value
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!val.trim()) {
      setSuggestions([])
      return
    }

    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val)}&format=json&limit=5&countrycodes=id`,
          { headers: { "Accept-Language": "id" } }
        )
        const data: NominatimResult[] = await res.json()
        setSuggestions(data)
      } catch {
        setSuggestions([])
      } finally {
        setSearching(false)
      }
    }, 800)
  }

  const handleSelectSuggestion = (result: NominatimResult) => {
    const lat = parseFloat(result.lat)
    const lng = parseFloat(result.lon)
    setSuggestions([])
    onLocationChange(lat, lng)

    // update field address dengan display_name
    onChange({
      target: { name: "address", value: result.display_name }
    } as React.ChangeEvent<HTMLInputElement>)
  }

  return (
    <>
      {/* Profil Perusahaan */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[15px] font-bold text-gray-900">Profil Perusahaan</h2>
          {isEditing && <span className="text-xs font-semibold text-blue-600">Mode Edit Aktif</span>}
        </div>

        <div className="grid grid-cols-2 gap-5">
          {isEditing ? (
            <>
              <EditField label="Nama Perusahaan" name="companyName" value={tempData.companyName} onChange={onChange} />
              <EditField label="Nama Dagang" name="tradeName" value={tempData.tradeName} onChange={onChange} />
              <EditField label="Bidang Usaha" name="businessField" value={tempData.businessField} onChange={onChange} />
              <div>
                <p className="text-xs text-gray-500 mb-1">NPWP</p>
                <input
                  type="text"
                  name="npwp"
                  value={tempData.npwp}
                  onChange={(e) => onNpwpChange(formatNpwp(e.target.value))}
                  placeholder="XX.XXX.XXX.X-XXX.XXX"
                  maxLength={20}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="col-span-2">
                <EditField
                  label="Deskripsi Usaha"
                  name="businessDescription"
                  value={tempData.businessDescription}
                  multiline
                  rows={4}
                  onChange={onChange}
                />
              </div>
            </>
          ) : (
            <>
              <ViewField label="Nama Perusahaan" value={data.companyName} />
              <ViewField label="Nama Dagang" value={data.tradeName} />
              <ViewField label="Bidang Usaha" value={data.businessField} />
              <ViewField label="NPWP" value={data.npwp} />
              <div className="col-span-2">
                <p className="text-xs text-gray-500 mb-1">Deskripsi Usaha</p>
                <p className="text-sm text-gray-900 leading-relaxed">{data.businessDescription || "—"}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Alamat */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-[15px] font-bold text-gray-900 mb-5">Alamat</h2>

        <div className="space-y-4">
          {/* Field Alamat dengan suggestions */}
          {isEditing ? (
            <div className="relative">
              <p className="text-xs text-gray-500 mb-1">Jalan / Alamat</p>
              <input
                type="text"
                name="address"
                value={tempData.address}
                onChange={handleAddressChange}
                placeholder="Ketik alamat untuk mencari lokasi..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              {searching && (
                <p className="text-xs text-gray-400 mt-1">Mencari lokasi...</p>
              )}
              {suggestions.length > 0 && (
                <ul className="absolute top-full left-0 right-0 z-[2000] mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {suggestions.map((s) => (
                    <li
                      key={s.place_id}
                      onClick={() => handleSelectSuggestion(s)}
                      className="px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0"
                    >
                      {s.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <ViewField label="Jalan / Alamat" value={data.address} />
          )}

          <div className="grid grid-cols-3 gap-4">
            {isEditing ? (
              <>
                <EditField label="Kota" name="district" value={tempData.district} onChange={onChange} />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Kode Pos</p>
                  <input
                    type="text"
                    name="postalCode"
                    value={tempData.postalCode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 5)
                      onPostalCodeChange(val)
                    }}
                    placeholder="12345"
                    maxLength={5}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <EditField label="Provinsi" name="province" value={tempData.province} onChange={onChange} />
              </>
            ) : (
              <>
                <ViewField label="Kota" value={data.district} />
                <ViewField label="Kode Pos" value={data.postalCode} />
                <ViewField label="Provinsi" value={data.province} />
              </>
            )}
          </div>

          {/* Lokasi info */}
          <div className="flex items-start gap-2 pt-1">
            <MapPin size={16} className="text-blue-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Lokasi Usaha</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {data.address}, {data.district}
              </p>
              {(data.latitude || data.longitude) && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {data.latitude?.toFixed(6)}, {data.longitude?.toFixed(6)}
                </p>
              )}
            </div>
          </div>

          {/* Map */}
          <LocationMap
            latitude={isEditing ? (tempData.latitude ?? null) : (data.latitude ?? null)}
            longitude={isEditing ? (tempData.longitude ?? null) : (data.longitude ?? null)}
            isEditing={isEditing}
            onLocationChange={onLocationChange}
          />
        </div>
      </div>
    </>
  )
}