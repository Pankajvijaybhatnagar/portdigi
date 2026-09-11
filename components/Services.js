import { CONFIG } from "@/lib/config";
import Reveal from "./Reveal";
import Sparkline from "./Sparkline";

export default function Services() {
  return (
    <section
      id="services"
      className="px-5 py-[72px] sm:px-12 lg:px-20 lg:py-[110px] bg-cloud"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-end mb-14">
        <div>
          <div className="eyebrow">What We Do</div>
          <h2 className="font-display text-[30px] sm:text-[42px] lg:text-[52px] font-extrabold leading-[1.08] tracking-[-1.5px] text-ink">
            Services Built
            <br />
            for <span className="text-orange">Growth</span>
          </h2>
        </div>
        <p className="text-[17px] text-muted leading-[1.8] max-w-[500px]">
          Every service is designed to move the needle — from visibility to
          conversion. No fluff, only results.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {CONFIG.services.map((svc) => (
          <Reveal key={svc.num}>
            <div className="relative overflow-hidden bg-white rounded-lg2 px-8 pt-[34px] pb-[34px] border border-silver transition-shadow duration-300 hover:shadow-[0_16px_44px_rgba(0,0,0,0.06)] h-full">
              <div className="font-display text-2xl font-extrabold leading-none text-ink/15 mb-5 tabular-nums">
                {svc.num}
              </div>
              <h3 className="text-[17px] font-bold text-ink mb-[11px]">
                {svc.title}
              </h3>
              <p className="text-sm text-muted leading-[1.75]">{svc.desc}</p>

              {svc.metric && (
                <div className="flex items-end justify-between gap-4 mt-6 pt-5 border-t border-silver">
                  <div>
                    <div className="font-display text-2xl font-extrabold leading-none text-ink tabular-nums">
                      {svc.metric.value}
                    </div>
                    <div className="text-[10px] font-semibold uppercase tracking-[1px] text-muted/70 mt-1.5">
                      {svc.metric.label}
                    </div>
                  </div>
                  <Sparkline
                    points={svc.metric.trend}
                    className="w-[92px] h-9 flex-shrink-0"
                  />
                </div>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
