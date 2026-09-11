import { CONFIG } from "@/lib/config";

export default function ResultsBanner() {
  return (
    <div className="bg-ink px-5 py-12 sm:px-12 lg:px-20 grid grid-cols-2 lg:grid-cols-4 gap-8">
      {CONFIG.bannerStats.map((s) => (
        <div key={s.label} className="text-center">
          <div className="font-display text-4xl lg:text-[50px] font-extrabold text-orange leading-none tracking-[-2px] tabular-nums">
            {s.num}
          </div>
          <div className="text-[13px] font-medium text-white/45 mt-2">
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}
