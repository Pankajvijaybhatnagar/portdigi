import { CONFIG } from "@/lib/config";
import Reveal from "./Reveal";

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="px-5 py-[72px] sm:px-12 lg:px-20 lg:py-[110px] bg-cloud"
    >
      <div className="text-center mb-13 max-w-[600px] mx-auto">
        <div className="eyebrow center">Client Love</div>
        <h2 className="font-display text-[30px] sm:text-[42px] lg:text-[52px] font-black leading-[1.08] tracking-[-1.5px] text-ink mb-4">
          What They <em className="italic text-orange">Say</em>
        </h2>
        <p className="text-[17px] text-muted leading-[1.8] mx-auto">
          Real results. Real relationships. Real growth.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {CONFIG.testimonials.map((t) => (
          <Reveal key={t.name}>
            <div className="h-full flex flex-col bg-white rounded-lg2 p-8 border-[1.5px] border-silver transition-all hover:border-orange/40 hover:shadow-[0_14px_44px_rgba(245,166,35,0.1)]">
              <div className="text-orange text-sm tracking-[2px] mb-4">
                ★★★★★
              </div>
              <p className="text-[15px] leading-[1.8] text-ink italic flex-1 mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-orange flex items-center justify-center text-sm font-extrabold text-white flex-shrink-0">
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-extrabold text-ink">
                    {t.name}
                  </div>
                  <div className="text-xs text-muted mt-0.5">{t.role}</div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
