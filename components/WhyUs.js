import { CONFIG } from "@/lib/config";

export default function WhyUs() {
  return (
    <section
      id="why"
      className="px-5 py-[72px] sm:px-12 lg:px-20 lg:py-[110px] bg-ink grid grid-cols-1 lg:grid-cols-[5fr_6fr] gap-14 lg:gap-20 items-center"
    >
      <div className="relative aspect-square lg:aspect-[4/4.6] bg-navy rounded-lg2 flex flex-col items-center justify-center gap-3 p-11 overflow-hidden">
        <div className="font-display text-[88px] font-extrabold text-white leading-none tracking-[-3px] relative z-[1]">
          50<span className="text-orange">+</span>
        </div>
        <div className="text-center relative z-[1]">
          <p className="text-sm text-white/40">
            Brands trusted us across India
          </p>
        </div>
        <div className="flex gap-4 flex-wrap justify-center relative z-[1] mt-6 text-[11px] font-semibold text-white/30 uppercase tracking-[1px]">
          <span>Meta Certified</span>
          <span>Google Partner</span>
          <span>Top Rated</span>
        </div>
      </div>

      <div>
        <div className="eyebrow">Why Digi1Xprt</div>
        <h2 className="font-display text-[30px] sm:text-[42px] lg:text-[52px] font-extrabold leading-[1.08] tracking-[-1.5px] text-white mb-4">
          We Don&apos;t Just
          <br />
          Market. We <span className="text-orange">Build.</span>
        </h2>
        <p className="text-[17px] text-white/[0.42] leading-[1.8] max-w-[500px] mb-10">
          Most agencies execute tasks. We build brands from the ground up —
          with creative ambition and business sense baked in from day one.
        </p>

        <div className="flex flex-col gap-4">
          {CONFIG.perks.map((perk, i) => (
            <div
              key={perk.title}
              className="flex gap-[18px] items-start py-[18px] border-t border-white/[0.08]"
            >
              <div className="text-orange font-display text-sm font-bold flex-shrink-0 w-6 pt-0.5 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div>
                <h4 className="text-[15px] font-bold text-white mb-1.5">
                  {perk.title}
                </h4>
                <p className="text-[13px] text-white/40 leading-[1.65]">
                  {perk.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
