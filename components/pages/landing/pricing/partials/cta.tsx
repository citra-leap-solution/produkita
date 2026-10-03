import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Cta = () => {
  return (
    <section className="bg-white pb-20 md:pb-28">
      <div className="mx-auto w-[90%] max-w-400 px-6 lg:px-8">
        <div className="bg-blue-600 rounded-3xl p-10 md:p-16 shadow-xl shadow-blue-900/20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Masih Ada Pertanyaan?
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed">
              Tim kami siap membantu Anda memilih paket yang paling sesuai
              dengan kebutuhan bisnis Anda.
            </p>
          </div>

          <div className="shrink-0">
            <Button asChild className="bg-white text-blue-600 hover:bg-slate-50 font-bold py-6 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
              <a
                href="https://wa.me/6285257325537"
                target="_blank"
                rel="noopener noreferrer"
              >
                Hubungi Kami
                <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
