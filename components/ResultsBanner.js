import { CONFIG } from "@/lib/config";

export default function ResultsBanner() {
  return (
    <div className="bg-orange px-5 py-10 sm:px-12 lg:px-20 grid grid-cols-2 lg:grid-cols-4 gap-8">
      {CONFIG.bannerStats.map((s) => (
        <div key={s.label} className="text-center">
          <div className="font-display text-4xl lg:text-[50px] font-black text-white leading-none tracking-[-2px]">
            {s.num}
          </div>
          <div className="text-[13px] font-bold text-white/70 mt-2">
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}
