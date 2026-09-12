import FinancialsPage from "@/components/pages/dashboard/users/financials"
export const dynamic = "force-dynamic"

export default async function Page({ searchParams }: { searchParams: Promise<{ date?: string }> | { date?: string } }) {
  const resolvedParams = await searchParams
  return <FinancialsPage dateParam={resolvedParams?.date} />
}
