"use client"

import Image from "next/image"
import { useRef, useState } from "react"
import { Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CATEGORY_OPTIONS, SATUAN } from "@/lib/utils"

export interface ProductFormData {
  productName: string
  brandName: string
  price: string
  weight: string
  unit: string
  jenis: string
  deskripsi: string
  productPhoto: File[]
  productPhotoPreview: string[]
}

interface ProductInfoFormProps {
  onSubmit?: (data: ProductFormData) => void
  initialData?: Partial<ProductFormData>
  isLoading?: boolean
  disabled?: boolean
  formId?: string
  showFooter?: boolean
}

const TIPS_FOTO: string[] = [
  "Gunakan latar belakang putih/terang",
  "Tampilkan label/kemasan produk jelas",
  "Resolusi minimal 800x800 px",
]

const MAX_PHOTOS = 5

const INITIAL_FORM: ProductFormData = {
  productName: "",
  brandName: "",
  price: "",
  weight: "",
  unit: "g",
  jenis: "fnb",
  deskripsi: "",
  productPhoto: [],
  productPhotoPreview: [],
}

export function ProductInfoForm({
  onSubmit,
  initialData,
  isLoading = false,
  disabled = false,
  formId,
  showFooter = true,
}: ProductInfoFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    ...INITIAL_FORM,
    ...initialData,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isDragging, setIsDragging] = useState(false)
  const [replaceSlotIndex, setReplaceSlotIndex] = useState<number | null>(null)

  const mainUploadRef = useRef<HTMLInputElement>(null)
  const replaceUploadRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (disabled) return
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const handleToggleJenis = (id: string) => {
    if (disabled) return
    setFormData((prev) => ({ ...prev, jenis: id }))
  }

  if (!formData.jenis) errors.jenis = "Jenis produk wajib dipilih"

  const addPhotos = (files: FileList | null) => {
    if (disabled || !files) return
    const filledSlots = formData.productPhotoPreview.filter(Boolean).length
    const allowed = MAX_PHOTOS - filledSlots
    const incoming = Array.from(files).slice(0, allowed)

    const validFiles = incoming.filter((f) => {
      if (f.size > 2 * 1024 * 1024) return false
      if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) return false
      return true
    })

    const newPreviews: string[] = []
    let loaded = 0

    validFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        newPreviews.push(reader.result as string)
        loaded++
        if (loaded === validFiles.length) {
          setFormData((prev) => {
            const productPhoto = [...prev.productPhoto]
            const productPhotoPreview = [...prev.productPhotoPreview]
            let cursor = 0
            validFiles.forEach((f, i) => {
              while (productPhotoPreview[cursor]) cursor++
              productPhoto[cursor] = f
              productPhotoPreview[cursor] = newPreviews[i]
              cursor++
            })
            return { ...prev, productPhoto, productPhotoPreview }
          })
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleMainUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    addPhotos(e.target.files)
    e.target.value = ""
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) setIsDragging(true)
  }
  const handleDragLeave = () => setIsDragging(false)
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    addPhotos(e.dataTransfer.files)
  }

  const openReplacePhoto = (index: number) => {
    if (disabled) return
    setReplaceSlotIndex(index)
    replaceUploadRef.current?.click()
  }

  const handleReplaceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (disabled || !file || replaceSlotIndex === null) return
    if (file.size > 2 * 1024 * 1024) return
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const index = replaceSlotIndex
      setFormData((prev) => {
        const productPhoto = [...prev.productPhoto]
        const productPhotoPreview = [...prev.productPhotoPreview]
        productPhoto[index] = file
        productPhotoPreview[index] = reader.result as string
        return { ...prev, productPhoto, productPhotoPreview }
      })
      setReplaceSlotIndex(null)
    }
    reader.readAsDataURL(file)
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (formData.productPhotoPreview.filter(Boolean).length === 0) newErrors.productPhoto = "Foto produk wajib diunggah"
    if (!formData.productName.trim()) newErrors.productName = "Nama produk wajib diisi"
    if (!formData.brandName.trim()) newErrors.brandName = "Nama brand wajib diisi"
    if (!formData.price.trim()) newErrors.price = "Harga wajib diisi"
    if (!formData.weight.trim()) newErrors.weight = "Berat/volume wajib diisi"
    if (formData.jenis.length === 0) newErrors.jenis = "Jenis produk wajib dipilih"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (validateForm() && onSubmit) onSubmit(formData)
  }

  const handleReset = () => {
    setFormData(INITIAL_FORM)
    setErrors({})
  }

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex gap-0 divide-x divide-gray-200">
          {/* Left — form fields */}
          <div className="flex-65 space-y-6 p-8">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-800">Nama Produk</label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  disabled={disabled}
                  placeholder="Contoh: Susu Segar Full Cream 1L"
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 ${
                    errors.productName ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
                  }`}
                />
                {errors.productName && <p className="mt-1 text-xs text-red-500">{errors.productName}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-800">Nama Brand</label>
                <input
                  type="text"
                  name="brandName"
                  value={formData.brandName}
                  onChange={handleChange}
                  disabled={disabled}
                  placeholder="Contoh: Cimory Yogurt"
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 ${
                    errors.brandName ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
                  }`}
                />
                {errors.brandName && <p className="mt-1 text-xs text-red-500">{errors.brandName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-800">Harga</label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  disabled={disabled}
                  placeholder="Contoh: 100.000"
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 ${
                    errors.price ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
                  }`}
                />
                {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-800">Berat/Volume</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    disabled={disabled}
                    placeholder="Contoh: 1000"
                    className={`min-w-0 flex-1 rounded-lg border px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 ${
                      errors.weight ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
                    }`}
                  />
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    disabled={disabled}
                    className="w-24 rounded-lg border border-gray-200 bg-white px-2 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
                  >
                    {SATUAN.produk.map((s: any) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.weight && <p className="mt-1 text-xs text-red-500">{errors.weight}</p>}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">Jenis Produk</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_OPTIONS.map((opt) => {
                  const active = formData.jenis === opt.id
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleToggleJenis(opt.id)}
                      disabled={disabled}
                      className={`rounded-lg border px-4 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed ${
                        active
                          ? "border-blue-600 bg-white text-blue-600"
                          : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
              {errors.jenis && <p className="mt-1 text-xs text-red-500">{errors.jenis}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-800">Deskripsi Produk</label>
              <textarea
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                disabled={disabled}
                placeholder="Keripik singkong renyah dengan bumbu balado khas, dibuat dari singkong pilihan."
                rows={3}
                className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
          </div>

          {/* Right — foto */}
          <div className="flex-35 p-6">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-800">Foto Produk</span>
              <span className="text-sm font-medium text-blue-600">
                {formData.productPhotoPreview.filter(Boolean).length}/{MAX_PHOTOS} Foto
              </span>
            </div>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !disabled && mainUploadRef.current?.click()}
              className={`relative mb-3 flex flex-col items-center justify-center rounded-xl border-2 border-dashed bg-gray-50 py-8 transition ${
                disabled ? "cursor-default" : "cursor-pointer"
              } ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-400 hover:bg-blue-50"}`}
            >
              {formData.productPhotoPreview[0] ? (
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                    openReplacePhoto(0)
                  }}
                  className="group relative h-36 w-full overflow-hidden rounded-lg"
                >
                  <Image src={formData.productPhotoPreview[0]} alt="Foto utama" fill className="object-cover" />
                  {!disabled && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/40">
                      <Camera size={20} className="text-white opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="m21 15-5-5L5 21" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">Upload Foto Produk</p>
                  <p className="mt-0.5 text-xs text-gray-500">Klik atau seret foto ke sini</p>
                  <p className="mt-0.5 text-xs text-gray-400">PNG, JPG, WEBP • Maks. 2MB</p>
                </>
              )}
            </div>
            {errors.productPhoto && <p className="mb-2 text-xs text-red-500">{errors.productPhoto}</p>}

            <input
              ref={mainUploadRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleMainUpload}
              className="hidden"
            />
            <input
              ref={replaceUploadRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleReplaceUpload}
              className="hidden"
            />

            <div className="mb-4 grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((slotIndex) => {
                const preview = formData.productPhotoPreview[slotIndex]
                return (
                  <div
                    key={slotIndex}
                    onClick={() =>
                      !disabled && (preview ? openReplacePhoto(slotIndex) : mainUploadRef.current?.click())
                    }
                    className={`group relative flex aspect-square flex-col items-center justify-center rounded-lg border border-dashed bg-gray-50 transition ${
                      disabled ? "cursor-default" : "cursor-pointer"
                    } ${preview ? "" : "border-gray-200 hover:border-blue-400"}`}
                  >
                    {preview ? (
                      <>
                        <Image src={preview} alt={`Foto ${slotIndex + 1}`} fill className="rounded-lg object-cover" />
                        {!disabled && (
                          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/0 transition-all group-hover:bg-black/40">
                            <Camera size={14} className="text-white opacity-0 transition-opacity group-hover:opacity-100" />
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <svg className="mb-1 h-4 w-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="m21 15-5-5L5 21" />
                        </svg>
                        <span className="text-[10px] text-gray-400">Foto {slotIndex + 1}</span>
                      </>
                    )}
                  </div>
                )
              })}
            </div>

            <div>
              <p className="mb-1.5 text-xs font-semibold text-gray-700">💡 Tips foto produk</p>
              {TIPS_FOTO.map((tip, i) => (
                <p key={i} className="text-xs leading-relaxed text-gray-500">{tip}</p>
              ))}
            </div>
          </div>
        </div>

        {showFooter && (
          <div className="flex gap-4 border-t border-gray-200 px-8 py-5">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="flex-1 border-blue-600 py-5 text-sm font-semibold text-blue-600 hover:bg-blue-50"
            >
              Bersihkan
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-2 bg-blue-600 py-5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              {isLoading ? "Memproses..." : "Selanjutnya →"}
            </Button>
          </div>
        )}
      </div>
    </form>
  )
}