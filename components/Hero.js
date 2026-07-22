import Image from "next/image";
import { CONFIG } from "@/lib/config";

const FALLBACK_ICONS = ["✦", "📱", "🎯", "🌐"];

export default function Hero() {
  return (
    <section className="relative min-h-screen grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-14 px-5 pt-24 pb-16 sm:px-12 lg:px-20 lg:pt-32 lg:pb-20 bg-white overflow-hidden">
      {/* decorative right panel */}
      <div className="hidden lg:block absolute right-0 top-0 w-1/2 h-full bg-gradient-to-br from-[#FFF8EC] to-cloud rounded-l-[48px] z-0" />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2.5 bg-orange-lt border border-orange/30 text-orange-dk text-[11px] font-bold tracking-[1.8px] uppercase px-[18px] py-2 rounded-full mb-7">
          <span className="w-[7px] h-[7px] bg-orange rounded-full animate-blink flex-shrink-0" />
          Digital Marketing Agency
        </div>

        <h1 className="font-display text-[36px] sm:text-[52px] lg:text-[76px] font-black leading-[1.04] tracking-[-2.5px] text-ink mb-5">
          We Make
          <br />
          Brands <em className="italic text-orange">Do Big.</em>
        </h1>

        <p className="text-[17px] text-muted leading-[1.8] max-w-[430px] mb-9">
          Creative digital marketing that drives real results — from powerful
          brand identities to performance campaigns that convert.
        </p>

        <div className="flex items-center gap-3.5 flex-wrap mb-12">
          <a
            href="#portfolio"
            className="inline-flex items-center gap-2 bg-orange text-white px-8 py-4 rounded-full font-bold text-[15px] shadow-[0_6px_24px_rgba(245,166,35,0.38)] transition-all hover:bg-orange-dk hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(245,166,35,0.45)]"
          >
            View Our Work →
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 border-2 border-silver text-ink px-8 py-3.5 rounded-full font-bold text-[15px] transition-all hover:border-orange hover:text-orange hover:-translate-y-0.5"
          >
            Start a Project
          </a>
        </div>

        <div className="flex gap-9 pt-7 border-t border-silver flex-wrap">
          {CONFIG.stats.map((s) => (
            <div key={s.label}>
              <div className="font-display text-[34px] font-black leading-none text-ink">
                {s.num}
              </div>
              <div className="text-xs text-muted font-semibold mt-1.5">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10">
        <div className="grid grid-cols-2 gap-3.5">
          {CONFIG.heroCards.map((card, i) => {
            const isFirst = i === 0;
            const icon = FALLBACK_ICONS[i] || "✦";
            return (
              <div
                key={card.title}
                className={`rounded-lg2 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-all duration-300 cursor-pointer hover:-translate-y-1.5 hover:shadow-[0_22px_52px_rgba(0,0,0,0.15)] relative ${
                  isFirst ? "row-span-2" : ""
                }`}
              >
                <div
                  className={`relative w-full overflow-hidden ${
                    isFirst ? "min-h-[220px] lg:min-h-[376px]" : "min-h-[150px] lg:min-h-[180px]"
                  }`}
                  style={{ background: card.image ? "transparent" : card.bg }}
                >
                  {card.image ? (
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2.5 p-5">
                      <div className="text-[44px]">{icon}</div>
                      <div className="font-display text-base font-black text-white text-center mt-2">
                        {card.title}
                      </div>
                      <div className="text-[9px] tracking-[3px] uppercase text-white/45 text-center">
                        {card.tag}
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 pt-9 pb-3.5">
                    <div className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/60 mb-0.5">
                      {card.tag}
                    </div>
                    <div className="text-[13px] font-bold text-white">
                      {card.title}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
