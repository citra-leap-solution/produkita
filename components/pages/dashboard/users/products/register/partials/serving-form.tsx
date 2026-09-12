"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Camera } from "lucide-react";

export interface ServingFormData {
  servingInfo: string;
  storageInfo: string;
  portionInfo: string;
  videoLink: string;
  servingPhotos: File[];
  servingPhotoPreviews: string[];
}

interface ServingFormProps {
  onSubmit?: (data: ServingFormData) => void;
  onPrevious?: () => void;
  initialData?: Partial<ServingFormData>;
  isLoading?: boolean;
  disabled?: boolean;
  formId?: string;
  showFooter?: boolean;
}

const initialServingData: ServingFormData = {
  servingInfo: "",
  storageInfo: "",
  portionInfo: "",
  videoLink: "",
  servingPhotos: [],
  servingPhotoPreviews: [],
};

const maxphoto = 5;

export function ServingForm({
  onSubmit,
  onPrevious,
  initialData,
  isLoading = false,
  disabled = false,
  formId,
  showFooter = true,
}: ServingFormProps) {
  const [formData, setFormData] = useState<ServingFormData>({
    ...initialServingData,
    ...initialData,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState(false);

  const mainUploadRef = useRef<HTMLInputElement>(null);
  const addUploadRef = useRef<HTMLInputElement>(null);
  const replaceUploadRef = useRef<HTMLInputElement>(null);
  const [replaceSlotIndex, setReplaceSlotIndex] = useState<number | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (disabled) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.servingInfo.trim())
      newErrors.servingInfo = "Informasi penyajian wajib diisi";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && onSubmit) onSubmit(formData);
  };

  const addPhotos = async (files: FileList | null) => {
    if (disabled || !files) return;

    const filledSlots = formData.servingPhotoPreviews.filter(Boolean).length;
    const remaining = maxphoto - filledSlots;
    if (remaining <= 0) return;

    const selectedFiles = Array.from(files).slice(0, remaining);
    const validFiles: File[] = [];
    let hasError = false;

    selectedFiles.forEach((f) => {
      if (
        f.size > 2 * 1024 * 1024 ||
        !["image/jpeg", "image/png", "image/webp"].includes(f.type)
      ) {
        hasError = true;
      } else {
        validFiles.push(f);
      }
    });

    if (hasError) {
      alert(
        "Beberapa foto gagal diupload. Pastikan formatnya JPG/PNG/WEBP dan ukuran maksimal 2MB.",
      );
    }

    if (validFiles.length === 0) return;

    const newPreviews = await Promise.all(
      validFiles.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          }),
      ),
    );

    setFormData((prev) => {
      const servingPhotos = [...prev.servingPhotos];
      const servingPhotoPreviews = [...prev.servingPhotoPreviews];
      let cursor = 0;
      validFiles.forEach((f, i) => {
        while (servingPhotoPreviews[cursor]) cursor++;
        servingPhotos[cursor] = f;
        servingPhotoPreviews[cursor] = newPreviews[i];
        cursor++;
      });
      return { ...prev, servingPhotos, servingPhotoPreviews };
    });
  };

  const handleMainUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    addPhotos(e.target.files);
    e.target.value = "";
  };

  const handleAddUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    addPhotos(e.target.files);
    e.target.value = "";
  };

  const openReplacePhoto = (index: number) => {
    if (disabled) return;
    setReplaceSlotIndex(index);
    replaceUploadRef.current?.click();
  };

  const handleReplaceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (disabled || !file || replaceSlotIndex === null) return;
    if (file.size > 2 * 1024 * 1024) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const index = replaceSlotIndex;
      setFormData((prev) => {
        const servingPhotos = [...prev.servingPhotos];
        const servingPhotoPreviews = [...prev.servingPhotoPreviews];
        servingPhotos[index] = file;
        servingPhotoPreviews[index] = reader.result as string;
        return { ...prev, servingPhotos, servingPhotoPreviews };
      });
      setReplaceSlotIndex(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addPhotos(e.dataTransfer.files);
  };

  const textareaCls = (field?: string) =>
    `w-full resize-none rounded-lg border px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 ${
      field && errors[field]
        ? "border-red-400 bg-red-50"
        : "border-gray-200 bg-white"
    }`;

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <div className="rounded-xl border border-gray-200 bg-white p-8">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-800">
                Informasi Penyajian <span className="text-red-500">*</span>
              </label>
              <textarea
                name="servingInfo"
                value={formData.servingInfo}
                onChange={handleChange}
                disabled={disabled}
                rows={5}
                placeholder={
                  "Contoh:\nSajikan dalam keadaan segar sebagai camilan atau pelengkap makanan utama.\n" +
                  "• Simpan di tempat sejuk dan kering sebelum dibuka.\n" +
                  "• Setelah kemasan dibuka, simpan dalam kulkas agar kualitas produk tetap terjaga.\n" +
                  "• Produk dapat dinikmati langsung atau disajikan bersama nasi hangat, lauk, maupun makanan favorit lainnya"
                }
                className={textareaCls("servingInfo")}
              />
              {errors.servingInfo && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.servingInfo}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-800">
                Informasi Penyimpanan{" "}
                <span className="font-normal text-gray-400">(Opsional)</span>
              </label>
              <textarea
                name="storageInfo"
                value={formData.storageInfo}
                onChange={handleChange}
                disabled={disabled}
                rows={5}
                placeholder="Contoh: Simpan pada suhu ruang yang sejuk dan terhindar dari sinar matahari langsung. Setelah dibuka, simpan di dalam kulkas pada suhu 4–10°C dan habiskan dalam waktu maksimal 7 hari."
                className={textareaCls()}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-800">
                Informasi Porsi{" "}
                <span className="font-normal text-gray-400">(Opsional)</span>
              </label>
              <textarea
                name="portionInfo"
                value={formData.portionInfo}
                onChange={handleChange}
                disabled={disabled}
                rows={2}
                placeholder="Contoh: 1 kemasan dapat disajikan untuk 2–3 porsi, tergantung kebutuhan dan cara penyajian."
                className={textareaCls()}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-800">
                Link Video{" "}
                <span className="font-normal text-gray-400">(Opsional)</span>
              </label>
              <input
                type="url"
                name="videoLink"
                value={formData.videoLink}
                onChange={handleChange}
                disabled={disabled}
                placeholder="http://youtube......."
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-3 block text-sm font-semibold text-gray-800">
              Foto Penyajian{" "}
              <span className="font-normal text-gray-400">(Opsional)</span>
            </label>

            <div className="grid grid-cols-2 gap-4">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() =>
                  !disabled &&
                  !formData.servingPhotoPreviews[0] &&
                  mainUploadRef.current?.click()
                }
                className={`relative flex min-h-55 w-full flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed bg-gray-50 transition ${
                  disabled ? "cursor-default" : "cursor-pointer"
                } ${
                  isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-400 hover:bg-blue-50"
                }`}
              >
                {formData.servingPhotoPreviews[0] ? (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      openReplacePhoto(0);
                    }}
                    className="group absolute inset-0"
                  >
                    <Image
                      src={formData.servingPhotoPreviews[0]}
                      alt="Foto penyajian utama"
                      fill
                      className="object-cover"
                    />
                    {!disabled && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/40">
                        <Camera size={20} className="text-white opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
                      <svg
                        className="h-5 w-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.8}
                        viewBox="0 0 24 24"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="m21 15-5-5L5 21" />
                      </svg>
                    </div>
                    <p className="text-sm font-bold text-gray-800">
                      Upload Foto Penyajian
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Klik atau seret foto ke sini
                    </p>
                    <p className="mt-0.5 text-xs text-gray-400">
                      PNG, JPG, WEBP &bull; Maks. 2MB
                    </p>
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 grid-rows-2 gap-4">
                {[1, 2, 3, 4].map((slotIdx) => {
                  const preview = formData.servingPhotoPreviews[slotIdx];
                  return (
                    <div
                      key={slotIdx}
                      onClick={() =>
                        !disabled && (preview ? openReplacePhoto(slotIdx) : addUploadRef.current?.click())
                      }
                      className={`group relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 transition hover:border-blue-400 hover:bg-blue-50 ${
                        disabled ? "cursor-default" : "cursor-pointer"
                      }`}
                    >
                      {preview ? (
                        <>
                          <Image
                            src={preview}
                            alt={`Foto penyajian ${slotIdx + 1}`}
                            fill
                            className="object-cover"
                          />
                          {!disabled && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/40">
                              <Camera size={14} className="text-white opacity-0 transition-opacity group-hover:opacity-100" />
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          <svg
                            className="h-5 w-5 text-gray-300"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.5}
                            viewBox="0 0 24 24"
                          >
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <path d="m21 15-5-5L5 21" />
                          </svg>
                          <span className="text-xs text-gray-400">
                            Foto {slotIdx + 1}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <input
              ref={mainUploadRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleMainUpload}
              className="hidden"
            />
            <input
              ref={addUploadRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleAddUpload}
              className="hidden"
            />
            <input
              ref={replaceUploadRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleReplaceUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* ── Footer ── */}
        {showFooter && (
          <div className="mt-8 flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onPrevious}
              className="w-1/3 border-blue-600 py-6 text-sm font-semibold text-blue-600 hover:bg-blue-50"
            >
              &#8592; Sebelumnya
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-2/3 bg-blue-600 py-6 text-sm font-semibold text-white hover:bg-blue-700"
            >
              {isLoading ? "Memproses..." : "Selanjutnya \u2192"}
            </Button>
          </div>
        )}
      </div>
    </form>
  );
}
