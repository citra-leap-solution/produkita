"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Pencil, X, Check, QrCode } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useProduct } from "@/hooks/useProducts"
import { AKG, percentAKG, roundAKG } from "@/lib/nutrition"
import {
  ProductInfoForm,
  ProductFormData,
  NutritionForm,
  NutritionFormData,
  ServingForm,
  ServingFormData,
  LegalityForm,
  LegalityFormData,
  Rekap,
} from "../register/partials"
import { QrCodeModal } from "../partials/qr-code-modal"
import { WeightUnits, ProductCategory, CertificateType } from "@/lib/enums"

interface ProductDetailPageProps {
  uuid: string
}

const STEPS = [
  { id: 1, label: "Dasar Produk UMKM" },
  { id: 2, label: "Nutrisi & Gizi" },
  { id: 3, label: "Sertifikat" },
  { id: 4, label: "Saran Penyajian" },
  { id: 5, label: "Rekap Data" },
]

const getPercentValue = (value: string, dailyValue: number) =>
  roundAKG(percentAKG(Number.parseFloat(value) || 0, dailyValue)).toString()

function EditTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1 rounded-lg border border-blue-500 bg-white px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50"
    >
      <Pencil className="h-3.5 w-3.5" />
      Edit
    </button>
  )
}

function EditActions({ onCancel, formId, loading }: { onCancel: () => void; formId: string; loading: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onCancel}
        disabled={loading}
        className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        <X className="h-3.5 w-3.5" />
        Batal
      </button>
      <button
        type="submit"
        form={formId}
        disabled={loading}
        className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        <Check className="h-3.5 w-3.5" />
        {loading ? "Menyimpan..." : "Simpan"}
      </button>
    </div>
  )
}

