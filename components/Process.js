import { CONFIG } from "@/lib/config";
import Reveal from "./Reveal";

export default function Process() {
  return (
    <section
      id="process"
      className="px-5 py-[72px] sm:px-12 lg:px-20 lg:py-[110px] bg-white"
    >
      <div className="mb-16">
        <div className="eyebrow">How We Work</div>
        <h2 className="font-display text-[30px] sm:text-[42px] lg:text-[52px] font-extrabold leading-[1.08] tracking-[-1.5px] text-ink mb-4">
          Our <span className="text-orange">4-Step</span> Process
        </h2>
        <p className="text-[17px] text-muted leading-[1.8] max-w-[500px]">
          A clear, collaborative approach that delivers results from day one.
        </p>
      </div>

      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="hidden lg:block absolute top-[52px] left-[13%] right-[13%] h-px bg-silver pointer-events-none" />
        {CONFIG.process.map((p) => (
          <Reveal key={p.step}>
            <div className="h-full bg-cloud rounded-lg2 px-6 pt-[34px] pb-[30px] border border-silver text-center transition-shadow duration-300 hover:shadow-[0_14px_40px_rgba(0,0,0,0.06)]">
              <div className="relative z-[1] w-[52px] h-[52px] rounded-full bg-white border border-silver flex items-center justify-center font-display text-[17px] font-bold text-orange mx-auto mb-[22px]">
                {p.step}
              </div>
              <h3 className="text-base font-bold text-ink mb-2.5">
                {p.title}
              </h3>
              <p className="text-[13px] text-muted leading-[1.75]">{p.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
