import Image from "next/image";

const SIZE_CLASSES = {
  "gc-7": "lg:col-span-7",
  "gc-5": "lg:col-span-5",
  "gc-4": "lg:col-span-4",
  "gc-8": "lg:col-span-8",
};

const ASPECT_CLASSES = {
  "gc-7": "aspect-[6/3] lg:aspect-[16/7]",
  "gc-8": "aspect-[6/3] lg:aspect-[16/7]",
  "gc-5": "aspect-[6/3] lg:aspect-[7/4]",
  "gc-4": "aspect-[6/3] lg:aspect-[7/3]",
};

export default function PortfolioCard({ item, gcClass, index = 0, onOpen }) {
  const hasImage = !!item.image;
  const hasUrl = !!item.website;
  const comingSoon = !!item.comingSoon;

  return (
    <div
      className={`col-span-1 group ${SIZE_CLASSES[gcClass]} rounded-lg2 overflow-hidden bg-cloud transition-shadow duration-300 flex flex-col hover:shadow-[0_20px_52px_rgba(0,0,0,0.1)] ${
        hasUrl ? "cursor-pointer" : "cursor-default"
      }`}
      onClick={() => hasUrl && onOpen(item.website)}
    >
      <div
        className={`relative w-full flex-1 overflow-hidden ${ASPECT_CLASSES[gcClass]}`}
      >
        <div className="absolute top-3 left-3 z-10 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-ink text-[10px] font-bold tabular-nums pointer-events-none">
          {String(index + 1).padStart(2, "0")}
        </div>

        {hasImage ? (
          <>
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
            />
            {item.blurb && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                <p className="text-white text-[13px] leading-[1.6]">{item.blurb}</p>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full min-h-[200px] flex flex-col items-center justify-center gap-3 p-8 relative bg-ink">
            <div className="font-display text-lg font-bold text-white text-center">
              {item.tag}
            </div>
            <div className="text-[10px] tracking-[3px] uppercase text-white/35 text-center">
              {hasUrl
                ? "Click to view website"
                : comingSoon
                ? "In the works"
                : "Add image in CONFIG"}
            </div>
          </div>
        )}

        {!hasImage && (
          <div className="absolute top-3 right-3 bg-white/10 backdrop-blur-sm text-white text-[11px] font-semibold px-3 py-1.5 rounded-full tracking-[0.5px] pointer-events-none">
            {hasUrl ? "Website" : comingSoon ? "Coming Soon" : "Add Creative"}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-5 py-[18px] bg-white border-t border-silver flex-shrink-0">
        <div>
          <div className="text-[10px] font-semibold tracking-[1.5px] uppercase text-orange mb-1">
            {item.tag}
          </div>
          <div className="text-sm font-bold text-ink">{item.title}</div>
        </div>
        <div
          className={`w-9 h-9 rounded-full border border-silver flex items-center justify-center text-muted text-[15px] flex-shrink-0 transition-colors ${
            hasUrl ? "group-hover:bg-ink group-hover:border-ink group-hover:text-white" : ""
          }`}
        >
          {hasUrl ? "↗" : comingSoon ? "···" : "→"}
        </div>
      </div>
    </div>
  );
}
