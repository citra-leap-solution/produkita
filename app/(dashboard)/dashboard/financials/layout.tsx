import { requireFeatureAccess } from "@/lib/permission/guard";

export default async function FinancialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireFeatureAccess("finance_access");
  return children;
}
