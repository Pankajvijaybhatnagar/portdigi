import Image from "next/image";

const FALLBACK_STYLES = {
  branding: "bg-gradient-to-br from-navy via-[#3030BB] to-orange",
  social: "bg-gradient-to-br from-[#FF6B35] to-orange",
  ads: "bg-gradient-to-br from-[#1DB954] to-[#0a8a35]",
  web: "bg-gradient-to-br from-[#667EEA] to-[#764BA2]",
  content: "bg-gradient-to-br from-[#764BA2] to-[#667EEA]",
  all: "bg-gradient-to-br from-navy to-ink",
};

const FALLBACK_ICONS = {
  branding: "✦",
  social: "📱",
  ads: "🎯",
  web: "🌐",
  content: "🎬",
  all: "📊",
};

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

export default function PortfolioCard({ item, gcClass, onOpen }) {
  const hasImage = !!item.image;
  const hasUrl = !!item.website;
  const fallbackStyle = FALLBACK_STYLES[item.filter] || FALLBACK_STYLES.all;
  const fallbackIcon = FALLBACK_ICONS[item.filter] || FALLBACK_ICONS.all;

  return (
    <div
      className={`col-span-1 group ${SIZE_CLASSES[gcClass]} rounded-lg2 overflow-hidden bg-cloud cursor-pointer transition-transform duration-300 flex flex-col hover:-translate-y-2 hover:shadow-[0_28px_64px_rgba(0,0,0,0.13)]`}
      onClick={() => hasUrl && onOpen(item.website)}
    >
      <div
        className={`relative w-full flex-1 overflow-hidden ${ASPECT_CLASSES[gcClass]}`}
      >
        {hasImage ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
          />
        ) : (
          <div
            className={`w-full h-full min-h-[200px] flex flex-col items-center justify-center gap-3.5 p-8 relative ${fallbackStyle}`}
          >
            <div className="text-[52px]">{fallbackIcon}</div>
            <div className="font-display text-lg font-black text-white text-center">
              {item.tag}
            </div>
            <div className="text-[10px] tracking-[3px] uppercase text-white/40 text-center">
              {hasUrl ? "Click to view website" : "Add image in CONFIG"}
            </div>
          </div>
        )}

        {!hasImage && (
          <div className="absolute top-3 right-3 bg-white/[0.18] backdrop-blur-sm border border-dashed border-white/50 text-white text-[11px] font-bold px-3 py-1.5 rounded-full tracking-[0.5px] pointer-events-none">
            {hasUrl ? "🌐 Website" : "＋ Add Creative"}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-5 py-[18px] bg-white border-t border-silver flex-shrink-0">
        <div>
          <div className="text-[10px] font-extrabold tracking-[1.5px] uppercase text-orange mb-1">
            {item.tag}
          </div>
          <div className="text-sm font-bold text-ink">{item.title}</div>
        </div>
        <div className="w-9 h-9 rounded-full border-2 border-silver flex items-center justify-center text-muted text-[15px] flex-shrink-0 transition-colors group-hover:bg-orange group-hover:border-orange group-hover:text-white">
          {hasUrl ? "↗" : "→"}
        </div>
      </div>
    </div>
  );
}
