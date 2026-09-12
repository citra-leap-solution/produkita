"use client"

import { DashboardHeader, DashboardSidebar } from "@/components/navigations"
import { AdminPage } from "@/components/pages/dashboard/admin"
import { useAuth } from "@/hooks/useAuth"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin, isUser, sessionReady } = useAuth()

  if (!sessionReady) {
    return <div className="h-screen bg-slate-50" />
  }

  if (isAdmin) {
    return (
      <div className="flex h-screen bg-slate-50">
        <AdminPage />
      </div>
    )
  }

  if (!isUser) return null

  return (
    <div className="flex h-screen bg-slate-50">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
