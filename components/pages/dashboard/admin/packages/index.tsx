"use client";

import { useEffect, useState } from "react";
import type { ElementType } from "react";
import { Box, FileText, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { usePermission } from "@/hooks/usePermission";
import type {
  AdminPackagePriceItem,
  AdminPermissionFeatureKey,
  AdminPermissionItem,
  AdminTenantPackage,
} from "@/lib/admin/api";

const PACKAGES: { value: AdminTenantPackage; label: string }[] = [
  { value: "gratis", label: "Gratis" },
  { value: "umkm", label: "UMKM" },
  { value: "bisnis", label: "Bisnis" },
];

const FEATURE_ROWS: {
  label: string;
  icon: ElementType;
  key: AdminPermissionFeatureKey;
}[] = [
  { label: "Manajemen Produk", icon: Box, key: "max_products" },
  { label: "Manajemen Keuangan", icon: TrendingUp, key: "finance_access" },
  { label: "Kalkulator HPP", icon: FileText, key: "hpp_calculations_monthly" },
];

const LIMIT_ROWS: {
  label: string;
  subtitle: string;
  unit: string;
  icon: ElementType;
  key: AdminPermissionFeatureKey;
}[] = [
  {
    label: "Manajemen Produk",
    subtitle: "Jumlah Produk • per produk",
    unit: "Produk",
    icon: Box,
    key: "max_products",
  },
  {
    label: "Manajemen Keuangan",
    subtitle: "Periode Laporan • per bulan",
    unit: "Bulan",
    icon: TrendingUp,
    key: "finance_report_period_months",
  },
  {
    label: "Kalkulator HPP",
    subtitle: "Kalkulasi Perbulan • per kali",
    unit: "Kali",
    icon: FileText,
    key: "hpp_calculations_monthly",
  },
];

const PACKAGE_STYLES: Record<
  AdminTenantPackage,
  {
    badge: string;
    card: string;
    input: string;
    text: string;
  }
> = {
  gratis: {
    badge: "bg-slate-100 text-slate-600",
    card: "border-slate-200",
    input: "border-slate-200 bg-slate-50 text-slate-900",
    text: "text-slate-500",
  },
  umkm: {
    badge: "bg-blue-50 text-blue-600",
    card: "border-blue-200",
    input: "border-blue-200 bg-blue-50 text-blue-700",
    text: "text-blue-600",
  },
  bisnis: {
    badge: "bg-violet-50 text-violet-600",
    card: "border-violet-200",
    input: "border-violet-200 bg-violet-50 text-violet-700",
    text: "text-violet-600",
  },
};

function findPermission(
  permissions: AdminPermissionItem[],
  pkg: AdminTenantPackage,
  key: AdminPermissionFeatureKey,
) {
  return permissions.find(
    (item) => item.package === pkg && item.feature_key === key,
  );
}

function mergePermissions(
  current: AdminPermissionItem[],
  updated: AdminPermissionItem[],
) {
  const updates = new Map(
    updated.map((item) => [`${item.package}:${item.feature_key}`, item]),
  );
  return current.map(
    (item) => updates.get(`${item.package}:${item.feature_key}`) ?? item,
  );
}

function mergePrices(
  current: AdminPackagePriceItem[],
  updated: AdminPackagePriceItem[],
) {
  const updates = new Map(updated.map((item) => [item.package, item]));
  return current.map((item) => updates.get(item.package) ?? item);
}

function numericValue(value: string) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return Math.min(Math.trunc(parsed), Number.MAX_SAFE_INTEGER);
}

