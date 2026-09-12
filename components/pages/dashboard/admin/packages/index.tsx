"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Box, TrendingUp, FileText } from "lucide-react";

interface Feature {
  label: string;
  icon: React.ElementType;
  plans: boolean[];
}

interface PackageFeature {
  label: string;
  subtitle: string;
  icon: React.ElementType;
  plans: { gratis: string; umkm: string; bisnis: string };
}

interface PriceTier {
  tier: string;
  badgeBg: string;
  textCol: string;
  borderCol: string;
  bgCol: string;
  price: string;
}

export function PackagePermission() {
  const [activeTab, setActiveTab] = useState<"feature" | "package">("feature");

  // Feature Permission state
  const [features, setFeatures] = useState<Feature[]>([
    { label: "Managemen produk", icon: Box, plans: [true, true, true] },
    { label: "Managemen Keuangan", icon: TrendingUp, plans: [true, true, true] },
    { label: "Kalkulator HPP", icon: FileText, plans: [false, true, true] },
  ]);

  // Package Permission state
  const [packageFeatures, setPackageFeatures] = useState<PackageFeature[]>([
    { label: "Managemen produk", subtitle: "Jumlah Produk • per produk", icon: Box, plans: { gratis: "1", umkm: "50", bisnis: "100" } },
    { label: "Managemen Keuangan", subtitle: "Periode Laporan • per bulan", icon: TrendingUp, plans: { gratis: "1", umkm: "12", bisnis: "20" } },
    { label: "Kalkulator HPP", subtitle: "Kalkulasi Perbulan • per kali", icon: FileText, plans: { gratis: "1", umkm: "50", bisnis: "100" } },
  ]);

  // Price state
  const [prices, setPrices] = useState({ gratis: "0", umkm: "200000", bisnis: "1200000" });

  const toggleFeature = (row: number, col: number) => {
    setFeatures((prev) =>
      prev.map((f, i) =>
        i === row ? { ...f, plans: f.plans.map((v, j) => (j === col ? !v : v)) } : f
      )
    );
  };

  const updatePackageFeature = (index: number, tier: "gratis" | "umkm" | "bisnis", value: string) => {
    setPackageFeatures((prev) =>
      prev.map((f, i) => (i === index ? { ...f, plans: { ...f.plans, [tier]: value } } : f))
    );
  };

  const PLAN_LABELS = ["Gratis", "UMKM", "Bisnis"];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("feature")}
          className={`pb-3 px-1 text-sm font-semibold transition-all relative ${
            activeTab === "feature" ? "text-slate-950" : "text-slate-400 hover:text-slate-700"
          }`}
        >
          Feature Permission
          {activeTab === "feature" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("package")}
          className={`pb-3 px-6 text-sm font-semibold transition-all relative ${
            activeTab === "package" ? "text-slate-950" : "text-slate-400 hover:text-slate-700"
          }`}
        >
          Package Permission
          {activeTab === "package" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600" />
          )}
        </button>
      </div>

      {activeTab === "feature" ? (
        <Card className="shadow-none border-slate-200 rounded-2xl p-6 gap-0">
          <div className="flex items-center justify-between pb-5">
            <h3 className="text-lg font-bold text-slate-900">Feature Permission</h3>
            <Button className="rounded-xl h-9 px-6 text-sm bg-violet-600 hover:bg-violet-700 text-white">
              Simpan
            </Button>
          </div>

          <div className="grid grid-cols-[1fr_repeat(3,110px)] items-center border-b border-slate-200 pb-3">
            <span />
            {PLAN_LABELS.map((label) => (
              <span key={label} className="text-sm font-semibold text-slate-900 text-center">
                {label}
              </span>
            ))}
          </div>

          <div className="divide-y divide-slate-100">
            {features.map((feature, row) => {
              const Icon = feature.icon;
              return (
                <div key={feature.label} className="grid grid-cols-[1fr_repeat(3,110px)] items-center py-4">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-slate-500" />
                    <span className="text-sm text-slate-900">{feature.label}</span>
                  </div>
                  {feature.plans.map((checked, col) => (
                    <div key={col} className="flex justify-center">
                      <Switch
                        checked={checked}
                        onCheckedChange={() => toggleFeature(row, col)}
                        className="data-[state=checked]:bg-violet-600"
                      />
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Package Permission Card */}
          <Card className="shadow-none border-slate-200 rounded-2xl p-6 gap-0">
            <div className="flex items-center justify-between pb-5">
              <h3 className="text-lg font-bold text-slate-900">Package Permission</h3>
              <Button className="rounded-xl h-9 px-6 text-sm bg-violet-600 hover:bg-violet-700 text-white">
                Simpan
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-4 pb-3 border-b border-slate-200">
              <div className="text-sm font-semibold text-slate-400 uppercase">Fitur</div>
              <div className="text-center text-sm font-semibold text-slate-900">Gratis</div>
              <div className="text-center text-sm font-semibold text-slate-900">UMKM</div>
              <div className="text-center text-sm font-semibold text-slate-900">Bisnis</div>
            </div>

            {packageFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={feature.label} className="grid grid-cols-4 gap-4 py-5 border-b border-slate-100 items-center last:border-b-0">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-slate-500" />
                    <div>
                      <div className="text-sm font-medium text-slate-900">{feature.label}</div>
                      <div className="text-xs text-slate-400">{feature.subtitle}</div>
                    </div>
                  </div>

                  {/* Gratis */}
                  <div className="flex flex-col items-center">
                    <input
                      type="text"
                      value={feature.plans.gratis}
                      onChange={(e) => updatePackageFeature(index, "gratis", e.target.value)}
                      className="text-center w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                    <span className="text-xs text-slate-500 mt-1">{feature.plans.gratis} Produk</span>
                  </div>

                  {/* UMKM */}
                  <div className="flex flex-col items-center">
                    <input
                      type="text"
                      value={feature.plans.umkm}
                      onChange={(e) => updatePackageFeature(index, "umkm", e.target.value)}
                      className="text-center w-full border border-blue-200 rounded-xl px-4 py-3 text-sm font-semibold bg-blue-50 text-blue-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                    <span className="text-xs text-blue-600 mt-1">{feature.plans.umkm} Produk</span>
                  </div>

                  {/* Bisnis */}
                  <div className="flex flex-col items-center">
                    <input
                      type="text"
                      value={feature.plans.bisnis}
                      onChange={(e) => updatePackageFeature(index, "bisnis", e.target.value)}
                      className="text-center w-full border border-violet-200 rounded-xl px-4 py-3 text-sm font-semibold bg-violet-50 text-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                    <span className="text-xs text-violet-600 mt-1">{feature.plans.bisnis} Produk</span>
                  </div>
                </div>
              );
            })}
          </Card>

          {/* Harga Card */}
          <Card className="shadow-none border-slate-200 rounded-2xl p-6 gap-0">
            <div className="flex items-center justify-between pb-5">
              <h3 className="text-lg font-bold text-slate-900">Harga</h3>
              <Button className="rounded-xl h-9 px-6 text-sm bg-violet-600 hover:bg-violet-700 text-white">
                Simpan
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Gratis Price */}
              <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-3">
                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
                  Gratis
                </span>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Harga / Per Bulan</label>
                  <div className="flex items-center border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5">
                    <span className="text-sm font-bold text-slate-400 mr-2">Rp</span>
                    <input
                      type="text"
                      value={prices.gratis}
                      onChange={(e) => setPrices({ ...prices, gratis: e.target.value })}
                      className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* UMKM Price */}
              <div className="border border-blue-200 rounded-2xl p-5 bg-white space-y-3">
                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">
                  UMKM
                </span>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Harga / Per Bulan</label>
                  <div className="flex items-center border border-blue-200 bg-blue-50 rounded-xl px-4 py-2.5">
                    <span className="text-sm font-bold text-blue-400 mr-2">Rp</span>
                    <input
                      type="text"
                      value={prices.umkm}
                      onChange={(e) => setPrices({ ...prices, umkm: e.target.value })}
                      className="w-full bg-transparent text-sm font-bold text-blue-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Bisnis Price */}
              <div className="border border-violet-200 rounded-2xl p-5 bg-white space-y-3">
                <span className="inline-block px-3 py-1 bg-violet-50 text-violet-600 text-xs font-bold rounded-full">
                  Bisnis
                </span>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Harga / Per Bulan</label>
                  <div className="flex items-center border border-violet-200 bg-violet-50 rounded-xl px-4 py-2.5">
                    <span className="text-sm font-bold text-violet-400 mr-2">Rp</span>
                    <input
                      type="text"
                      value={prices.bisnis}
                      onChange={(e) => setPrices({ ...prices, bisnis: e.target.value })}
                      className="w-full bg-transparent text-sm font-bold text-violet-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
