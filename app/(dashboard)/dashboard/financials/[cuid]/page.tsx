import { TransactionForm } from "@/components/pages/dashboard/users/financials/partials/transaction-form"
import { getAuthCookie } from "@/lib/auth/token"
import { getFinanceApi } from "@/lib/finance/api"
import { redirect } from "next/navigation"

interface PageProps {
  params: Promise<{ cuid: string }>
}

export default async function TransactionPage({ params }: PageProps) {
  const { cuid } = await params

  const token = await getAuthCookie()
  if (!token) redirect("/auth/login")

  let initialData = null

  if (cuid !== "records") {
    const res = await getFinanceApi(token, cuid)
    if (!res.success || !res.data) redirect("/dashboard/financials")
    initialData = res.data
  }

  return (
    <div className="p-6">
      <TransactionForm initialData={initialData} />
    </div>
  )
}
