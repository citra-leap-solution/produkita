import { requireFeatureAccess } from "@/lib/permission/guard";

export default async function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireFeatureAccess("max_products");
  return children;
}
