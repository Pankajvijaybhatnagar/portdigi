import { CONFIG } from "@/lib/config";

export default function WhyUs() {
  return (
    <section
      id="why"
      className="px-5 py-[72px] sm:px-12 lg:px-20 lg:py-[110px] bg-ink grid grid-cols-1 lg:grid-cols-[5fr_6fr] gap-14 lg:gap-20 items-center"
    >
      <div className="relative aspect-square lg:aspect-[4/4.6] bg-gradient-to-br from-navy via-[#2a2a7a] to-[#3c2a80] rounded-lg2 flex flex-col items-center justify-center gap-[22px] p-11 overflow-hidden">
        <div className="absolute w-[320px] h-[320px] rounded-full bg-orange/[0.07] -top-[100px] -right-[100px] pointer-events-none" />
        <div className="absolute w-[220px] h-[220px] rounded-full bg-orange/[0.05] -bottom-[70px] -left-[70px] pointer-events-none" />
        <div className="text-[68px] relative z-[1]">🏆</div>
        <div className="text-center relative z-[1]">
          <h3 className="font-display text-[26px] font-black text-white tracking-[-1px] mb-2">
            Award-Winning
            <br />
            Creative Team
          </h3>
          <p className="text-sm text-white/40">
            Trusted by 50+ brands across India
          </p>
        </div>
        <div className="flex gap-2 flex-wrap justify-center relative z-[1]">
          {["Meta Certified", "Google Partner", "Top Rated"].map((chip) => (
            <div
              key={chip}
              className="bg-orange/[0.13] border border-orange/30 text-orange text-[11px] font-bold px-3.5 py-1.5 rounded-full"
            >
              {chip}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="eyebrow">Why Digi1Xprt</div>
        <h2 className="font-display text-[30px] sm:text-[42px] lg:text-[52px] font-black leading-[1.08] tracking-[-1.5px] text-white mb-4">
          We Don&apos;t Just
          <br />
          Market. We <em className="italic text-orange">Build.</em>
        </h2>
        <p className="text-[17px] text-white/[0.42] leading-[1.8] max-w-[500px] mb-10">
          Most agencies execute tasks. We build brands from the ground up —
          with creative ambition and business sense baked in from day one.
        </p>

        <div className="flex flex-col gap-4">
          {CONFIG.perks.map((perk) => (
            <div
              key={perk.title}
              className="flex gap-[18px] items-start p-[22px] bg-white/[0.04] border border-white/[0.07] rounded-md2 transition-all hover:border-orange/[0.28] hover:bg-orange/[0.04]"
            >
              <div className="w-11 h-11 bg-orange/10 rounded-2xl flex items-center justify-center text-[19px] flex-shrink-0">
                {perk.icon}
              </div>
              <div>
                <h4 className="text-[15px] font-extrabold text-white mb-1.5">
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
