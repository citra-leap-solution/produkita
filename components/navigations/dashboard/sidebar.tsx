"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Package,
  TrendingUp,
  Calculator,
  Info,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { usePermission } from "@/hooks/usePermission";
import type { AdminPermissionFeatureKey } from "@/lib/admin/api";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/logo";

const menuItems: {
  title: string;
  href: string;
  icon: React.ElementType;
  featureKey?: AdminPermissionFeatureKey;
}[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Produk UMKM",
    href: "/dashboard/products",
    icon: Package,
    featureKey: "max_products",
  },
  {
    title: "Manajemen Keuangan",
    href: "/dashboard/financials",
    icon: TrendingUp,
    featureKey: "finance_access",
  },
  {
    title: "Kalkulator HPP",
    href: "/dashboard/calculators",
    icon: Calculator,
    featureKey: "hpp_calculations_monthly",
  },
  {
    title: "Informasi UMKM",
    href: "/dashboard/umkm",
    icon: Info,
  },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const { getMyPermissions } = usePermission();
  const [isOpen, setIsOpen] = useState(true);
  const [allowedFeatures, setAllowedFeatures] =
    useState<Set<AdminPermissionFeatureKey> | null>(null);

  useEffect(() => {
    let active = true;
    void getMyPermissions().then((result) => {
      if (!active || !result) return;
      setAllowedFeatures(
        new Set(
          result.permissions
            .filter((permission) => permission.is_access)
            .map((permission) => permission.feature_key),
        ),
      );
    });
    return () => {
      active = false;
    };
  }, [getMyPermissions]);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Berhasil keluar", { description: "Sampai jumpa kembali." });
    router.push("/login");
  };

  return (
    <aside
      className={`bg-white border-r border-slate-200 min-h-screen flex flex-col transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Logo */}
      <div className="border-b border-slate-200 px-6 py-4 flex items-center h-15 overflow-hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 hover:opacity-75 transition-opacity"
          title={isOpen ? "Tutup sidebar" : "Buka sidebar"}
        >
          {isOpen && <Logo />}
        </button>
      </div>

      {/* Nav */}
      <nav className={`flex-1 space-y-1 ${isOpen ? "px-4 py-6" : "px-2 py-6"}`}>
        {menuItems
          .filter(
            (item) => !item.featureKey || allowedFeatures?.has(item.featureKey),
          )
          .map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link key={item.title} href={item.href}>
                <button
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                    active
                      ? "bg-blue-50 font-medium text-blue-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                  title={!isOpen ? item.title : ""}
                >
                  <Icon size={20} className="shrink-0" />
                  {isOpen && <span className="text-sm">{item.title}</span>}
                </button>
              </Link>
            );
          })}
      </nav>

      {/* Logout */}
      <div className="border-t border-slate-200 p-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
          title={!isOpen ? "Keluar" : ""}
        >
          <LogOut size={20} className="shrink-0" />
          {isOpen && <span className="text-sm">Keluar</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
