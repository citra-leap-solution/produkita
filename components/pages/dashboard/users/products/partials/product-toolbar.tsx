"use client"

import { Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { IProductToolbar } from "../types/product.i"

export function ProductToolbar({ search, onSearch }: IProductToolbar) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="relative w-full max-w-md">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Cari Produk"
          className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <Link href="/dashboard/products/register">
        <Button className="w-full bg-blue-600 hover:bg-blue-700 sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Tambah Produk
        </Button>
      </Link>
    </div>
  )
}