export function ProductDetailPage({ uuid }: ProductDetailPageProps) {
  const router = useRouter()
  const {
    getProduct,
    updateProductBasic,
    updateProductImages,
    updateNutrition,
    updateServing,
    updateServingImages,
    createCertificate,
    loading,
    error,
  } = useProduct()

  const [product, setProduct] = useState<any>(null)
  const [isFetching, setIsFetching] = useState(true)
  const [showQrModal, setShowQrModal] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const [isEditingBasic, setIsEditingBasic] = useState(false)
  const [basicEditSession, setBasicEditSession] = useState(0)
  const [isEditingNutrition, setIsEditingNutrition] = useState(false)
  const [nutritionEditSession, setNutritionEditSession] = useState(0)
  const [isEditingLegality, setIsEditingLegality] = useState(false)
  const [legalityEditSession, setLegalityEditSession] = useState(0)
  const [isEditingServing, setIsEditingServing] = useState(false)
  const [servingEditSession, setServingEditSession] = useState(0)

  useEffect(() => {
    const fetchProduct = async () => {
      setIsFetching(true)
      const result = await getProduct(uuid)
      if (result) setProduct(result)
      setIsFetching(false)
    }
    fetchProduct()
  }, [uuid])

  useEffect(() => {
    if (error) toast.error("Gagal menyimpan perubahan", { description: error })
  }, [error])

  // ── mapping product -> form data ──
  const productFormData: Partial<ProductFormData> | undefined = product
    ? {
        productName: product.name ?? "",
        brandName: product.brand ?? "",
        price: product.price?.toString() ?? "",
        weight: product.weight?.toString() ?? "",
        unit: product.weight_unit ?? "g",
        jenis: product.type ?? "fnb",
        deskripsi: product.description ?? "",
        productPhoto: [],
        productPhotoPreview: product.images?.map((img: any) => img.url) ?? [],
      }
    : undefined

  const nutritionFormData: Partial<NutritionFormData> | undefined = product?.nutrition_info
    ? {
        servingSize: product.nutrition_info.servings?.toString() ?? "",
        servingsPerPackage: product.nutrition_info.serving_pkgs?.toString() ?? "",
        calories: product.nutrition_info.energy?.toString() ?? "",
        totalFat: product.nutrition_info.fat?.toString() ?? "",
        fatDaily: getPercentValue(product.nutrition_info.fat?.toString() ?? "", AKG.fat),
        saturatedFat: product.nutrition_info.saturated_fat?.toString() ?? "",
        saturatedFatDaily: getPercentValue(product.nutrition_info.saturated_fat?.toString() ?? "", AKG.saturatedFat),
        carbohydrates: product.nutrition_info.carbo?.toString() ?? "",
        carbohydratesDaily: getPercentValue(product.nutrition_info.carbo?.toString() ?? "", AKG.carbs),
        protein: product.nutrition_info.protein?.toString() ?? "",
        proteinDaily: getPercentValue(product.nutrition_info.protein?.toString() ?? "", AKG.protein),
        sugar: product.nutrition_info.sugar?.toString() ?? "",
        sugarDaily: getPercentValue(product.nutrition_info.sugar?.toString() ?? "", AKG.sugar),
        sodium: product.nutrition_info.natrium?.toString() ?? "",
        sodiumDaily: getPercentValue(product.nutrition_info.natrium?.toString() ?? "", AKG.sodium),
        composition: product.nutrition_info.composition ?? "",
        allergens: product.nutrition_info.allergens ?? [],
      }
    : undefined

  const servingFormData: Partial<ServingFormData> | undefined = product?.serving
    ? {
        servingInfo: product.serving.serving_info ?? "",
        storageInfo: product.serving.storage_info ?? "",
        portionInfo: product.serving.serving_portion ?? "",
        videoLink: product.serving.video_url ?? "",
        servingPhotos: [],
        servingPhotoPreviews: product.serving.images?.map((img: any) => img.url) ?? [],
      }
    : undefined

  // mapping product.certificates -> LegalityFormData (untuk Rekap)
  const legalityFormData: LegalityFormData | undefined = product
    ? (() => {
        const findCert = (type: string) => product.certificates?.find((c: any) => c.type === type)
        const fileNameFromUrl = (url?: string | null) => (url ? decodeURIComponent(url.split("/").pop() ?? "Sertifikat") : undefined)
        const bpom = findCert("bpom")
        const pirt = findCert("pirt")
        const halal = findCert("halal")
        const coa = findCert("coa")
        return {
          hasBpom: !!bpom,
          hasPirt: !!pirt,
          hasHalal: !!halal,
          hasCoa: !!coa,
          bpomNumber: bpom?.number ?? "",
          bpomRegistrationDate: bpom?.registered_at ? new Date(bpom.registered_at).toISOString().split("T")[0] : "",
          bpomValidUntil: bpom?.valid_until ? new Date(bpom.valid_until).toISOString().split("T")[0] : "",
          bpomFilePreview: bpom?.certificate_url ?? "",
          bpomFileName: fileNameFromUrl(bpom?.certificate_url),
          pirtNumber: pirt?.number ?? "",
          pirtRegistrationDate: pirt?.registered_at ? new Date(pirt.registered_at).toISOString().split("T")[0] : "",
          pirtValidUntil: pirt?.valid_until ? new Date(pirt.valid_until).toISOString().split("T")[0] : "",
          pirtFilePreview: pirt?.certificate_url ?? "",
          pirtFileName: fileNameFromUrl(pirt?.certificate_url),
          halalCertificateNumber: halal?.number ?? "",
          halalCertifiedBy: halal?.lab_name ?? "",
          halalIssuanceDate: halal?.registered_at ? new Date(halal.registered_at).toISOString().split("T")[0] : "",
          halalValidUntil: halal?.valid_until ? new Date(halal.valid_until).toISOString().split("T")[0] : "",
          halalFilePreview: halal?.certificate_url ?? "",
          halalFileName: fileNameFromUrl(halal?.certificate_url),
          coaNumber: coa?.number ?? "",
          coaLaboratoryName: coa?.lab_name ?? "",
          coaTestDate: coa?.registered_at ? new Date(coa.registered_at).toISOString().split("T")[0] : "",
          coaFilePreview: coa?.certificate_url ?? "",
          coaFileName: fileNameFromUrl(coa?.certificate_url),
        }
      })()
    : undefined

  // ── save handlers ──
  const saveBasic = async (data: ProductFormData) => {
    const result = await updateProductBasic(uuid, {
      name: data.productName,
      brand: data.brandName,
      price: data.price ? parseFloat(data.price.replace(/\D/g, "")) : undefined,
      weight: data.weight ? parseFloat(data.weight) : undefined,
      weight_unit: data.unit as WeightUnits,
      type: data.jenis as ProductCategory,
      description: data.deskripsi,
    })
    if (!result) return

    let updatedImages = product.images

    const changedPhotos = data.productPhoto
      .map((file, index) => ({ index, file }))
      .filter((c): c is { index: number; file: File } => c.file instanceof File)
    if (changedPhotos.length > 0) {
      const imagesResult = await updateProductImages(uuid, changedPhotos)
      if (imagesResult) updatedImages = imagesResult.images
    }

    toast.success("Informasi produk diperbarui")
    setProduct((prev: any) => ({ ...prev, ...result, images: updatedImages }))
    setIsEditingBasic(false)
  }

  const saveNutrition = async (data: NutritionFormData) => {
    const result = await updateNutrition(uuid, {
      servings: data.servingSize ? parseFloat(data.servingSize) : undefined,
      serving_pkgs: data.servingsPerPackage ? parseFloat(data.servingsPerPackage) : undefined,
      energy: data.calories ? parseFloat(data.calories) : undefined,
      fat: data.totalFat ? parseFloat(data.totalFat) : undefined,
      saturated_fat: data.saturatedFat ? parseFloat(data.saturatedFat) : undefined,
      carbo: data.carbohydrates ? parseFloat(data.carbohydrates) : undefined,
      protein: data.protein ? parseFloat(data.protein) : undefined,
      sugar: data.sugar ? parseFloat(data.sugar) : undefined,
      natrium: data.sodium ? parseFloat(data.sodium) : undefined,
      composition: data.composition,
      allergens: data.allergens,
    })
    if (result) {
      toast.success("Informasi nutrisi & gizi diperbarui")
      setProduct((prev: any) => ({ ...prev, nutrition_info: result }))
      setIsEditingNutrition(false)
    }
  }

  const saveServing = async (data: ServingFormData) => {
    const result = await updateServing(uuid, {
      serving_info: data.servingInfo,
      storage_info: data.storageInfo,
      serving_portion: data.portionInfo,
      video_url: data.videoLink,
    })
    if (!result) return

    let updatedImages = product.serving?.images

    const changedPhotos = data.servingPhotos
      .map((file, index) => ({ index, file }))
      .filter((c): c is { index: number; file: File } => c.file instanceof File)
    if (changedPhotos.length > 0) {
      const imagesResult = await updateServingImages(uuid, changedPhotos)
      if (imagesResult) updatedImages = imagesResult.images
    }

    toast.success("Saran penyajian diperbarui")
    setProduct((prev: any) => ({
      ...prev,
      serving: { ...prev.serving, ...result, images: updatedImages },
    }))
    setIsEditingServing(false)
  }

  const saveLegality = async (data: LegalityFormData) => {
    const findCert = (type: CertificateType) => product.certificates?.find((c: any) => c.type === type)

    const tasks: { type: CertificateType; existing: any; payload: { number?: string; registered_at?: Date; valid_until?: Date; lab_name?: string }; shouldSave: boolean }[] = [
      {
        type: "bpom",
        existing: findCert("bpom"),
        payload: {
          number: data.bpomNumber,
          registered_at: data.bpomRegistrationDate ? new Date(data.bpomRegistrationDate) : undefined,
          valid_until: data.bpomValidUntil ? new Date(data.bpomValidUntil) : undefined,
        },
        shouldSave: data.hasBpom,
      },
      {
        type: "pirt",
        existing: findCert("pirt"),
        payload: {
          number: data.pirtNumber,
          registered_at: data.pirtRegistrationDate ? new Date(data.pirtRegistrationDate) : undefined,
          valid_until: data.pirtValidUntil ? new Date(data.pirtValidUntil) : undefined,
        },
        shouldSave: data.hasPirt,
      },
      {
        type: "halal",
        existing: findCert("halal"),
        payload: {
          number: data.halalCertificateNumber,
          lab_name: data.halalCertifiedBy,
          registered_at: data.halalIssuanceDate ? new Date(data.halalIssuanceDate) : undefined,
          valid_until: data.halalValidUntil ? new Date(data.halalValidUntil) : undefined,
        },
        shouldSave: data.hasHalal,
      },
      {
        type: "coa",
        existing: findCert("coa"),
        payload: {
          number: data.coaNumber,
          lab_name: data.coaLaboratoryName,
          registered_at: data.coaTestDate ? new Date(data.coaTestDate) : undefined,
        },
        shouldSave: data.hasCoa,
      },
    ]

    const updatedCertificates = [...(product.certificates ?? [])]
    let addedCount = 0

    for (const task of tasks) {
      if (!task.shouldSave || task.existing) continue
      const result = await createCertificate(uuid, { type: task.type, ...task.payload })
      if (result) {
        updatedCertificates.push(result)
        addedCount++
      }
    }

    setProduct((prev: any) => ({ ...prev, certificates: updatedCertificates }))
    setIsEditingLegality(false)
    toast.success(addedCount > 0 ? `${addedCount} sertifikat baru ditambahkan` : "Sertifikat diperbarui")
  }

  if (isFetching) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">Memuat data produk...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">Produk tidak ditemukan</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-2 flex items-center justify-between bg-gray-50 px-4 pb-2 pt-5 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-sm font-semibold text-blue-600">Detail Produk</h1>
          <p className="mt-1 text-xs text-gray-500">{product.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/dashboard/products")}
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Kembali ke List Produk
          </button>
          {product.qr_code_url && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowQrModal(true)}
              className="gap-2 text-sm font-semibold text-blue-600"
            >
              <QrCode className="h-4 w-4" />
              Lihat QR
            </Button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-50 px-4 pb-4 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center">
            {STEPS.map((step, index) => {
              const isActive = currentStep === step.id
              const isLast = index === STEPS.length - 1

              return (
                <div key={step.id} className="flex min-w-0 flex-1 items-center">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(step.id)}
                    className="flex shrink-0 items-center gap-2 transition-all"
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                        isActive ? "bg-blue-600 text-white" : "bg-green-500 text-white"
                      }`}
                    >
                      {isActive ? (
                        step.id
                      ) : (
                        <svg
                          className="h-3.5 w-3.5"
                          viewBox="0 0 14 14"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="2,7 5.5,10.5 12,3.5" />
                        </svg>
                      )}
                    </span>
                    <span
                      className={`whitespace-nowrap text-sm transition-colors ${
                        isActive ? "font-semibold text-blue-600" : "font-medium text-green-600"
                      }`}
                    >
                      {step.label}
                    </span>
                  </button>
                  {!isLast && <div className="mx-3 h-px flex-1 bg-green-400" />}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="w-full px-4 pb-12 sm:px-6 lg:px-8">
        {currentStep === 1 && (
          <div>
            <div className="mb-3 flex items-center justify-end">
              {isEditingBasic ? (
                <EditActions
                  onCancel={() => {
                    setIsEditingBasic(false)
                    setBasicEditSession((s) => s + 1)
                  }}
                  formId="product-basic-form"
                  loading={loading}
                />
              ) : (
                <EditTrigger onClick={() => setIsEditingBasic(true)} />
              )}
            </div>
            <ProductInfoForm
              key={`product-${product.updated_at}-${basicEditSession}`}
              formId="product-basic-form"
              initialData={productFormData}
              disabled={!isEditingBasic}
              showFooter={false}
              isLoading={loading}
              onSubmit={saveBasic}
            />
            <p className="mt-2 text-xs text-gray-400">
              Kode Lisensi: <span className="font-semibold text-gray-600">{product.license_code}</span>
            </p>
          </div>
        )}

        {currentStep === 2 && product.nutrition_info && (
          <div>
            <div className="mb-3 flex items-center justify-end">
              {isEditingNutrition ? (
                <EditActions
                  onCancel={() => {
                    setIsEditingNutrition(false)
                    setNutritionEditSession((s) => s + 1)
                  }}
                  formId="product-nutrition-form"
                  loading={loading}
                />
              ) : (
                <EditTrigger onClick={() => setIsEditingNutrition(true)} />
              )}
            </div>
            <NutritionForm
              key={`nutrition-${product.nutrition_info.updated_at}-${nutritionEditSession}`}
              formId="product-nutrition-form"
              initialData={nutritionFormData}
              disabled={!isEditingNutrition}
              showFooter={false}
              isLoading={loading}
              onSubmit={saveNutrition}
            />
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <div className="mb-3 flex items-center justify-end">
              {isEditingLegality ? (
                <EditActions
                  onCancel={() => {
                    setIsEditingLegality(false)
                    setLegalityEditSession((s) => s + 1)
                  }}
                  formId="product-legality-form"
                  loading={loading}
                />
              ) : (
                <EditTrigger onClick={() => setIsEditingLegality(true)} />
              )}
            </div>
            <LegalityForm
              key={`legality-${legalityEditSession}`}
              formId="product-legality-form"
              initialData={legalityFormData}
              lockedTypes={(product.certificates ?? []).map((c: any) => c.type)}
              disabled={!isEditingLegality}
              showFooter={false}
              isLoading={loading}
              onSubmit={saveLegality}
            />
          </div>
        )}

        {currentStep === 4 && product.serving && (
          <div>
            <div className="mb-3 flex items-center justify-end">
              {isEditingServing ? (
                <EditActions
                  onCancel={() => {
                    setIsEditingServing(false)
                    setServingEditSession((s) => s + 1)
                  }}
                  formId="product-serving-form"
                  loading={loading}
                />
              ) : (
                <EditTrigger onClick={() => setIsEditingServing(true)} />
              )}
            </div>
            <ServingForm
              key={`serving-${product.serving.updated_at}-${servingEditSession}`}
              formId="product-serving-form"
              initialData={servingFormData}
              disabled={!isEditingServing}
              showFooter={false}
              isLoading={loading}
              onSubmit={saveServing}
            />
          </div>
        )}

        {currentStep === 5 && (
          <Rekap
            productData={productFormData as ProductFormData}
            nutritionData={nutritionFormData as NutritionFormData}
            legalityData={legalityFormData}
            servingData={servingFormData as ServingFormData}
            onEdit={setCurrentStep}
            showSubmit={false}
          />
        )}
      </div>

      <QrCodeModal
        open={showQrModal}
        onOpenChange={setShowQrModal}
        productName={product.name}
        qrCodeUrl={product.qr_code_url}
      />
    </div>
  )
}
