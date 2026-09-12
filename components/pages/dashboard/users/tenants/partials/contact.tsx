import { Phone, Mail, Globe } from "lucide-react"
import { ContactPartialProps } from "../types/tenants.i"

const formatPhone = (value: string) => {
  // hanya angka dan + di awal
  return value.replace(/[^\d+]/g, "").replace(/(?!^)\+/g, "")
}

export default function ContactPartial({
  data,
  isEditing,
  onChange,
  onPhoneChange,
}: ContactPartialProps & { onPhoneChange: (value: string) => void }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="text-[15px] font-bold text-gray-900 mb-4">Kontak</h2>
      <div className="space-y-4">

        {/* Telepon */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
            <Phone size={14} className="text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500">Telepon</p>
            {isEditing ? (
              <input
                name="phone"
                value={data.phone}
                onChange={(e) => onPhoneChange(formatPhone(e.target.value))}
                placeholder="+628xxxxxxxxxx"
                maxLength={15}
                className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            ) : (
              <p className="text-sm font-semibold text-gray-900 mt-0.5">{data.phone || "—"}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
            <Mail size={14} className="text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500">Email</p>
            {isEditing ? (
              <input
                name="email"
                type="email"
                value={data.email}
                onChange={onChange}
                placeholder="contoh@email.com"
                className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            ) : (
              <p className="text-sm font-semibold text-gray-900 mt-0.5">{data.email || "—"}</p>
            )}
          </div>
        </div>

        {/* Website */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
            <Globe size={14} className="text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500">Website</p>
            {isEditing ? (
              <input
                name="website"
                value={data.website}
                onChange={onChange}
                placeholder="www.example.com"
                className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            ) : (
              <p className="text-sm font-semibold text-gray-900 mt-0.5">{data.website || "—"}</p>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}