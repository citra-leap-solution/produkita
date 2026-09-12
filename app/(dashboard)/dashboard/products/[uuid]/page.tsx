import { Metadata } from "next";
import { ProductDetailPage } from "@/components/pages/dashboard/users/products/detail";

export const metadata: Metadata = {
  title: "Detail Produk | Dashboard",
  description: "Detail produk UMKM",
};

export default async function Page({ params }: { params: Promise<{ uuid: string }> }) {
  const { uuid } = await params;
  return <ProductDetailPage uuid={uuid} />;
}
