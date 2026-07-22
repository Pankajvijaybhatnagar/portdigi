import { CONFIG } from "@/lib/config";
import Reveal from "./Reveal";

export default function Services() {
  return (
    <section
      id="services"
      className="px-5 py-[72px] sm:px-12 lg:px-20 lg:py-[110px] bg-cloud"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-end mb-14">
        <div>
          <div className="eyebrow">What We Do</div>
          <h2 className="font-display text-[30px] sm:text-[42px] lg:text-[52px] font-black leading-[1.08] tracking-[-1.5px] text-ink">
            Services Built
            <br />
            for <em className="italic text-orange">Growth</em>
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
            <div className="relative overflow-hidden bg-white rounded-lg2 px-8 pt-[38px] pb-[34px] border-[1.5px] border-silver transition-all duration-300 hover:border-orange/35 hover:-translate-y-1.5 hover:shadow-[0_20px_52px_rgba(0,0,0,0.07)] group h-full">
              <span className="absolute top-0 left-0 right-0 h-[3px] bg-orange origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
              <div className="absolute top-6 right-6 font-display text-4xl font-black text-black/[0.04] leading-none pointer-events-none">
                {svc.num}
              </div>
              <div className="w-[52px] h-[52px] bg-orange-lt rounded-2xl flex items-center justify-center text-2xl mb-[22px]">
                {svc.icon}
              </div>
              <h3 className="text-[17px] font-extrabold text-ink mb-[11px]">
                {svc.title}
              </h3>
              <p className="text-sm text-muted leading-[1.75]">{svc.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