export function PackagePermission() {
  const { error, getConfiguration, savePermissions, savePrices } =
    usePermission();
  const [activeTab, setActiveTab] = useState<"feature" | "package">("feature");
  const [permissions, setPermissions] = useState<AdminPermissionItem[]>([]);
  const [prices, setPrices] = useState<AdminPackagePriceItem[]>([]);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState<"feature" | "package" | "price" | null>(
    null,
  );

  useEffect(() => {
    let active = true;
    void getConfiguration().then((configuration) => {
      if (!active) return;
      if (configuration) {
        setPermissions(configuration.permissions);
        setPrices(configuration.prices);
      }
      setReady(true);
    });
    return () => {
      active = false;
    };
  }, [getConfiguration]);

  const updatePermission = (
    pkg: AdminTenantPackage,
    key: AdminPermissionFeatureKey,
    data: Partial<Pick<AdminPermissionItem, "max_value" | "is_access">>,
  ) => {
    setPermissions((current) =>
      current.map((item) =>
        item.package === pkg && item.feature_key === key
          ? { ...item, ...data }
          : item,
      ),
    );
  };

  const updatePrice = (pkg: AdminTenantPackage, monthlyPrice: number) => {
    setPrices((current) =>
      current.map((item) =>
        item.package === pkg ? { ...item, monthly_price: monthlyPrice } : item,
      ),
    );
  };

  const saveFeatureAccess = async () => {
    setSaving("feature");
    const updates = FEATURE_ROWS.flatMap((feature) =>
      PACKAGES.map(({ value: pkg }) => ({
        package: pkg,
        key: feature.key,
        data: {
          is_access:
            findPermission(permissions, pkg, feature.key)?.is_access ?? false,
        },
      })),
    );
    const result = await savePermissions(updates);
    setSaving(null);
    if (!result) {
      toast.error("Gagal menyimpan feature permission");
      return;
    }
    setPermissions((current) => mergePermissions(current, result));
    toast.success("Feature permission berhasil disimpan");
  };

  const savePackageLimits = async () => {
    setSaving("package");
    const updates = LIMIT_ROWS.flatMap((feature) =>
      PACKAGES.map(({ value: pkg }) => ({
        package: pkg,
        key: feature.key,
        data: {
          max_value:
            findPermission(permissions, pkg, feature.key)?.max_value ?? 0,
        },
      })),
    );
    const result = await savePermissions(updates);
    setSaving(null);
    if (!result) {
      toast.error("Gagal menyimpan package permission");
      return;
    }
    setPermissions((current) => mergePermissions(current, result));
    toast.success("Package permission berhasil disimpan");
  };

  const savePackagePrices = async () => {
    setSaving("price");
    const payload = Object.fromEntries(
      PACKAGES.map(({ value: pkg }) => [
        pkg,
        prices.find((item) => item.package === pkg)?.monthly_price ?? 0,
      ]),
    );
    const result = await savePrices(payload);
    setSaving(null);
    if (!result) {
      toast.error("Gagal menyimpan harga paket");
      return;
    }
    setPrices((current) => mergePrices(current, result));
    toast.success("Harga paket berhasil disimpan");
  };

  if (!ready) {
    return (
      <Card className="rounded-2xl border-slate-200 p-8 text-center text-slate-500 shadow-none">
        Memuat permission...
      </Card>
    );
  }

  if (error && permissions.length === 0) {
    return (
      <Card className="rounded-2xl border-slate-200 p-8 text-center text-red-600 shadow-none">
        {error}
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab("feature")}
          className={`relative px-1 pb-3 text-sm font-semibold transition-all ${
            activeTab === "feature"
              ? "text-slate-950"
              : "text-slate-400 hover:text-slate-700"
          }`}
        >
          Feature Permission
          {activeTab === "feature" && (
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-violet-600" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("package")}
          className={`relative px-6 pb-3 text-sm font-semibold transition-all ${
            activeTab === "package"
              ? "text-slate-950"
              : "text-slate-400 hover:text-slate-700"
          }`}
        >
          Package Permission
          {activeTab === "package" && (
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-violet-600" />
          )}
        </button>
      </div>

      {activeTab === "feature" ? (
        <Card className="gap-0 rounded-2xl border-slate-200 p-6 shadow-none">
          <div className="flex items-center justify-between pb-5">
            <h3 className="text-lg font-bold text-slate-900">
              Feature Permission
            </h3>
            <Button
              type="button"
              disabled={saving !== null}
              onClick={() => void saveFeatureAccess()}
              className="h-9 rounded-xl bg-violet-600 px-6 text-sm text-white hover:bg-violet-700"
            >
              {saving === "feature" ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>

          <div className="grid grid-cols-[1fr_repeat(3,110px)] items-center border-b border-slate-200 pb-3">
            <span />
            {PACKAGES.map(({ value, label }) => (
              <span
                key={value}
                className="text-center text-sm font-semibold text-slate-900"
              >
                {label}
              </span>
            ))}
          </div>

          <div className="divide-y divide-slate-100">
            {FEATURE_ROWS.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.key}
                  className="grid grid-cols-[1fr_repeat(3,110px)] items-center py-4"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-slate-500" />
                    <span className="text-sm text-slate-900">
                      {feature.label}
                    </span>
                  </div>
                  {PACKAGES.map(({ value: pkg }) => {
                    const permission = findPermission(
                      permissions,
                      pkg,
                      feature.key,
                    );
                    return (
                      <div key={pkg} className="flex justify-center">
                        <Switch
                          checked={permission?.is_access ?? false}
                          disabled={!permission || saving !== null}
                          onCheckedChange={(checked) =>
                            updatePermission(pkg, feature.key, {
                              is_access: checked,
                            })
                          }
                          className="data-[state=checked]:bg-violet-600"
                        />
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className="gap-0 rounded-2xl border-slate-200 p-6 shadow-none">
            <div className="flex items-center justify-between pb-5">
              <h3 className="text-lg font-bold text-slate-900">
                Package Permission
              </h3>
              <Button
                type="button"
                disabled={saving !== null}
                onClick={() => void savePackageLimits()}
                className="h-9 rounded-xl bg-violet-600 px-6 text-sm text-white hover:bg-violet-700"
              >
                {saving === "package" ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-4 border-b border-slate-200 pb-3">
              <div className="text-sm font-semibold uppercase text-slate-400">
                Fitur
              </div>
              {PACKAGES.map(({ value, label }) => (
                <div
                  key={value}
                  className="text-center text-sm font-semibold text-slate-900"
                >
                  {label}
                </div>
              ))}
            </div>

            {LIMIT_ROWS.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.key}
                  className="grid grid-cols-4 items-center gap-4 border-b border-slate-100 py-5 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-slate-500" />
                    <div>
                      <div className="text-sm font-medium text-slate-900">
                        {feature.label}
                      </div>
                      <div className="text-xs text-slate-400">
                        {feature.subtitle}
                      </div>
                    </div>
                  </div>

                  {PACKAGES.map(({ value: pkg }) => {
                    const permission = findPermission(
                      permissions,
                      pkg,
                      feature.key,
                    );
                    const style = PACKAGE_STYLES[pkg];
                    return (
                      <div key={pkg} className="flex flex-col items-center">
                        <input
                          type="number"
                          min={0}
                          step={1}
                          value={permission?.max_value ?? 0}
                          disabled={!permission || saving !== null}
                          onChange={(event) =>
                            updatePermission(pkg, feature.key, {
                              max_value: numericValue(event.target.value),
                            })
                          }
                          className={`w-full rounded-xl border px-4 py-3 text-center text-sm font-semibold outline-none focus:ring-2 focus:ring-violet-500 ${style.input}`}
                        />
                        <span className={`mt-1 text-xs ${style.text}`}>
                          {permission?.max_value ?? 0} {feature.unit}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </Card>

          <Card className="gap-0 rounded-2xl border-slate-200 p-6 shadow-none">
            <div className="flex items-center justify-between pb-5">
              <h3 className="text-lg font-bold text-slate-900">Harga</h3>
              <Button
                type="button"
                disabled={saving !== null}
                onClick={() => void savePackagePrices()}
                className="h-9 rounded-xl bg-violet-600 px-6 text-sm text-white hover:bg-violet-700"
              >
                {saving === "price" ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {PACKAGES.map(({ value: pkg, label }) => {
                const price = prices.find((item) => item.package === pkg);
                const style = PACKAGE_STYLES[pkg];
                return (
                  <div
                    key={pkg}
                    className={`space-y-3 rounded-2xl border bg-white p-5 ${style.card}`}
                  >
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${style.badge}`}
                    >
                      {label}
                    </span>
                    <div>
                      <label
                        htmlFor={`price-${pkg}`}
                        className="mb-1 block text-xs text-slate-400"
                      >
                        Harga / Per Bulan
                      </label>
                      <div
                        className={`flex items-center rounded-xl border px-4 py-2.5 ${style.input}`}
                      >
                        <span className="mr-2 text-sm font-bold opacity-60">
                          Rp
                        </span>
                        <input
                          id={`price-${pkg}`}
                          type="number"
                          min={0}
                          step={1}
                          value={price?.monthly_price ?? 0}
                          disabled={!price || saving !== null}
                          onChange={(event) =>
                            updatePrice(pkg, numericValue(event.target.value))
                          }
                          className="w-full bg-transparent text-sm font-bold outline-none"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
