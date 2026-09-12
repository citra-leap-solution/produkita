"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { IToogle } from "../../types/product.i"

function TogglePill({ checked, onChange, color, disabled = false }: IToogle) {
  const activeCls: Record<string, string> = {
    blue: "bg-blue-600 text-white",
    purple: "bg-purple-500 text-white",
    green: "bg-green-500 text-white",
    orange: "bg-orange-400 text-white",
  }

  const active = activeCls[color]
  const inactive = "bg-white text-gray-500"

  return (
    <div className={`flex gap-0.5 rounded-full border border-gray-200 bg-gray-100 p-0.5 ${disabled ? "opacity-60" : ""}`}>
      <button
        type="button"
        onClick={() => onChange(false)}
        disabled={disabled}
        className={`rounded-full px-3 py-1 text-xs font-semibold transition-all disabled:cursor-not-allowed ${!checked ? active : inactive}`}
      >
        Tidak
      </button>
      <button
        type="button"
        onClick={() => onChange(true)}
        disabled={disabled}
        className={`rounded-full px-3 py-1 text-xs font-semibold transition-all disabled:cursor-not-allowed ${checked ? active : inactive}`}
      >
        Punya
      </button>
    </div>
  )
}

function UploadArea({
  color,
  fileName,
  filePreview,
  onUpload,
  disabled = false,
}: {
  color: "blue" | "purple" | "green" | "orange"
  fileName?: string
  filePreview?: string
  onUpload: (preview: string, name: string) => void
  disabled?: boolean
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isImagePreview = !!filePreview && !filePreview.startsWith("data:application/pdf")

  const ringCls: Record<string, string> = {
    blue: "bg-blue-500",
    purple: "bg-purple-400",
    green: "bg-green-500",
    orange: "bg-orange-400",
  }
  const borderCls: Record<string, string> = {
    blue: "border-blue-100 bg-blue-50 hover:opacity-80",
    purple: "border-purple-100 bg-purple-50 hover:opacity-80",
    green: "border-green-100 bg-green-50 hover:opacity-80",
    orange: "border-orange-100 bg-orange-50 hover:opacity-80",
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return

    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file maksimal 5MB")
      e.target.value = ""
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      onUpload(reader.result as string, file.name)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div
      onClick={() => !disabled && fileInputRef.current?.click()}
      className={`flex items-center gap-3 rounded-lg border px-4 py-3 transition ${
        disabled ? "cursor-not-allowed border-gray-200 bg-gray-50 opacity-60" : `cursor-pointer ${borderCls[color]}`
      }`}
    >
      {isImagePreview ? (
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-white shadow-sm">
          <Image src={filePreview!} alt={fileName ?? "Sertifikat"} fill className="object-cover" />
        </div>
      ) : (
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
            disabled ? "bg-gray-300" : ringCls[color]
          }`}
        >
          {fileName ? (
            <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L8 8m4-4 4 4M4 20h16" />
            </svg>
          )}
        </div>
      )}
      <div className="overflow-hidden">
        <p className={`truncate text-sm font-semibold ${disabled ? "text-gray-400" : "text-gray-800"}`}>
          {fileName || "Upload File"}
        </p>
        <p className={`text-xs ${disabled ? "text-gray-300" : "text-gray-400"}`}>
          {fileName ? "Klik untuk mengganti" : "PDF, JPG, PNG (Max. 5MB)"}
        </p>
      </div>

      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        accept=".pdf,image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        disabled={disabled}
      />
    </div>
  )
}

function Field({
  label,
  id,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  required,
  disabled = false,
}: {
  label: string
  id: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  type?: string
  error?: string
  required?: boolean
  disabled?: boolean
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className={`mb-1.5 block text-sm font-semibold transition-colors ${disabled ? "text-gray-400" : "text-gray-800"}`}
      >
        {label} {required && !disabled && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition ${
          disabled
            ? "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-400 placeholder-gray-300"
            : error
              ? "border-red-400 bg-red-50 text-gray-900"
              : "border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        }`}
      />
      {error && !disabled && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}

export interface LegalityFormData {
  hasBpom: boolean
  hasPirt: boolean
  hasHalal: boolean
  hasCoa: boolean
  bpomNumber: string
  bpomRegistrationDate: string
  bpomValidUntil: string
  bpomFilePreview?: string
  bpomFileName?: string
  pirtNumber: string
  pirtRegistrationDate: string
  pirtValidUntil: string
  pirtFilePreview?: string
  pirtFileName?: string
  halalCertificateNumber: string
  halalCertifiedBy: string
  halalIssuanceDate: string
  halalValidUntil: string
  halalFilePreview?: string
  halalFileName?: string
  coaNumber: string
  coaLaboratoryName: string
  coaTestDate: string
  coaFilePreview?: string
  coaFileName?: string
}

interface LegalityFormProps {
  onSubmit?: (data: LegalityFormData) => void
  onPrevious?: () => void
  initialData?: Partial<LegalityFormData>
  isLoading?: boolean
  disabled?: boolean
  formId?: string
  showFooter?: boolean
  /** Jenis sertifikat yang sudah tersimpan di database — togglenya terkunci (tidak bisa dimatikan), field hanya bisa diubah saat `disabled=false`. */
  lockedTypes?: ("bpom" | "pirt" | "halal" | "coa")[]
}

export function LegalityForm({
  onSubmit,
  onPrevious,
  initialData,
  isLoading = false,
  disabled = false,
  formId,
  showFooter = true,
  lockedTypes = [],
}: LegalityFormProps) {
  const initialHasBpom = initialData?.hasBpom ?? Boolean(initialData?.bpomNumber)
  const initialHasPirt = initialData?.hasPirt ?? Boolean(initialData?.pirtNumber)
  const initialHasHalal = initialData?.hasHalal ?? Boolean(initialData?.halalCertificateNumber)
  const initialHasCoa = initialData?.hasCoa ?? Boolean(initialData?.coaNumber)

  const [hasBpom, setHasBpom] = useState(initialHasBpom)
  const [hasPirt, setHasPirt] = useState(initialHasPirt)
  const [hasHalal, setHasHalal] = useState(initialHasHalal)
  const [hasCoa, setHasCoa] = useState(initialHasCoa)

  const [formData, setFormData] = useState<LegalityFormData>({
    hasBpom: initialHasBpom,
    hasPirt: initialHasPirt,
    hasHalal: initialHasHalal,
    hasCoa: initialHasCoa,
    bpomNumber: initialData?.bpomNumber ?? "",
    bpomRegistrationDate: initialData?.bpomRegistrationDate ?? "",
    bpomValidUntil: initialData?.bpomValidUntil ?? "",
    bpomFilePreview: initialData?.bpomFilePreview ?? "",
    bpomFileName: initialData?.bpomFileName ?? "",
    pirtNumber: initialData?.pirtNumber ?? "",
    pirtRegistrationDate: initialData?.pirtRegistrationDate ?? "",
    pirtValidUntil: initialData?.pirtValidUntil ?? "",
    pirtFilePreview: initialData?.pirtFilePreview ?? "",
    pirtFileName: initialData?.pirtFileName ?? "",
    halalCertificateNumber: initialData?.halalCertificateNumber ?? "",
    halalCertifiedBy: initialData?.halalCertifiedBy ?? "",
    halalIssuanceDate: initialData?.halalIssuanceDate ?? "",
    halalValidUntil: initialData?.halalValidUntil ?? "",
    halalFilePreview: initialData?.halalFilePreview ?? "",
    halalFileName: initialData?.halalFileName ?? "",
    coaNumber: initialData?.coaNumber ?? "",
    coaLaboratoryName: initialData?.coaLaboratoryName ?? "",
    coaTestDate: initialData?.coaTestDate ?? "",
    coaFilePreview: initialData?.coaFilePreview ?? "",
    coaFileName: initialData?.coaFileName ?? "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (disabled) return
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => {
        const n = { ...prev }
        delete n[name]
        return n
      })
    }
  }

  const clearSectionErrors = (fieldNames: string[]) => {
    setErrors((prev) => {
      const n = { ...prev }
      fieldNames.forEach((f) => delete n[f])
      return n
    })
  }

  const toggleSection = (section: "bpom" | "pirt" | "halal" | "coa", checked: boolean) => {
    if (disabled || lockedTypes.includes(section)) return
    if (section === "bpom") {
      setHasBpom(checked)
      setFormData((prev) => ({
        ...prev,
        hasBpom: checked,
        ...(checked
          ? {}
          : { bpomNumber: "", bpomRegistrationDate: "", bpomValidUntil: "", bpomFilePreview: "", bpomFileName: "" }),
      }))
      if (!checked) clearSectionErrors(["bpomNumber", "bpomRegistrationDate", "bpomValidUntil"])
      return
    }
    if (section === "pirt") {
      setHasPirt(checked)
      setFormData((prev) => ({
        ...prev,
        hasPirt: checked,
        ...(checked
          ? {}
          : { pirtNumber: "", pirtRegistrationDate: "", pirtValidUntil: "", pirtFilePreview: "", pirtFileName: "" }),
      }))
      if (!checked) clearSectionErrors(["pirtNumber", "pirtRegistrationDate", "pirtValidUntil"])
      return
    }
    if (section === "halal") {
      setHasHalal(checked)
      setFormData((prev) => ({
        ...prev,
        hasHalal: checked,
        ...(checked
          ? {}
          : {
              halalCertificateNumber: "",
              halalCertifiedBy: "",
              halalIssuanceDate: "",
              halalValidUntil: "",
              halalFilePreview: "",
              halalFileName: "",
            }),
      }))
      if (!checked)
        clearSectionErrors(["halalCertificateNumber", "halalCertifiedBy", "halalIssuanceDate", "halalValidUntil"])
      return
    }
    setHasCoa(checked)
    setFormData((prev) => ({
      ...prev,
      hasCoa: checked,
      ...(checked ? {} : { coaNumber: "", coaLaboratoryName: "", coaTestDate: "", coaFilePreview: "", coaFileName: "" }),
    }))
    if (!checked) clearSectionErrors(["coaNumber", "coaLaboratoryName", "coaTestDate"])
  }

  const validateForm = (): boolean => {
    const nextErrors: Record<string, string> = {}
    if (hasBpom) {
      if (!formData.bpomNumber.trim()) nextErrors.bpomNumber = "Nomor BPOM wajib diisi"
      if (!formData.bpomRegistrationDate.trim()) nextErrors.bpomRegistrationDate = "Tanggal registrasi wajib diisi"
      if (!formData.bpomValidUntil.trim()) nextErrors.bpomValidUntil = "Berlaku hingga wajib diisi"
    }
    if (hasPirt) {
      if (!formData.pirtNumber.trim()) nextErrors.pirtNumber = "Nomor PIRT wajib diisi"
      if (!formData.pirtRegistrationDate.trim()) nextErrors.pirtRegistrationDate = "Tanggal registrasi wajib diisi"
      if (!formData.pirtValidUntil.trim()) nextErrors.pirtValidUntil = "Berlaku hingga wajib diisi"
    }
    if (hasHalal) {
      if (!formData.halalCertificateNumber.trim()) nextErrors.halalCertificateNumber = "Nomor sertifikat halal wajib diisi"
      if (!formData.halalCertifiedBy.trim()) nextErrors.halalCertifiedBy = "Disertifikasi oleh wajib diisi"
      if (!formData.halalIssuanceDate.trim()) nextErrors.halalIssuanceDate = "Tanggal terbit wajib diisi"
      if (!formData.halalValidUntil.trim()) nextErrors.halalValidUntil = "Berlaku hingga wajib diisi"
    }
    if (hasCoa) {
      if (!formData.coaNumber.trim()) nextErrors.coaNumber = "Nomor COA wajib diisi"
      if (!formData.coaLaboratoryName.trim()) nextErrors.coaLaboratoryName = "Nama laboratorium wajib diisi"
      if (!formData.coaTestDate.trim()) nextErrors.coaTestDate = "Tanggal pengujian wajib diisi"
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm() && onSubmit) onSubmit({ ...formData, hasBpom, hasPirt, hasHalal, hasCoa })
  }

  const bpomLocked = lockedTypes.includes("bpom")
  const pirtLocked = lockedTypes.includes("pirt")
  const halalLocked = lockedTypes.includes("halal")
  const coaLocked = lockedTypes.includes("coa")

  const bpomFieldsDisabled = !hasBpom || disabled
  const pirtFieldsDisabled = !hasPirt || disabled
  const halalFieldsDisabled = !hasHalal || disabled
  const coaFieldsDisabled = !hasCoa || disabled

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
          <svg className="h-4 w-4 shrink-0 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-sm text-blue-600">Anda dapat memilih lebih dari satu sertifikasi yang dimiliki produk</p>
        </div>

        {/* BPOM Section */}
        <div className="overflow-hidden rounded-xl border border-blue-200">
          <div className="flex items-center justify-between bg-blue-50 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-white shadow-sm">
                <div className="flex items-end gap-0.5">
                  <div className="h-4 w-0.5 rounded-full bg-teal-600" />
                  <div className="h-5 w-0.5 rounded-full bg-teal-600" />
                  <div className="h-6 w-0.5 rounded-full bg-teal-600" />
                  <div className="h-5 w-0.5 rounded-full bg-teal-600" />
                  <div className="h-4 w-0.5 rounded-full bg-teal-600" />
                </div>
                <p className="mt-0.5 text-[7px] font-bold tracking-tight text-teal-700">BADAN POM</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">BPOM (Badan Pengawas Obat dan Makanan)</p>
                <p className="text-xs text-gray-500">Produk memiliki izin edar BPOM</p>
              </div>
            </div>
            <TogglePill checked={hasBpom} onChange={(v) => toggleSection("bpom", v)} color="blue" disabled={disabled || bpomLocked} />
          </div>

          <div className="grid grid-cols-4 gap-4 bg-white px-6 py-5">
            <Field
              label="Nomor BPOM"
              id="bpomNumber"
              name="bpomNumber"
              value={formData.bpomNumber}
              onChange={handleChange}
              placeholder="Contoh: MD 1234567890"
              error={errors.bpomNumber}
              required={hasBpom}
              disabled={bpomFieldsDisabled}
            />
            <Field
              label="Tanggal Registrasi"
              id="bpomRegistrationDate"
              name="bpomRegistrationDate"
              value={formData.bpomRegistrationDate}
              onChange={handleChange}
              type="date"
              error={errors.bpomRegistrationDate}
              required={hasBpom}
              disabled={bpomFieldsDisabled}
            />
            <Field
              label="Berlaku Hingga"
              id="bpomValidUntil"
              name="bpomValidUntil"
              value={formData.bpomValidUntil}
              onChange={handleChange}
              type="date"
              error={errors.bpomValidUntil}
              required={hasBpom}
              disabled={bpomFieldsDisabled}
            />
            <div>
              <p
                className={`mb-1.5 text-sm font-semibold transition-colors ${!hasBpom ? "text-gray-400" : "text-gray-800"}`}
              >
                Upload Sertifikat{" "}
                <span className={`font-normal ${!hasBpom ? "text-gray-300" : "text-gray-400"}`}>(Opsional)</span>
              </p>
              <UploadArea
                color="blue"
                fileName={formData.bpomFileName}
                filePreview={formData.bpomFilePreview}
                onUpload={(preview, name) =>
                  setFormData((prev) => ({ ...prev, bpomFilePreview: preview, bpomFileName: name }))
                }
                disabled={bpomFieldsDisabled}
              />
            </div>
          </div>
        </div>

        {/* PIRT Section */}
        <div className="overflow-hidden rounded-xl border border-purple-200">
          <div className="flex items-center justify-between bg-purple-50 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                <svg className="h-7 w-7 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">PIRT (Pangan Industri Rumah Tangga)</p>
                <p className="text-xs text-gray-500">Produk memiliki izin PIRT.</p>
              </div>
            </div>
            <TogglePill checked={hasPirt} onChange={(v) => toggleSection("pirt", v)} color="purple" disabled={disabled || pirtLocked} />
          </div>

          <div className="grid grid-cols-4 gap-4 bg-white px-6 py-5">
            <Field
              label="Nomor PIRT"
              id="pirtNumber"
              name="pirtNumber"
              value={formData.pirtNumber}
              onChange={handleChange}
              placeholder="Contoh: 1234567890"
              error={errors.pirtNumber}
              required={hasPirt}
              disabled={pirtFieldsDisabled}
            />
            <Field
              label="Tanggal Registrasi"
              id="pirtRegistrationDate"
              name="pirtRegistrationDate"
              value={formData.pirtRegistrationDate}
              onChange={handleChange}
              type="date"
              error={errors.pirtRegistrationDate}
              required={hasPirt}
              disabled={pirtFieldsDisabled}
            />
            <Field
              label="Berlaku Hingga"
              id="pirtValidUntil"
              name="pirtValidUntil"
              value={formData.pirtValidUntil}
              onChange={handleChange}
              type="date"
              error={errors.pirtValidUntil}
              required={hasPirt}
              disabled={pirtFieldsDisabled}
            />
            <div>
              <p
                className={`mb-1.5 text-sm font-semibold transition-colors ${!hasPirt ? "text-gray-400" : "text-gray-800"}`}
              >
                Upload Sertifikat{" "}
                <span className={`font-normal ${!hasPirt ? "text-gray-300" : "text-gray-400"}`}>(Opsional)</span>
              </p>
              <UploadArea
                color="purple"
                fileName={formData.pirtFileName}
                filePreview={formData.pirtFilePreview}
                onUpload={(preview, name) =>
                  setFormData((prev) => ({ ...prev, pirtFilePreview: preview, pirtFileName: name }))
                }
                disabled={pirtFieldsDisabled}
              />
            </div>
          </div>
        </div>

        {/* Halal Section */}
        <div className="overflow-hidden rounded-xl border border-green-200">
          <div className="flex items-center justify-between bg-green-50 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-green-600 bg-white">
                <svg
                  className="h-7 w-7 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Halal (Sertifikasi Halal MUI)</p>
                <p className="text-xs text-gray-500">Produk memiliki sertifikat halal.</p>
              </div>
            </div>
            <TogglePill checked={hasHalal} onChange={(v) => toggleSection("halal", v)} color="green" disabled={disabled || halalLocked} />
          </div>

          <div className="space-y-4 bg-white px-6 py-5">
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Nomor Sertifikat"
                id="halalCertificateNumber"
                name="halalCertificateNumber"
                value={formData.halalCertificateNumber}
                onChange={handleChange}
                placeholder="Contoh: ID1234567890"
                error={errors.halalCertificateNumber}
                required={hasHalal}
                disabled={halalFieldsDisabled}
              />
              <div>
                <label
                  htmlFor="halalCertifiedBy"
                  className={`mb-1.5 block text-sm font-semibold transition-colors ${
                    !hasHalal ? "text-gray-400" : "text-gray-800"
                  }`}
                >
                  Disertifikasi oleh {hasHalal && <span className="text-red-500">*</span>}
                </label>
                <input
                  id="halalCertifiedBy"
                  name="halalCertifiedBy"
                  value={formData.halalCertifiedBy}
                  onChange={handleChange}
                  placeholder="Contoh: BPJPH"
                  disabled={halalFieldsDisabled}
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition ${
                    !hasHalal
                      ? "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-400 placeholder-gray-300"
                      : errors.halalCertifiedBy
                        ? "border-red-400 bg-red-50 text-gray-900"
                        : "border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  }`}
                />
                {errors.halalCertifiedBy && hasHalal && (
                  <p className="mt-1 text-xs text-red-500">{errors.halalCertifiedBy}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Field
                label="Tanggal Registrasi"
                id="halalIssuanceDate"
                name="halalIssuanceDate"
                value={formData.halalIssuanceDate}
                onChange={handleChange}
                type="date"
                error={errors.halalIssuanceDate}
                required={hasHalal}
                disabled={halalFieldsDisabled}
              />
              <Field
                label="Berlaku Hingga"
                id="halalValidUntil"
                name="halalValidUntil"
                value={formData.halalValidUntil}
                onChange={handleChange}
                type="date"
                error={errors.halalValidUntil}
                required={hasHalal}
                disabled={halalFieldsDisabled}
              />
              <div>
                <p
                  className={`mb-1.5 text-sm font-semibold transition-colors ${
                    !hasHalal ? "text-gray-400" : "text-gray-800"
                  }`}
                >
                  Upload Sertifikat{" "}
                  <span className={`font-normal ${!hasHalal ? "text-gray-300" : "text-gray-400"}`}>(Opsional)</span>
                </p>
                <UploadArea
                  color="green"
                  fileName={formData.halalFileName}
                  filePreview={formData.halalFilePreview}
                  onUpload={(preview, name) =>
                    setFormData((prev) => ({ ...prev, halalFilePreview: preview, halalFileName: name }))
                  }
                  disabled={halalFieldsDisabled}
                />
              </div>
            </div>
          </div>
        </div>

        {/* COA Section */}
        <div className="overflow-hidden rounded-xl border border-orange-200">
          <div className="flex items-center justify-between bg-orange-50 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                <svg className="h-7 w-7 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">COA (Certificate of Analysis)</p>
                <p className="text-xs text-gray-500">Produk memiliki sertifikat hasil uji laboratorium.</p>
              </div>
            </div>
            <TogglePill checked={hasCoa} onChange={(v) => toggleSection("coa", v)} color="orange" disabled={disabled || coaLocked} />
          </div>

          <div className="space-y-4 bg-white px-6 py-5">
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Nomor COA"
                id="coaNumber"
                name="coaNumber"
                value={formData.coaNumber}
                onChange={handleChange}
                placeholder="Contoh: 1234567890"
                error={errors.coaNumber}
                required={hasCoa}
                disabled={coaFieldsDisabled}
              />
              <Field
                label="Nama Laboratorium"
                id="coaLaboratoryName"
                name="coaLaboratoryName"
                value={formData.coaLaboratoryName}
                onChange={handleChange}
                placeholder="Contoh: Lab Kesehatan Daerah"
                error={errors.coaLaboratoryName}
                required={hasCoa}
                disabled={coaFieldsDisabled}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Tanggal Pengujian"
                id="coaTestDate"
                name="coaTestDate"
                value={formData.coaTestDate}
                onChange={handleChange}
                type="date"
                error={errors.coaTestDate}
                required={hasCoa}
                disabled={coaFieldsDisabled}
              />
              <div>
                <p
                  className={`mb-1.5 text-sm font-semibold transition-colors ${!hasCoa ? "text-gray-400" : "text-gray-800"}`}
                >
                  Upload Sertifikat{" "}
                  <span className={`font-normal ${!hasCoa ? "text-gray-300" : "text-gray-400"}`}>(Opsional)</span>
                </p>
                <UploadArea
                  color="orange"
                  fileName={formData.coaFileName}
                  filePreview={formData.coaFilePreview}
                  onUpload={(preview, name) =>
                    setFormData((prev) => ({ ...prev, coaFilePreview: preview, coaFileName: name }))
                  }
                  disabled={coaFieldsDisabled}
                />
              </div>
            </div>
          </div>
        </div>

        {showFooter && (
          <div className="flex gap-4 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onPrevious}
              className="flex-1 border-blue-600 py-5 text-sm font-semibold text-blue-600 hover:bg-blue-50"
            >
              &#8592; Sebelumnya
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-2 bg-blue-600 py-5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              {isLoading ? "Memproses..." : "Selanjutnya \u2192"}
            </Button>
          </div>
        )}
      </div>
    </form>
  )
}
