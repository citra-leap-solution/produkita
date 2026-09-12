'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Package, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

export interface ProductFormData {
  productPhoto: File | null
  productPhotoPreview: string
  productName: string
  brandName: string
  price: string
  weight: string
  unit: string
}

interface ProductInfoFormProps {
  onSubmit?: (data: ProductFormData) => void
  initialData?: Partial<ProductFormData>
  isLoading?: boolean
}

export function ProductInfoForm({ onSubmit, initialData, isLoading = false }: ProductInfoFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    productPhoto: initialData?.productPhoto ?? null,
    productPhotoPreview: initialData?.productPhotoPreview ?? '',
    productName: initialData?.productName ?? '',
    brandName: initialData?.brandName ?? '',
    price: initialData?.price ?? '',
    weight: initialData?.weight ?? '',
    unit: initialData?.unit ?? 'ml',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          productPhoto: 'Ukuran file maksimal 5MB',
        }))
        return
      }

      // Validate file type
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          productPhoto: 'Format file harus JPG atau PNG',
        }))
        return
      }

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          productPhoto: file,
          productPhotoPreview: reader.result as string,
        }))
        setErrors(prev => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { productPhoto, ...rest } = prev
          return rest
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.productPhoto) {
      newErrors.productPhoto = 'Foto produk wajib diunggah'
    }
    if (!formData.productName.trim()) {
      newErrors.productName = 'Nama produk wajib diisi'
    }
    if (!formData.brandName.trim()) {
      newErrors.brandName = 'Nama brand wajib diisi'
    }
    if (!formData.price.trim()) {
      newErrors.price = 'Harga wajib diisi'
    }
    if (!formData.weight.trim()) {
      newErrors.weight = 'Berat/volume wajib diisi'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm() && onSubmit) {
      onSubmit(formData)
    }
  }

  const resetForm = () => {
    setFormData({
      productPhoto: null,
      productPhotoPreview: '',
      productName: '',
      brandName: '',
      price: '',
      weight: '',
      unit: 'ml',
    })
    setErrors({})
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Main Card Container */}
      <div className="rounded-lg border border-gray-200 bg-white">
        {/* Header */}
        <div className="border-b border-gray-200 px-8 py-6">
          <div className="flex items-center gap-3">
            <Package className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-lg font-bold text-gray-900">Informasi Produk</h2>
            </div>
          </div>
        </div>

        {/* Content: Two Column Layout */}
        <div className="grid gap-6 px-8 py-8 lg:grid-cols-2">
          {/* Product Photo Section - Left Column */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Foto Produk <span className="text-red-500">*</span>
            </label>

            {formData.productPhotoPreview ? (
              <div className="mt-4 space-y-3">
                <div className="relative h-64 w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                  <Image
                    src={formData.productPhotoPreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                    width={300}
                    height={300}
                  />
                </div>
                <label htmlFor="productPhoto" className="cursor-pointer">
                  <Button type="button" variant="outline" className="w-full text-sm">
                    Ubah Foto
                  </Button>
                </label>
              </div>
            ) : (
              <label htmlFor="productPhoto" className="cursor-pointer">
                <div className="mt-4 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-20 transition-all hover:border-blue-400 hover:bg-blue-50">
                  <ImageIcon className="h-10 w-10 text-gray-400" />
                  <p className="mt-2 text-sm font-medium text-gray-700">Upload foto produk</p>
                  <p className="mt-1 text-xs text-gray-500">dengan kualitas baik</p>
                  <div className="mt-3 space-y-0.5 text-xs text-gray-500">
                    <p>• Format: JPG, PNG (max 5MB)</p>
                    <p>• Resolusi minimal: 800x800px</p>
                    <p>• Background putih atau netral</p>
                  </div>
                </div>
              </label>
            )}

            <input
              id="productPhoto"
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
              className="hidden"
            />

            {errors.productPhoto && (
              <p className="mt-2 text-xs font-semibold text-red-600">
                {errors.productPhoto}
              </p>
            )}
          </div>

          {/* Product Details Section - Right Column */}
          <div className="space-y-5 lg:py-5">
            {/* Product Name */}
            <div>
              <label htmlFor="productName" className="block text-sm font-semibold text-gray-700">
                Nama Produk <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="productName"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                placeholder="Contoh: Sambal Pedas Original"
                className={`mt-2 block w-full rounded-lg border ${
                  errors.productName ? 'border-red-500' : 'border-gray-300'
                } bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              {errors.productName && (
                <p className="mt-1 text-xs font-semibold text-red-600">
                  {errors.productName}
                </p>
              )}
            </div>

            {/* Brand Name */}
            <div>
              <label htmlFor="brandName" className="block text-sm font-semibold text-gray-700">
                Nama Brand <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="brandName"
                name="brandName"
                value={formData.brandName}
                onChange={handleChange}
                placeholder="Contoh: Rasa Nusantara"
                className={`mt-2 block w-full rounded-lg border ${
                  errors.brandName ? 'border-red-500' : 'border-gray-300'
                } bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              {errors.brandName && (
                <p className="mt-1 text-xs font-semibold text-red-600">
                  {errors.brandName}
                </p>
              )}
            </div>

            {/* Price and Weight Row */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="price" className="block text-sm font-semibold text-gray-700">
                  Harga <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-2">
                  <span className="absolute left-3 top-2.5 text-gray-500">Rp</span>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="25.000"
                    className={`block w-full rounded-lg border ${
                      errors.price ? 'border-red-500' : 'border-gray-300'
                    } bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-xs font-semibold text-red-600">
                    {errors.price}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="weight" className="block text-sm font-semibold text-gray-700">
                  Berat/Volume <span className="text-red-500">*</span>
                </label>
                <div className="mt-2 grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="250"
                    className={`col-span-2 rounded-lg border ${
                      errors.weight ? 'border-red-500' : 'border-gray-300'
                    } bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  />
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="rounded-lg border border-gray-300 bg-gray-50 px-2 py-2 text-sm text-gray-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="ml">ml</option>
                    <option value="l">l</option>
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="pcs">pcs</option>
                  </select>
                </div>
                {errors.weight && (
                  <p className="mt-1 text-xs font-semibold text-red-600">
                    {errors.weight}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 py-6 text-base font-semibold hover:bg-blue-700"
              >
                {isLoading ? 'Memproses...' : 'Lanjutkan'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="px-6 py-6 font-semibold"
                onClick={resetForm}
              >
                Bersihkan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
