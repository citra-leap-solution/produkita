"use client"

import { useState } from "react"
import { SuperAdminDashboardPage } from "@/components/pages/super-admin/partials/dashboard-page"
import { UserManagement } from "@/components/pages/super-admin/user-management"
import { PackagePermission } from "@/components/pages/super-admin/packages"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  Package,
  ChevronDown,
  LogOut as LogOutIcon,
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Logo } from "@/components/ui/logo"

const menuItems = [
  { id: "dashboard", label: "Overview", icon: LayoutDashboard },
  { id: "users", label: "List User", icon: Users },
  { id: "packages", label: "Permission", icon: Package },
]

export function SuperAdminPage() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const { logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    toast.success("Berhasil keluar", { description: "Sampai jumpa kembali." })
    router.push("/login")
  }

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <SuperAdminDashboardPage />
      case "users":
        return <UserManagement />
      case "packages":
        return <PackagePermission />
      default:
        return <SuperAdminDashboardPage />
    }
  }

  return (
    <>
      <aside className="w-[309px] bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="border-b border-slate-200 px-8 py-6 flex items-center h-[87px]">
          <Logo />
        </div>

        <nav className="flex-1 p-7 space-y-2.5">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = activeSection === item.id
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`w-full justify-start gap-3 h-[42.5px] px-3 rounded-xl ${
                  active
                    ? "bg-violet-50 text-violet-600 hover:bg-violet-50"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
                onClick={() => setActiveSection(item.id)}
              >
                <Icon className="h-[17px] w-[17px]" />
                <span className="text-sm font-medium">{item.label}</span>
              </Button>
            )
          })}
        </nav>

        <div className="p-6">
          <div className="bg-violet-600 rounded-[10px] flex items-center justify-center">
            <Button
              variant="ghost"
              className="w-full h-[35.5px] text-white hover:bg-transparent hover:text-white gap-2"
              onClick={handleLogout}
            >
              <LogOutIcon className="h-3.5 w-3.5" />
              <span className="text-[13px] font-medium">Keluar</span>
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 px-8 py-0 h-[86px] flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-900">
            {menuItems.find((item) => item.id === activeSection)?.label || "Overview"}
          </h1>

          <div className="flex items-center gap-4">
            <span className="text-base font-semibold text-violet-500">
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <div className="h-6 w-px bg-slate-200" />
            <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg">
              <div className="w-5 h-5 rounded-full overflow-hidden flex flex-col shrink-0">
                <div className="h-1/2 bg-red-600" />
                <div className="h-1/2 bg-white border border-slate-100" />
              </div>
              <span className="text-sm font-bold text-slate-900">ID</span>
              <ChevronDown className="h-4 w-4 text-slate-700" />
            </button>
            <div className="h-6 w-px bg-slate-200" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                SA
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Super Admin</p>
                <p className="text-xs text-slate-400">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-auto">{renderContent()}</main>
      </div>
    </>
  )
}
