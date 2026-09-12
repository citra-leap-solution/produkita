"use client"

import { useState } from "react"
import { ProductStats, ProductToolbar, ProductTable } from "./partials"

export function ProductListPage() {
  const [search, setSearch] = useState("")
  const [totalProducts, setTotalProducts] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50/50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">List Produk</h1>
        {/* <ProductStats totalProducts={totalProducts} /> */}
        <ProductToolbar search={search} onSearch={setSearch} />
        <ProductTable search={search} onTotalChange={setTotalProducts} />
      </div>
    </div>
  )
}