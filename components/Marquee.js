import { CONFIG } from "@/lib/config";

export default function Marquee() {
  // two identical tracks placed side by side so translateX(-50%) loops seamlessly
  const items = CONFIG.marqueeItems;

  return (
    <div className="bg-ink py-4 overflow-hidden" aria-hidden="true">
      <div className="flex w-max animate-mscroll hover:[animation-play-state:paused]">
        {[0, 1].map((track) => (
          <div className="flex flex-shrink-0" key={track}>
            {items.map((item, i) => (
              <span
                key={`${track}-${item}-${i}`}
                className="inline-block px-5 text-xs font-bold tracking-[2px] uppercase text-white/30 whitespace-nowrap"
              >
                {item}
                <span className="text-orange px-1 text-[10px]">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
