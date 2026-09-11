import { CONFIG } from "@/lib/config";
import Reveal from "./Reveal";
import { formatCount } from "@/lib/format";

export default function ROI() {
  const { before, after, span } = CONFIG.growthStory;
  const gain = after.value - before.value;
  const growthPercent = Math.round((gain / before.value) * 100);

  const cards = [
    {
      stat: `+${formatCount(gain)}`,
      label: "New Followers",
      desc: "That's how many more people now see this brand's content every single day — reach that didn't exist before.",
    },
    {
      stat: `${growthPercent.toLocaleString()}%`,
      label: "Growth, Not Luck",
      desc: "A trajectory this steep only happens with a strategy that's working — not a one-off spike in attention.",
    },
    {
      stat: span,
      label: "Time To Get There",
      desc: "Fast enough to move the needle this fiscal year — not a five-year plan you have to take on faith.",
    },
  ];

  return (
    <section className="px-5 py-[72px] sm:px-12 lg:px-20 lg:py-[110px] bg-white">
      <div className="mb-14 max-w-[600px]">
        <div className="eyebrow">In Plain Business Terms</div>
        <h2 className="font-display text-[30px] sm:text-[42px] lg:text-[52px] font-extrabold leading-[1.08] tracking-[-1.5px] text-ink mb-4">
          What The Numbers <span className="text-orange">Actually Mean</span>
        </h2>
        <p className="text-[17px] text-muted leading-[1.8]">
          Follower counts are nice — here&rsquo;s what they translate to for
          a business owner deciding where to spend next quarter&rsquo;s
          marketing budget.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <Reveal key={card.label}>
            <div className="h-full bg-cloud rounded-lg2 px-7 pt-8 pb-7 border border-silver transition-shadow duration-300 hover:shadow-[0_14px_40px_rgba(0,0,0,0.06)]">
              <div className="font-display text-sm font-semibold text-muted/50 mb-5 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="font-display text-[34px] font-extrabold leading-none text-ink mb-2 tabular-nums">
                {card.stat}
              </div>
              <div className="text-[13px] font-bold uppercase tracking-[1px] text-orange mb-3">
                {card.label}
              </div>
              <p className="text-[14px] text-muted leading-[1.75]">{card.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
