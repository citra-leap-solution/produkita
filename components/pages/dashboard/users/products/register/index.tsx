"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Info } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  ProductFormData,
  ProductInfoForm,
  ServingFormData,
  ServingForm,
  NutritionForm,
  NutritionFormData,
  LegalityForm,
  LegalityFormData,
  Rekap,
} from "./partials"
import { useProduct } from "@/hooks/useProducts"
import { useAuthStore } from "@/stores/useAuthStore"
import { CertificateType, ProductCategory, WeightUnits } from "@/lib/enums"

const STEPS = [
  { id: 1, label: "Dasar Produk UMKM" },
  { id: 2, label: "Nutrisi & Gizi" },
  { id: 3, label: "Sertifikat" },
  { id: 4, label: "Saran Penyajian" },
  { id: 5, label: "Rekap Data" },
]

const JENIS_TO_CATEGORY: Record<string, ProductCategory> = {
  fnb: "fnb",
  cosmetic: "cosmetic",
  pharmaceutical: "pharmaceutical",
}

export function RegistryPage() {
  const router = useRouter()
  const { uuid, email: userEmail } = useAuthStore()
  const { submitProduct, loading, error } = useProduct()

  const [currentStep, setCurrentStep] = useState(1)
  const [productData, setProductData] = useState<ProductFormData | undefined>()
  const [nutritionData, setNutritionData] = useState<NutritionFormData | undefined>()
  const [legalityData, setLegalityData] = useState<LegalityFormData | undefined>()
  const [servingData, setServingData] = useState<ServingFormData | undefined>()
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (error) toast.error("Gagal mendaftarkan produk", { description: error })
  }, [error])

  const handleSubmitProduct = (data: ProductFormData) => {
    setProductData(data)
    setCurrentStep(2)
  }

  const handleSubmitNutrition = (data: NutritionFormData) => {
    setNutritionData(data)
    setCurrentStep(3)
  }

  const handleSubmitLegality = (data: LegalityFormData) => {
    setLegalityData(data)
    setCurrentStep(4)
  }

  const handleSubmitServing = (data: ServingFormData) => {
    setServingData(data)
    setCurrentStep(5)
  }

  const handleFinalSubmit = async () => {
    if (!productData || !nutritionData || !legalityData || !servingData || !uuid) return

    let tenantEmail = userEmail ?? ""
    try {
      const res = await fetch("/api/tenants/me/email")
      const json = await res.json()
      if (json.ok && json.data?.email) tenantEmail = json.data.email
    } catch {
      // fallback ke email user
    }

    // mapping jenis ke ProductCategory
    const productType = JENIS_TO_CATEGORY[productData.jenis?.[0]?.toLowerCase() ?? "fnb"] ?? "fnb"

    // build certificates
    const certificates: {
      type: CertificateType
      number?: string
      registered_at?: Date
      valid_until?: Date
      lab_name?: string
      file?: File
    }[] = []

    if (legalityData.hasBpom) {
      certificates.push({
        type: "bpom",
        number: legalityData.bpomNumber,
        registered_at: legalityData.bpomRegistrationDate ? new Date(legalityData.bpomRegistrationDate) : undefined,
        valid_until: legalityData.bpomValidUntil ? new Date(legalityData.bpomValidUntil) : undefined,
      })
    }
    if (legalityData.hasPirt) {
      certificates.push({
        type: "pirt",
        number: legalityData.pirtNumber,
        registered_at: legalityData.pirtRegistrationDate ? new Date(legalityData.pirtRegistrationDate) : undefined,
        valid_until: legalityData.pirtValidUntil ? new Date(legalityData.pirtValidUntil) : undefined,
      })
    }
    if (legalityData.hasHalal) {
      certificates.push({
        type: "halal",
        number: legalityData.halalCertificateNumber,
        registered_at: legalityData.halalIssuanceDate ? new Date(legalityData.halalIssuanceDate) : undefined,
        valid_until: legalityData.halalValidUntil ? new Date(legalityData.halalValidUntil) : undefined,
      })
    }
    if (legalityData.hasCoa) {
      certificates.push({
        type: "coa",
        number: legalityData.coaNumber,
        registered_at: legalityData.coaTestDate ? new Date(legalityData.coaTestDate) : undefined,
        lab_name: legalityData.coaLaboratoryName,
      })
    }

    const result = await submitProduct(tenantEmail, {
      product: {
        name: productData.productName,
        brand: productData.brandName,
        price: productData.price ? parseFloat(productData.price.replace(/\D/g, "")) : undefined,
        description: productData.deskripsi,
        type: productType,
        weight: productData.weight ? parseFloat(productData.weight) : undefined,
        weight_unit: productData.unit as WeightUnits,
      },
      productImages: productData.productPhoto,
      nutrition: {
        servings: nutritionData.servingSize ? parseFloat(nutritionData.servingSize) : undefined,
        serving_pkgs: nutritionData.servingsPerPackage ? parseFloat(nutritionData.servingsPerPackage) : undefined,
        energy: nutritionData.calories ? parseFloat(nutritionData.calories) : undefined,
        fat: nutritionData.totalFat ? parseFloat(nutritionData.totalFat) : undefined,
        saturated_fat: nutritionData.saturatedFat ? parseFloat(nutritionData.saturatedFat) : undefined,
        protein: nutritionData.protein ? parseFloat(nutritionData.protein) : undefined,
        carbo: nutritionData.carbohydrates ? parseFloat(nutritionData.carbohydrates) : undefined,
        sugar: nutritionData.sugar ? parseFloat(nutritionData.sugar) : undefined,
        natrium: nutritionData.sodium ? parseFloat(nutritionData.sodium) : undefined,
        composition: nutritionData.composition,
        allergens: nutritionData.allergens,
      },
      certificates,
      serving: {
        serving_info: servingData.servingInfo,
        serving_portion: servingData.portionInfo,
        storage_info: servingData.storageInfo,
        video_url: servingData.videoLink,
        images: servingData.servingPhotos,
      },
    })

    if (result) {
      toast.success("Produk berhasil didaftarkan", { description: "QR Code telah dikirim ke email Anda." })
      setSuccess(true)
    }
  }

  const isStepAccessible = (stepId: number) => {
    if (stepId === 1) return true
    if (stepId === 2) return !!productData
    if (stepId === 3) return !!productData && !!nutritionData
    if (stepId === 4) return !!productData && !!nutritionData && !!legalityData
    if (stepId === 5) return !!productData && !!nutritionData && !!legalityData && !!servingData
    return false
  }

  const isStepCompleted = (stepId: number) => {
    if (stepId === 1) return !!productData
    if (stepId === 2) return !!nutritionData
    if (stepId === 3) return !!legalityData
    if (stepId === 4) return !!servingData
    return false
  }

  if (success) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
        <div className="flex min-h-[calc(100vh-8rem)] w-full flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-16 shadow-sm">
          <div className="mb-6 flex h-22 w-22 items-center justify-center rounded-full bg-[#D1FAE5]">
            <div className="flex h-15 w-15 items-center justify-center rounded-full bg-[#10B981] shadow-sm">
              <Check className="h-8 w-8 text-white" strokeWidth={3} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Pendaftaran Produk Berhasil!</h2>
          <p className="mt-3 text-center text-sm text-gray-500">
            Data produk &quot;{productData?.productName}&quot; telah berhasil dikirim.
          </p>
          <div className="mt-8 flex w-full max-w-2xl items-center justify-center gap-2 rounded-lg bg-[#EFF6FF] px-4 py-3">
            <Info className="h-4 w-4 shrink-0 text-blue-600" />
            <p className="text-sm font-medium text-blue-600">
              QR Code telah dikirim ke email Anda.
            </p>
          </div>
          <Button
            onClick={() => router.push("/dashboard/products")}
            className="mt-4 w-full max-w-2xl bg-blue-600 py-6 text-sm font-semibold hover:bg-blue-700"
          >
            Lihat List Produk
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-2 bg-gray-50 px-4 pb-2 pt-5 sm:px-6 lg:px-8">
        <h1 className="text-sm font-semibold text-blue-600">Pendaftaran Produk</h1>
        <p className="mt-1 text-xs text-gray-500">
          Lengkapi Dasar Produk UMKM untuk mendapatkan QR Code
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-50 px-4 pb-4 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center">
            {STEPS.map((step, index) => {
              const isActive = currentStep === step.id
              const isCompleted = isStepCompleted(step.id)
              const isAccessible = isStepAccessible(step.id)
              const isLast = index === STEPS.length - 1

              return (
                <div key={step.id} className="flex min-w-0 flex-1 items-center">
                  <div className={`flex shrink-0 items-center gap-2 transition-all ${!isAccessible ? "opacity-50" : ""}`}>
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                        isCompleted && !isActive
                          ? "bg-green-500 text-white"
                          : isActive
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {isCompleted && !isActive ? (
                        <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="2,7 5.5,10.5 12,3.5" />
                        </svg>
                      ) : (
                        step.id
                      )}
                    </span>
                    <span className={`whitespace-nowrap text-sm transition-colors ${
                      isCompleted && !isActive ? "font-medium text-green-600" : isActive ? "font-semibold text-blue-600" : "font-normal text-gray-400"
                    }`}>
                      {step.label}
                    </span>
                  </div>
                  {!isLast && (
                    <div className={`mx-3 h-px flex-1 transition-colors ${isCompleted ? "bg-green-400" : "bg-gray-200"}`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="w-full px-4 pb-12 sm:px-6 lg:px-8">
        {currentStep === 1 && (
          <ProductInfoForm onSubmit={handleSubmitProduct} initialData={productData} />
        )}
        {currentStep === 2 && (
          <NutritionForm onSubmit={handleSubmitNutrition} onPrevious={() => setCurrentStep(1)} initialData={nutritionData} />
        )}
        {currentStep === 3 && (
          <LegalityForm onSubmit={handleSubmitLegality} onPrevious={() => setCurrentStep(2)} initialData={legalityData} />
        )}
        {currentStep === 4 && (
          <ServingForm onSubmit={handleSubmitServing} onPrevious={() => setCurrentStep(3)} initialData={servingData} />
        )}
        {currentStep === 5 && (
          <Rekap
            productData={productData}
            nutritionData={nutritionData}
            legalityData={legalityData}
            servingData={servingData}
            onSubmit={handleFinalSubmit}
            onEdit={setCurrentStep}
            isLoading={loading}
          />
        )}
      </div>
    </div>
  )
}