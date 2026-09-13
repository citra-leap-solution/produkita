import { requireFeatureAccess } from "@/lib/permission/guard";

export default async function CalculatorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireFeatureAccess("hpp_calculations_monthly");
  return children;
}
