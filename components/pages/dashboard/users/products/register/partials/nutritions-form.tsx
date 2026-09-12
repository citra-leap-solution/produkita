"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AKG, percentAKG, roundAKG } from "@/lib/nutrition"
import { ALLERGEN_OPTIONS } from "@/lib/utils"

function AKGBox({ value }: { value: string }) {
  return (
    <div className="flex w-16 shrink-0 flex-col items-center justify-center rounded-lg border border-blue-300 bg-white px-1 py-1.5">
      <span className="text-[10px] font-medium text-gray-400">%AKG</span>
      <span className="text-sm font-bold text-blue-600">{value || "0"}%</span>
    </div>
  )
}

export interface NutritionFormData {
  servingSize: string
  calories: string
  totalFat: string
  fatDaily: string
  saturatedFat: string
  saturatedFatDaily: string
  carbohydrates: string
  carbohydratesDaily: string
  protein: string
  proteinDaily: string
  sodium: string
  sodiumDaily: string
  sugar: string
  sugarDaily: string
  servingsPerPackage: string
  composition: string
  allergens: string[]
}

interface NutritionFormProps {
  onSubmit?: (data: NutritionFormData) => void
  onPrevious?: () => void
  initialData?: Partial<NutritionFormData>
  isLoading?: boolean
  disabled?: boolean
  formId?: string
  showFooter?: boolean
}

