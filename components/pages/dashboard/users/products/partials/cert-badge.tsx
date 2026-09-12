"use client"

import { ICertBadge } from "../types/product.i"

export function CertBadge({ type, active = true }: ICertBadge) {
  const styles = {
    BPOM: active
      ? "bg-blue-50 text-blue-600 font-medium"
      : "border border-gray-200 bg-white text-gray-400",
    HALAL: active
      ? "bg-green-50 text-green-600 font-medium"
      : "border border-gray-200 bg-white text-gray-400",
    PIRT: active
      ? "bg-purple-50 text-purple-600 font-medium"
      : "border border-gray-200 bg-white text-gray-400",
    COA: active
      ? "bg-yellow-50 text-yellow-600 font-medium"
      : "border border-gray-200 bg-white text-gray-400",
  }

  return (
    <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-[11px] ${styles[type]}`}>
      {type}
    </span>
  )
}