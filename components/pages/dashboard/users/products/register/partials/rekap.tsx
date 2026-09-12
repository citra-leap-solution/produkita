"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Package,
  Leaf,
  Shield,
  Info,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { ProductFormData } from "./product-form";
import { NutritionFormData } from "./nutritions-form";
import { LegalityFormData } from "./legality-form";
import { ServingFormData } from "./serving-form";
import { CATEGORY_OPTIONS } from "@/lib/utils";

interface RekapProps {
  productData?: ProductFormData;
  nutritionData?: NutritionFormData;
  legalityData?: LegalityFormData;
  servingData?: ServingFormData;
  onSubmit?: () => void;
  onEdit?: (step: number) => void;
  isLoading?: boolean;
  showSubmit?: boolean;
}

interface SelectedCertData {
  title: string;
  description: string;
  numberLabel: string;
  number: string | undefined;
  registrationDate?: string;
  validUntil?: string;
  imageUrl?: string;
  fileName?: string;
  colorClass: string;
  shortLabel: string;
  themeColor: string;
  icon: React.ReactNode;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return "-";
  try {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

interface SectionRowProps {
  leftLabel: string;
  leftValue: string | undefined;
  rightLabel: string;
  rightValue: string | undefined;
}

function SectionRow({ leftLabel, leftValue, rightLabel, rightValue }: SectionRowProps) {
  return (
    <div className="grid grid-cols-2 border-b border-gray-100 last:border-0">
      <div className="flex justify-between px-4 py-2.5 sm:border-r sm:border-gray-100">
        <span className="text-xs font-medium text-gray-500">{leftLabel}</span>
        <span className="text-xs font-semibold text-gray-900">{leftValue || "-"}</span>
      </div>
      <div className="flex justify-between px-4 py-2.5">
        <span className="text-xs font-medium text-gray-500">{rightLabel}</span>
        <span className="text-xs font-semibold text-gray-900">{rightValue || "-"}</span>
      </div>
    </div>
  );
}

function FullRow({ label, value }: { label: string; value: string | undefined }) {
  return (
    <div className="flex flex-col gap-1 border-b border-gray-100 px-4 py-3 last:border-0 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <span className="shrink-0 text-xs font-medium text-gray-500">{label}</span>
      <span className="whitespace-pre-line text-xs font-semibold text-gray-900 sm:text-right">
        {value || "-"}
      </span>
    </div>
  );
}

function RecapSection({ title, icon, borderColor, headerBg, children }: any) {
  return (
    <div className={`overflow-hidden rounded-xl border ${borderColor} bg-white`}>
      <div className={`flex items-center justify-between border-b ${borderColor} ${headerBg} px-5 py-3`}>
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 shrink-0">{icon}</div>
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
        </div>
      </div>
      <div className="divide-y divide-gray-100">{children}</div>
    </div>
  );
}

function CertBadge({ label, number, colorClass, onView }: any) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 last:border-0">
      <div className="flex items-center gap-3">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white ${colorClass}`}>
          <CheckCircle2 className="h-3.5 w-3.5" />
          {label}
        </span>
        <span className="text-xs text-gray-500">No. {number || "-"}</span>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="bg-white px-4 py-1 text-xs font-semibold"
        onClick={onView}
      >
        Lihat
      </Button>
    </div>
  );
}

export function Rekap({
  productData,
  nutritionData,
  legalityData,
  servingData,
  onSubmit,
  onEdit,
  isLoading = false,
  showSubmit = true,
}: RekapProps) {
  const hasAllData = productData && nutritionData && legalityData && servingData;
  const [selectedCert, setSelectedCert] = useState<SelectedCertData | null>(null);

  const getJenisLabel = (id: string) => {
    return CATEGORY_OPTIONS.find((opt) => opt.id === id)?.label ?? id
  }

  return (
    <div className="space-y-4">
      {showSubmit && (hasAllData ? (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 shrink-0 text-blue-600" />
            <p className="text-sm font-medium text-blue-900">
              Semua data telah terisi. Periksa kembali sebelum mendaftarkan produk.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
          <div className="flex gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600" />
            <div>
              <p className="text-sm font-semibold text-yellow-900">Data Belum Lengkap</p>
              <p className="mt-0.5 text-xs text-yellow-800">
                Harap lengkapi semua informasi di setiap tahap pendaftaran.
              </p>
            </div>
          </div>
        </div>
      ))}

      {productData && (
        <RecapSection
          title="Informasi Produk"
          icon={<Package className="h-6 w-6 text-blue-600" />}
          borderColor="border-blue-200"
          headerBg="bg-blue-50"
        >
          <SectionRow
            leftLabel="Nama Produk"
            leftValue={productData.productName}
            rightLabel="Nama Brand"
            rightValue={productData.brandName}
          />
          <SectionRow
            leftLabel="Harga"
            leftValue={
              productData.price
                ? `Rp ${parseInt(productData.price).toLocaleString("id-ID")}`
                : "-"
            }
            rightLabel="Berat/Volume"
            rightValue={
              productData.weight ? `${productData.weight} ${productData.unit}` : "-"
            }
          />
          <SectionRow
            leftLabel="Jenis"
            leftValue={productData.jenis ? getJenisLabel(productData.jenis) : "-"}
            rightLabel="Deskripsi Produk"
            rightValue={productData.deskripsi}
          />
          <div className="flex items-center justify-between px-4 py-2.5">
            <span className="text-xs font-medium text-gray-500">Foto Produk</span>
            {productData.productPhotoPreview?.length ? (
              <div className="flex gap-1.5">
                {productData.productPhotoPreview.map((src, idx) => (
                  <Image
                    key={idx}
                    src={src}
                    alt={`Foto produk ${idx + 1}`}
                    className="h-9 w-9 rounded-md border border-gray-200 object-cover"
                    width={80}
                    height={80}
                  />
                ))}
              </div>
            ) : (
              <span className="text-xs font-semibold text-gray-900">-</span>
            )}
          </div>
        </RecapSection>
      )}

      {nutritionData && (
        <RecapSection
          title="Informasi Nutrisi & Gizi"
          icon={<Leaf className="h-6 w-6 text-green-600" />}
          borderColor="border-green-200"
          headerBg="bg-green-50"
        >
          <SectionRow
            leftLabel="Takaran Saji"
            leftValue={nutritionData.servingSize}
            rightLabel="Sajian Perkemasan"
            rightValue={nutritionData.servingsPerPackage}
          />
          <SectionRow
            leftLabel="Energi Total"
            leftValue={nutritionData.calories ? `${nutritionData.calories} kkal` : undefined}
            rightLabel="Lemak Jenuh"
            rightValue={nutritionData.saturatedFat ? `${nutritionData.saturatedFat} g` : undefined}
          />
          <SectionRow
            leftLabel="Karbohidrat Total"
            leftValue={nutritionData.carbohydrates ? `${nutritionData.carbohydrates} g` : undefined}
            rightLabel="Protein"
            rightValue={nutritionData.protein ? `${nutritionData.protein} g` : undefined}
          />
          <SectionRow
            leftLabel="Gula"
            leftValue={nutritionData.sugar ? `${nutritionData.sugar} g` : undefined}
            rightLabel="Natrium (Garam)"
            rightValue={nutritionData.sodium ? `${nutritionData.sodium} mg` : undefined}
          />
          <SectionRow
            leftLabel="Komposisi"
            leftValue={nutritionData.composition}
            rightLabel="Informasi Alergen"
            rightValue={
              nutritionData.allergens?.length ? nutritionData.allergens.join(", ") : "-"
            }
          />
        </RecapSection>
      )}

      {legalityData && (
        <RecapSection
          title="Informasi Sertifikat"
          icon={<Shield className="h-6 w-6 text-purple-600" />}
          borderColor="border-purple-200"
          headerBg="bg-purple-50"
        >
          {legalityData.hasBpom && (
            <CertBadge
              label="BPOM"
              number={legalityData.bpomNumber}
              colorClass="bg-blue-600"
              onView={() =>
                setSelectedCert({
                  title: "BPOM (Badan Pengawas Obat dan Makanan)",
                  description: "Produk memiliki izin edar BPOM.",
                  numberLabel: "Nomor BPOM",
                  number: legalityData.bpomNumber,
                  registrationDate: formatDate(legalityData.bpomRegistrationDate),
                  validUntil: formatDate(legalityData.bpomValidUntil),
                  imageUrl: legalityData.bpomFilePreview,
                  fileName: legalityData.bpomFileName,
                  colorClass: "bg-blue-600",
                  shortLabel: "BPOM",
                  themeColor: "border-blue-500",
                  icon: <Shield className="h-6 w-6 text-blue-600" />,
                })
              }
            />
          )}
          {legalityData.hasPirt && (
            <CertBadge
              label="PIRT"
              number={legalityData.pirtNumber}
              colorClass="bg-purple-400"
              onView={() =>
                setSelectedCert({
                  title: "PIRT (Pangan Industri Rumah Tangga)",
                  description: "Produk memiliki izin PIRT.",
                  numberLabel: "Nomor PIRT",
                  number: legalityData.pirtNumber,
                  registrationDate: formatDate(legalityData.pirtRegistrationDate),
                  validUntil: formatDate(legalityData.pirtValidUntil),
                  imageUrl: legalityData.pirtFilePreview,
                  fileName: legalityData.pirtFileName,
                  colorClass: "bg-purple-400",
                  shortLabel: "PIRT",
                  themeColor: "border-purple-400",
                  icon: <Package className="h-6 w-6 text-purple-400" />,
                })
              }
            />
          )}
          {legalityData.hasHalal && (
            <CertBadge
              label="Halal MUI"
              number={legalityData.halalCertificateNumber}
              colorClass="bg-green-600"
              onView={() =>
                setSelectedCert({
                  title: "Halal (Sertifikasi Halal MUI)",
                  description: "Produk memiliki sertifikat halal.",
                  numberLabel: "Nomor Halal",
                  number: legalityData.halalCertificateNumber,
                  registrationDate: formatDate(legalityData.halalIssuanceDate),
                  validUntil: formatDate(legalityData.halalValidUntil),
                  imageUrl: legalityData.halalFilePreview,
                  fileName: legalityData.halalFileName,
                  colorClass: "bg-green-600",
                  shortLabel: "Halal MUI",
                  themeColor: "border-green-500",
                  icon: (
                    <div className="flex h-full w-full items-center justify-center rounded-full border-2 border-green-600">
                      <span className="text-[10px] font-bold text-green-600">HALAL</span>
                    </div>
                  ),
                })
              }
            />
          )}
          {legalityData.hasCoa && (
            <CertBadge
              label="COA"
              number={legalityData.coaNumber}
              colorClass="bg-amber-600"
              onView={() =>
                setSelectedCert({
                  title: "COA (Certificate of Analysis)",
                  description: "Produk memiliki sertifikat hasil uji laboratorium.",
                  numberLabel: "Nomor COA",
                  number: legalityData.coaNumber,
                  registrationDate: formatDate(legalityData.coaTestDate),
                  validUntil: "-",
                  imageUrl: legalityData.coaFilePreview,
                  fileName: legalityData.coaFileName,
                  colorClass: "bg-amber-600",
                  shortLabel: "COA",
                  themeColor: "border-amber-500",
                  icon: <Shield className="h-6 w-6 text-amber-600" />,
                })
              }
            />
          )}
          {!legalityData.hasBpom && !legalityData.hasPirt && !legalityData.hasHalal && !legalityData.hasCoa && (
            <div className="px-4 py-3 text-sm text-gray-600">
              Tidak ada sertifikat yang diinput.
            </div>
          )}
        </RecapSection>
      )}

      {servingData && (
        <RecapSection
          title="Saran Penyajian"
          icon={<Package className="h-6 w-6 text-blue-600" />}
          borderColor="border-blue-200"
          headerBg="bg-blue-50"
        >
          <FullRow label="Informasi Penyajian" value={servingData.servingInfo} />
          <FullRow label="Informasi Penyimpanan" value={servingData.storageInfo} />
          <FullRow label="Informasi Porsi" value={servingData.portionInfo} />
          <FullRow label="Link Video Penyajian" value={servingData.videoLink} />
          <div className="flex flex-col gap-1 border-b border-gray-100 px-4 py-3 last:border-0 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <span className="shrink-0 text-xs font-medium text-gray-500">Foto Penyajian</span>
            {servingData.servingPhotoPreviews?.length ? (
              <div className="flex flex-wrap justify-end gap-1.5">
                {servingData.servingPhotoPreviews.map((src, idx) => (
                  <Image
                    key={idx}
                    src={src}
                    alt={`Foto penyajian ${idx + 1}`}
                    className="h-9 w-9 rounded-md border border-gray-200 object-cover"
                    width={80}
                    height={80}
                  />
                ))}
              </div>
            ) : (
              <span className="text-xs font-semibold text-gray-900">-</span>
            )}
          </div>
        </RecapSection>
      )}

      {showSubmit && (
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1 py-6 text-sm font-semibold"
            onClick={() => onEdit?.(4)}
          >
            ← Sebelumnya
          </Button>
          <Button
            type="button"
            disabled={!hasAllData || isLoading}
            className="flex-1 bg-blue-600 py-6 text-base font-semibold hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={onSubmit}
          >
            {isLoading ? "Memproses..." : "Daftarkan Produk →"}
          </Button>
        </div>
      )}

      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl md:flex-row">
            <div className="relative flex h-64 w-full flex-col bg-gray-900 md:h-112.5 md:w-[45%]">
              {selectedCert.imageUrl?.startsWith("data:application/pdf") ? (
                <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
                  <span className="text-sm font-medium text-gray-300">File PDF Terlampir</span>
                </div>
              ) : selectedCert.imageUrl ? (
                <Image
                  src={selectedCert.imageUrl}
                  alt={selectedCert.fileName || "Sertifikat"}
                  fill
                  className="object-cover opacity-75"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
                  <span className="text-sm font-medium text-gray-400">Pratinjau tidak tersedia</span>
                </div>
              )}
              <div className="absolute bottom-5 left-5 z-10 flex flex-col items-start gap-1.5">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm ${selectedCert.colorClass}`}>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {selectedCert.shortLabel}
                </span>
                {selectedCert.fileName && (
                  <span className="text-xs font-medium text-white/90 drop-shadow-md">
                    {selectedCert.fileName}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-between p-8">
              <div>
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gray-100 bg-white p-2 shadow-sm">
                    {selectedCert.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{selectedCert.title}</h3>
                    <p className="text-sm text-gray-500">{selectedCert.description}</p>
                  </div>
                </div>
                <div className={`border-t-2 ${selectedCert.themeColor} w-full pt-6`}>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                      <span className="text-sm font-medium text-gray-500">{selectedCert.numberLabel}</span>
                      <span className="text-sm font-bold text-gray-900">{selectedCert.number || "-"}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                      <span className="text-sm font-medium text-gray-500">Tanggal Registrasi</span>
                      <span className="text-sm font-bold text-gray-900">{selectedCert.registrationDate}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                      <span className="text-sm font-medium text-gray-500">Berlaku Hingga</span>
                      <span className="text-sm font-bold text-gray-900">{selectedCert.validUntil}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-lg px-8 font-semibold shadow-sm"
                  onClick={() => setSelectedCert(null)}
                >
                  Tutup
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}