import {
  FileCheck,
  BarChart3,
  Zap,
  Lock,
  FileText,
  Headset,
  FlaskConical,
  Apple,
  CheckCircle2,
} from "lucide-react";

export const Grid = () => {
  return (
    <section className="bg-white pb-20 md:pb-28">
      <div className="mx-auto w-[90%] max-w-400 px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto items-stretch">
          <div className="md:col-span-2 bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-blue-600 flex flex-col justify-between group">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-300">
                  <FileCheck className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="bg-blue-50 px-3 py-1 rounded-full group-hover:bg-white transition-colors duration-300">
                  <span className="text-[10px] font-bold text-purple-600 tracking-wider uppercase group-hover:text-blue-600">
                    Utama
                  </span>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 transition-colors duration-300 mb-4 group-hover:text-white">
                Manajemen Sertifikasi
              </h3>
              <p className="text-slate-500 group-hover:text-blue-100 transition-colors duration-300 leading-relaxed mb-8 text-[15px]">
                Kelola seluruh dokumen sertifikasi produk Anda — BPOM, Halal,
                PIRT, hingga ekspor — dalam satu platform terintegrasi. Lacak
                status dan pembaruan otomatis.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "Notifikasi otomatis untuk sertifikasi kedaluwarsa",
                "Penyimpanan dokumen terenkripsi",
                "Multi-jenis sertifikasi dalam satu dashboard",
                "Riwayat audit lengkap",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-white/20 transition-colors duration-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <span className="text-sm text-slate-600 group-hover:text-blue-50 transition-colors duration-300 leading-tight">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-blue-900/20 hover:bg-blue-600 transition-all duration-300 group flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-300">
                  <BarChart3 className="h-6 w-6 text-purple-600 group-hover:text-white" />
                </div>
                <div className="bg-purple-50 px-3 py-1 rounded-full group-hover:bg-white transition-colors duration-300">
                  <span className="text-[10px] font-bold text-purple-600 tracking-wider uppercase group-hover:text-blue-600">
                    Insight
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 transition-colors duration-300 mb-4 group-hover:text-white">
                Analytics & Reporting
              </h3>
              <p className="text-slate-500 group-hover:text-blue-100 transition-colors duration-300 leading-relaxed mb-8 text-sm">
                Pantau performa produk melalui dashboard analitik komprehensif.
                Mulai dari scan QR, tren penjualan, dan metrik bisnis.
              </p>
            </div>

            <div className="space-y-4">
              {[
                "Dashboard real-time yang interaktif",
                "Laporan PDF otomatis mingguan",
                "Grafik tren scan konsumen",
                "Export data ke Excel/CSV",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5 group-hover:text-white transition-colors duration-300" />
                  <span className="text-sm text-slate-600 group-hover:text-blue-50 transition-colors duration-300 leading-tight">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-blue-900/20 hover:bg-blue-600 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-300">
                <Zap className="h-5 w-5 text-orange-500 group-hover:text-white" />
              </div>
              <div className="bg-orange-50 px-2 py-1 rounded-full group-hover:bg-white transition-colors duration-300">
                <span className="text-[9px] font-bold text-orange-600 tracking-wider uppercase group-hover:text-blue-600">
                  Efisiensi
                </span>
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-900 transition-colors duration-300 mb-3 group-hover:text-white">
              Proses Cepat
            </h3>
            <p className="text-slate-500 group-hover:text-blue-100 transition-colors duration-300 text-sm mb-6 leading-relaxed">
              Workflow otomatis kami mempercepat proses sertifikasi hingga 70%
              lebih cepat. Templat standar siap pakai.
            </p>
            <div className="space-y-3">
              {[
                "Template dokumen siap pakai",
                "Panduan step-by-step interaktif",
                "Auto-fill formulir",
                "Tracking status real-time",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5 group-hover:text-white transition-colors duration-300" />
                  <span className="text-xs text-slate-600 group-hover:text-blue-50 transition-colors duration-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-blue-900/20 hover:bg-blue-600 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-300">
                <Lock className="h-5 w-5 text-green-600 group-hover:text-white" />
              </div>
              <div className="bg-green-50 px-2 py-1 rounded-full group-hover:bg-white transition-colors duration-300">
                <span className="text-[9px] font-bold text-green-600 tracking-wider uppercase group-hover:text-blue-600">
                  Keamanan
                </span>
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-900 transition-colors duration-300 mb-3 group-hover:text-white">
              Keamanan Data
            </h3>
            <p className="text-slate-500 group-hover:text-blue-100 transition-colors duration-300 text-sm mb-6 leading-relaxed">
              Terapkan standar enkripsi AES-256 bit untuk keamanan dokumen
              sertifikasi dan informasi produk pelanggan.
            </p>
            <div className="space-y-3">
              {[
                "Enkripsi AES-256 end-to-end",
                "Two-factor auth (2FA)",
                "Audit log akses pengguna",
                "Backup otomatis di server",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5 group-hover:text-white transition-colors duration-300" />
                  <span className="text-xs text-slate-600 group-hover:text-blue-50 transition-colors duration-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-blue-900/20 hover:bg-blue-600 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-300">
                <FileText className="h-5 w-5 text-blue-600 group-hover:text-white" />
              </div>
              <div className="bg-blue-50 px-2 py-1 rounded-full group-hover:bg-white transition-colors duration-300">
                <span className="text-[9px] font-bold text-blue-600 tracking-wider uppercase group-hover:text-blue-600">
                  Kepatuhan
                </span>
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-900 transition-colors duration-300 mb-3 group-hover:text-white">
              Integrasi Regulasi
            </h3>
            <p className="text-slate-500 group-hover:text-blue-100 transition-colors duration-300 text-sm mb-6 leading-relaxed">
              Terkoneksi dengan pembaruan regulasi dari BPOM, MUI Halal,
              Kemenkes, dan lembaga berwenang lainnya.
            </p>
            <div className="space-y-3">
              {[
                "Update regulasi BPOM",
                "Integrasi sistem MUI Halal",
                "Alert standar nasional SNI",
                "Database regulasi ASEAN",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5 group-hover:text-white transition-colors duration-300" />
                  <span className="text-xs text-slate-600 group-hover:text-blue-50 transition-colors duration-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-blue-900/20 hover:bg-blue-600 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-300">
                <Headset className="h-5 w-5 text-red-500 group-hover:text-white" />
              </div>
              <div className="bg-red-50 px-2 py-1 rounded-full group-hover:bg-white transition-colors duration-300">
                <span className="text-[9px] font-bold text-red-500 tracking-wider uppercase group-hover:text-blue-600">
                  Layanan
                </span>
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-900 transition-colors duration-300 mb-3 group-hover:text-white">
              Support Dedicated
            </h3>
            <p className="text-slate-500 group-hover:text-blue-100 transition-colors duration-300 text-sm mb-6 leading-relaxed">
              Tim konsultan berpengalaman siap membantu 24/7. Dukungan personal
              account manager eksklusif untuk klien.
            </p>
            <div className="space-y-3">
              {[
                "Support 24/7 via chat/telepon",
                "Response time < 2 jam",
                "Dedicated account manager",
                "Onboarding & training gratis",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5 group-hover:text-white transition-colors duration-300" />
                  <span className="text-xs text-slate-600 group-hover:text-blue-50 transition-colors duration-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-blue-900/20 hover:bg-blue-600 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-300">
                <FlaskConical className="h-5 w-5 text-amber-500 group-hover:text-white" />
              </div>
              <div className="bg-amber-50 px-2 py-1 rounded-full group-hover:bg-white transition-colors duration-300">
                <span className="text-[9px] font-bold text-amber-600 tracking-wider uppercase group-hover:text-blue-600">
                  Uji Lab
                </span>
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-900 transition-colors duration-300 mb-3 group-hover:text-white">
              Proximate Test
            </h3>
            <p className="text-slate-500 group-hover:text-blue-100 transition-colors duration-300 text-sm mb-6 leading-relaxed">
              Analisis proksimat akurat produk makanan dan minuman komersial.
              Uji mencakup air, protein, lemak, abu, dll.
            </p>
            <div className="space-y-3">
              {[
                "Analisis 6 parameter utama",
                "Sertifikat hasil uji resmi",
                "Turnaround time 3-5 hari",
                "Integrasi langsung ke label",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5 group-hover:text-white transition-colors duration-300" />
                  <span className="text-xs text-slate-600 group-hover:text-blue-50 transition-colors duration-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-blue-900/20 hover:bg-blue-600 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-300">
                <Apple className="h-5 w-5 text-emerald-600 group-hover:text-white" />
              </div>
              <div className="bg-emerald-50 px-2 py-1 rounded-full group-hover:bg-white transition-colors duration-300">
                <span className="text-[9px] font-bold text-emerald-600 tracking-wider uppercase group-hover:text-blue-600">
                  Uji Lab
                </span>
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-900 transition-colors duration-300 mb-3 group-hover:text-white">
              Nutrition Test
            </h3>
            <p className="text-slate-500 group-hover:text-blue-100 transition-colors duration-300 text-sm mb-6 leading-relaxed">
              Uji nutrisi komprehensif mencakup 28+ parameter: vitamin, mineral,
              asam amino. Sesuai standar AKG dan BPOM.
            </p>
            <div className="space-y-3">
              {[
                "28+ parameter nutrisi",
                "Sesuai standar BPOM & Kemenkes",
                "Label gizi siap cetak otomatis",
                "Panel nutrisi digital (QR)",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5 group-hover:text-white transition-colors duration-300" />
                  <span className="text-xs text-slate-600 group-hover:text-blue-50 transition-colors duration-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};