export function NutritionForm({
  onSubmit,
  onPrevious,
  initialData,
  isLoading = false,
  disabled = false,
  formId,
  showFooter = true,
}: NutritionFormProps) {
  const getNumericValue = (value: string) => {
    const parsed = Number.parseFloat(value.replace(/[^0-9.,-]/g, "").replace(",", "."))
    return Number.isFinite(parsed) ? parsed : 0
  }

  const getPercentValue = (value: string, dailyValue: number) =>
    roundAKG(percentAKG(getNumericValue(value), dailyValue)).toString()

  const buildFormData = (data?: Partial<NutritionFormData>): NutritionFormData => ({
    servingSize: data?.servingSize ?? "",
    calories: data?.calories ?? "",
    totalFat: data?.totalFat ?? "",
    fatDaily: data?.fatDaily ?? getPercentValue(data?.totalFat ?? "", AKG.fat),
    saturatedFat: data?.saturatedFat ?? "",
    saturatedFatDaily: data?.saturatedFatDaily ?? getPercentValue(data?.saturatedFat ?? "", AKG.saturatedFat),
    carbohydrates: data?.carbohydrates ?? "",
    carbohydratesDaily: data?.carbohydratesDaily ?? getPercentValue(data?.carbohydrates ?? "", AKG.carbs),
    protein: data?.protein ?? "",
    proteinDaily: data?.proteinDaily ?? getPercentValue(data?.protein ?? "", AKG.protein),
    sodium: data?.sodium ?? "",
    sodiumDaily: data?.sodiumDaily ?? getPercentValue(data?.sodium ?? "", AKG.sodium),
    sugar: data?.sugar ?? "",
    sugarDaily: data?.sugarDaily ?? getPercentValue(data?.sugar ?? "", AKG.sugar),
    servingsPerPackage: data?.servingsPerPackage ?? "",
    composition: data?.composition ?? "",
    allergens: data?.allergens ?? [],
  })

  const [formData, setFormData] = useState<NutritionFormData>(buildFormData(initialData))

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (disabled) return
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "totalFat" ? { fatDaily: getPercentValue(value, AKG.fat) } : {}),
      ...(name === "saturatedFat" ? { saturatedFatDaily: getPercentValue(value, AKG.saturatedFat) } : {}),
      ...(name === "carbohydrates" ? { carbohydratesDaily: getPercentValue(value, AKG.carbs) } : {}),
      ...(name === "protein" ? { proteinDaily: getPercentValue(value, AKG.protein) } : {}),
      ...(name === "sodium" ? { sodiumDaily: getPercentValue(value, AKG.sodium) } : {}),
      ...(name === "sugar" ? { sugarDaily: getPercentValue(value, AKG.sugar) } : {}),
    }))
    if (errors[name]) {
      setErrors((prev) => {
        const n = { ...prev }
        delete n[name]
        return n
      })
    }
  }

  const handleToggleAlergen = (label: string) => {
    if (disabled) return
    setFormData((prev) => ({
      ...prev,
      allergens: prev.allergens.includes(label) ? prev.allergens.filter((a) => a !== label) : [...prev.allergens, label],
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!formData.servingSize.trim()) newErrors.servingSize = "Takaran saji wajib diisi"
    if (!formData.servingsPerPackage.trim()) newErrors.servingsPerPackage = "Sajian perkemasan wajib diisi"
    if (!formData.calories.trim()) newErrors.calories = "Kalori wajib diisi"
    if (!formData.carbohydrates.trim()) newErrors.carbohydrates = "Karbohidrat wajib diisi"
    if (!formData.protein.trim()) newErrors.protein = "Protein wajib diisi"
    if (!formData.sugar.trim()) newErrors.sugar = "Gula wajib diisi"
    if (!formData.sodium.trim()) newErrors.sodium = "Natrium wajib diisi"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm() && onSubmit) onSubmit(formData)
  }
  const inputCls = (field: string) =>
    `min-w-0 flex-1 rounded-lg border px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 ${
      errors[field] ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
    }`

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div className="rounded-xl border border-gray-200 bg-white p-8">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label htmlFor="servingSize" className="mb-1.5 block text-sm font-semibold text-gray-800">
                Takaran Saji <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="servingSize"
                name="servingSize"
                value={formData.servingSize}
                onChange={handleChange}
                disabled={disabled}
                placeholder="Contoh: 30 g"
                className={`w-full ${inputCls("servingSize")}`}
              />
              {errors.servingSize && <p className="mt-1 text-xs text-red-500">{errors.servingSize}</p>}
            </div>

            <div>
              <label htmlFor="servingsPerPackage" className="mb-1.5 block text-sm font-semibold text-gray-800">
                Sajian Perkemasan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="servingsPerPackage"
                name="servingsPerPackage"
                value={formData.servingsPerPackage}
                onChange={handleChange}
                disabled={disabled}
                placeholder="Contoh: 30 g"
                className={`w-full ${inputCls("servingsPerPackage")}`}
              />
              {errors.servingsPerPackage && <p className="mt-1 text-xs text-red-500">{errors.servingsPerPackage}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label htmlFor="calories" className="mb-1.5 block text-sm font-semibold text-gray-800">
                Energi Total(Kalori) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="calories"
                name="calories"
                value={formData.calories}
                onChange={handleChange}
                disabled={disabled}
                placeholder="Contoh: 25 kcal"
                className={`w-full ${inputCls("calories")}`}
              />
              {errors.calories && <p className="mt-1 text-xs text-red-500">{errors.calories}</p>}
            </div>

            <div>
              <label htmlFor="saturatedFat" className="mb-1.5 block text-sm font-semibold text-gray-800">
                Lemak Jenuh
              </label>
              <div className="flex items-center gap-2">
                <div className="relative min-w-0 flex-1">
                  <input
                    type="text"
                    id="saturatedFat"
                    name="saturatedFat"
                    value={formData.saturatedFat}
                    onChange={handleChange}
                    disabled={disabled}
                    placeholder="0"
                    className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-3 pr-8 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">g</span>
                </div>
                <AKGBox value={formData.saturatedFatDaily} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label htmlFor="carbohydrates" className="mb-1.5 block text-sm font-semibold text-gray-800">
                Karbohidrat Total <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <div className="relative min-w-0 flex-1">
                  <input
                    type="text"
                    id="carbohydrates"
                    name="carbohydrates"
                    value={formData.carbohydrates}
                    onChange={handleChange}
                    disabled={disabled}
                    placeholder="0"
                    className={`w-full rounded-lg border py-2.5 pl-3 pr-8 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 ${
                      errors.carbohydrates ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
                    }`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">g</span>
                </div>
                <AKGBox value={formData.carbohydratesDaily} />
              </div>
              {errors.carbohydrates && <p className="mt-1 text-xs text-red-500">{errors.carbohydrates}</p>}
            </div>

            <div>
              <label htmlFor="protein" className="mb-1.5 block text-sm font-semibold text-gray-800">
                Protein <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <div className="relative min-w-0 flex-1">
                  <input
                    type="text"
                    id="protein"
                    name="protein"
                    value={formData.protein}
                    onChange={handleChange}
                    disabled={disabled}
                    placeholder="0"
                    className={`w-full rounded-lg border py-2.5 pl-3 pr-8 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 ${
                      errors.protein ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
                    }`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">g</span>
                </div>
                <AKGBox value={formData.proteinDaily} />
              </div>
              {errors.protein && <p className="mt-1 text-xs text-red-500">{errors.protein}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label htmlFor="sugar" className="mb-1.5 block text-sm font-semibold text-gray-800">
                Gula <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <div className="relative min-w-0 flex-1">
                  <input
                    type="text"
                    id="sugar"
                    name="sugar"
                    value={formData.sugar}
                    onChange={handleChange}
                    disabled={disabled}
                    placeholder="0"
                    className={`w-full rounded-lg border py-2.5 pl-3 pr-8 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 ${
                      errors.sugar ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
                    }`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">g</span>
                </div>
                <AKGBox value={formData.sugarDaily} />
              </div>
              {errors.sugar && <p className="mt-1 text-xs text-red-500">{errors.sugar}</p>}
            </div>

            <div>
              <label htmlFor="sodium" className="mb-1.5 block text-sm font-semibold text-gray-800">
                Natrium (Garam) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <div className="relative min-w-0 flex-1">
                  <input
                    type="text"
                    id="sodium"
                    name="sodium"
                    value={formData.sodium}
                    onChange={handleChange}
                    disabled={disabled}
                    placeholder="0"
                    className={`w-full rounded-lg border py-2.5 pl-3 pr-8 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 ${
                      errors.sodium ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
                    }`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">g</span>
                </div>
                <AKGBox value={formData.sodiumDaily} />
              </div>
              {errors.sodium && <p className="mt-1 text-xs text-red-500">{errors.sodium}</p>}
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 px-4 py-3">
            <p className="text-sm text-blue-600">
              *Persen AKG berdasarkan kebutuhan energi 2150 kkal. Pastikan informasi nutrisi telah diverifikasi oleh
              laboratorium terakreditasi
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-800">Komposisi / Bahan-bahan</label>
            <textarea
              name="composition"
              value={formData.composition}
              onChange={handleChange}
              disabled={disabled}
              placeholder="Contoh: Cabai merah, Bawang putih, Garam, Gula, Minyak sayur..."
              rows={3}
              className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-800">Informasi Alergen</label>
            <div className="flex flex-wrap gap-2">
              {ALLERGEN_OPTIONS.map((opt) => {
                const active = formData.allergens.includes(opt)
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleToggleAlergen(opt)}
                    disabled={disabled}
                    className={`rounded-lg border px-4 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed ${
                      active
                        ? "border-blue-600 bg-white text-blue-600"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {showFooter && (
          <div className="mt-8 flex gap-4">
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
