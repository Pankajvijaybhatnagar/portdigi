"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function PortfolioSpotlight({ items, onOpen }) {
  const [index, setIndex] = useState(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    if (items.length < 2) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = setInterval(() => {
      if (!pausedRef.current) {
        setIndex((i) => (i + 1) % items.length);
      }
    }, 6000);
    return () => clearInterval(id);
  }, [items.length]);

  if (items.length === 0) return null;

  function go(delta) {
    setIndex((i) => (i + delta + items.length) % items.length);
  }

  const current = items[index];

  return (
    <div
      className="relative rounded-lg2 overflow-hidden bg-ink mb-14"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]">
        {items.map((item, i) => (
          <div
            key={item.title}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              i === index ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            aria-hidden={i !== index}
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
          </div>
        ))}

        {/* slide content */}
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-14">
          <div className="max-w-[560px]">
            <div className="text-white/50 text-[11px] font-semibold tracking-[2px] uppercase mb-3">
              {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")} —{" "}
              {current.tag}
            </div>
            <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-3">
              {current.title}
            </h3>
            {current.blurb && (
              <p className="text-sm sm:text-[15px] text-white/60 leading-relaxed mb-6 max-w-[460px]">
                {current.blurb}
              </p>
            )}
            <button
              type="button"
              onClick={() => onOpen(current.website)}
              className="inline-flex items-center gap-2 bg-white text-ink px-6 py-3 rounded-full font-semibold text-sm transition-colors hover:bg-orange hover:text-white"
            >
              View Live Site ↗
            </button>
          </div>
        </div>

        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous project"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm text-white text-xl flex items-center justify-center transition-colors hover:bg-white/20"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next project"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm text-white text-xl flex items-center justify-center transition-colors hover:bg-white/20"
            >
              ›
            </button>
          </>
        )}
      </div>

      {items.length > 1 && (
        <div className="flex items-center justify-center gap-2 py-5 bg-ink">
          {items.map((item, i) => (
            <button
              key={item.title}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to ${item.tag}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-8 bg-orange" : "w-1.5 bg-white/25 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
