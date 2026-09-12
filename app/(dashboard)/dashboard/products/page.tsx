import { Metadata } from "next";
import { ProductListPage } from "@/components/pages/dashboard/users/products";

export const metadata: Metadata = {
  title: "List Produk | Dashboard",
  description: "Manajemen daftar produk UMKM",
};

export default function ProductsPage() {
  return <ProductListPage />;
}
