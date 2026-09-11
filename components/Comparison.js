import { CONFIG } from "@/lib/config";
import Reveal from "./Reveal";

function Cell({ value }) {
  if (value === true) {
    return (
      <span className="inline-flex w-7 h-7 rounded-full bg-[#1DB954]/15 text-[#1DB954] items-center justify-center text-sm font-bold flex-shrink-0">
        ✓
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="inline-flex w-7 h-7 rounded-full bg-muted/10 text-muted items-center justify-center text-sm font-bold flex-shrink-0">
        ✕
      </span>
    );
  }
  return <span className="text-[12px] sm:text-[13px] font-bold text-center">{value}</span>;
}

export default function Comparison() {
  const rows = CONFIG.comparison;

  return (
    <section className="px-5 py-[72px] sm:px-12 lg:px-20 lg:py-[110px] bg-cloud">
      <div className="text-center max-w-[600px] mx-auto mb-14">
        <div className="eyebrow center">The Difference</div>
        <h2 className="font-display text-[30px] sm:text-[42px] lg:text-[52px] font-extrabold leading-[1.08] tracking-[-1.5px] text-ink mb-4">
          Us <span className="text-orange">vs.</span> A Typical Agency
        </h2>
        <p className="text-[17px] text-muted leading-[1.8]">
          No fine print, no surprises — see exactly what you get before you
          sign anything.
        </p>
      </div>

      <Reveal>
        <div className="max-w-[820px] mx-auto rounded-lg2 border-[1.5px] border-silver overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.06)]">
          <div className="grid grid-cols-[1fr_84px_84px] sm:grid-cols-[1fr_150px_150px]">
            {/* header */}
            <div className="bg-navy px-5 sm:px-8 py-4" />
            <div className="bg-navy text-center font-display text-[13px] sm:text-base font-extrabold text-orange py-4 px-1">
              Digi1Xprt
            </div>
            <div className="bg-navy text-center text-[11px] sm:text-sm font-bold text-white/40 py-4 px-1">
              Typical Agency
            </div>

            {rows.flatMap((row, i) => {
              const zebra = i % 2 === 1 ? "bg-cloud/70" : "bg-white";
              const border =
                i !== rows.length - 1 ? "border-b border-silver" : "";
              return [
                <div
                  key={`${row.feature}-f`}
                  className={`${zebra} ${border} px-5 sm:px-8 py-4 sm:py-5 text-[13px] sm:text-sm font-bold text-ink flex items-center`}
                >
                  {row.feature}
                </div>,
                <div
                  key={`${row.feature}-u`}
                  className={`${zebra} ${border} flex items-center justify-center py-4 sm:py-5 px-1`}
                >
                  <Cell value={row.us} />
                </div>,
                <div
                  key={`${row.feature}-o`}
                  className={`${zebra} ${border} flex items-center justify-center py-4 sm:py-5 px-1 opacity-60`}
                >
                  <Cell value={row.others} />
                </div>,
              ];
            })}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
