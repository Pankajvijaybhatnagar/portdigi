"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

const SLIDE_MS = 7000; // counted from the moment the live site has loaded
const LIVE_WIDTH = 1440; // sites render at a real desktop width, then scale to fit
const LIVE_HEIGHT = 720; // matches the 2:1 frame
const READY_FALLBACK_MS = 9000; // slow site? keep the carousel moving anyway

function domainOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/**
 * The real website running inside the frame. The screenshot sits underneath as
 * a placeholder and fades out once the live page has loaded.
 */
function LivePreview({ item, load, interactive, onReady }) {
  const boxRef = useRef(null);
  const [scale, setScale] = useState(0.5);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / LIVE_WIDTH));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!load) return;
    const id = setTimeout(onReady, READY_FALLBACK_MS);
    return () => clearTimeout(id);
  }, [load, onReady]);

  return (
    <div ref={boxRef} className="relative aspect-[2/1] overflow-hidden bg-white">
      {load && (
        <iframe
          src={item.website}
          title={`${item.title} — live preview`}
          loading="lazy"
          // scripts run so the site behaves normally, but it can never navigate
          // or take over this page
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => {
            setLoaded(true);
            onReady();
          }}
          className="absolute top-0 left-0 border-0 origin-top-left bg-white"
          style={{
            width: LIVE_WIDTH,
            height: LIVE_HEIGHT,
            transform: `scale(${scale})`,
            pointerEvents: interactive ? "auto" : "none",
          }}
        />
      )}

      {/* screenshot placeholder */}
      <Image
        src={item.image}
        alt={item.title}
        fill
        sizes="(min-width: 1024px) 55vw, 100vw"
        className={`object-cover object-top transition-opacity duration-700 pointer-events-none ${loaded ? "opacity-0" : "opacity-100"}`}
        priority
      />

      {load && !loaded && (
        <div className="absolute left-3 bottom-3 flex items-center gap-2 bg-ink/85 backdrop-blur-sm text-white text-[11px] font-bold rounded-full pl-2 pr-3 py-1.5">
          <span className="w-3.5 h-3.5 rounded-full border-2 border-white/25 border-t-orange animate-spin" aria-hidden="true" />
          Loading live site…
        </div>
      )}
    </div>
  );
}

export default function PortfolioSpotlight({ items, labelFor = () => "", onOpen }) {
  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [ready, setReady] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [inView, setInView] = useState(false);
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const swipe = useRef(null);
  const markReady = useCallback(() => setReady(true), []);

  // Only start loading live sites once the showcase is on screen
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setInView(true), { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (items.length === 0) return null;

  const show = (i) => {
    setIndex((i + items.length) % items.length);
    setReady(false);
    setInteractive(false);
  };
  const go = (delta) => show(index + delta);
  const current = items[index];
  const domain = domainOf(current.website);
  const category = labelFor(current.filter);
  const paused = hovering || interactive;

  // Laptop mockup leans toward the cursor (not while browsing the live site)
  const handleMove = (e) => {
    const el = stageRef.current;
    if (!el || interactive || !window.matchMedia("(pointer: fine)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--sry", `${x * 6}deg`);
    el.style.setProperty("--srx", `${-y * 4}deg`);
  };
  const resetTilt = () => {
    const el = stageRef.current;
    if (!el) return;
    el.style.setProperty("--sry", "0deg");
    el.style.setProperty("--srx", "0deg");
  };

  // Swipe left / right on touch screens (off while browsing the live site)
  const onPointerDown = (e) => {
    if (e.pointerType === "mouse" || interactive) return;
    swipe.current = e.clientX;
  };
  const onPointerUp = (e) => {
    if (swipe.current == null) return;
    const dx = e.clientX - swipe.current;
    swipe.current = null;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  };

  const toggleInteractive = () => {
    resetTilt();
    setInteractive((v) => !v);
  };

  return (
    <div
      ref={rootRef}
      className={`relative rounded-[28px] overflow-hidden bg-ink mb-16 ${paused ? "sp-paused" : ""}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => {
        setHovering(false);
        resetTilt();
      }}
      style={{ "--sp-dur": `${SLIDE_MS}ms` }}
    >
      {/* backdrop: grid texture + drifting brand glows */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
        aria-hidden="true"
      />
      <div className="sp-glow absolute -top-32 right-[8%] w-[520px] h-[520px] rounded-full bg-[radial-gradient(circle,rgba(245,166,35,0.35),transparent_65%)] pointer-events-none" aria-hidden="true" />
      <div className="absolute -bottom-40 -left-20 w-[520px] h-[520px] rounded-full bg-[radial-gradient(circle,rgba(26,26,92,0.9),transparent_65%)] pointer-events-none" aria-hidden="true" />

      <div
        className="relative grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-10 lg:gap-12 items-center px-6 sm:px-10 lg:px-14 pt-10 lg:pt-14 pb-10"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        {/* info */}
        <div key={`info-${index}`} className="order-2 lg:order-1">
          <div className="flex items-end gap-3 mb-5 fade-up">
            <span className="outline-num font-display text-[64px] sm:text-[84px] font-extrabold leading-[0.8] tracking-[-3px]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-white/35 font-display text-lg font-bold pb-1">/ {String(items.length).padStart(2, "0")}</span>
          </div>

          <div className="flex items-center gap-2 mb-4 fade-up" style={{ animationDelay: "80ms" }}>
            <span className="text-[11px] font-bold tracking-[2px] uppercase text-ink bg-orange rounded-full px-3 py-1">{current.tag}</span>
            {category && (
              <span className="text-[11px] font-semibold text-white/70 border border-white/20 rounded-full px-3 py-1">{category}</span>
            )}
          </div>

          <h3
            className="font-display text-[26px] sm:text-[34px] lg:text-[38px] font-extrabold text-white leading-[1.1] tracking-[-0.5px] mb-4 fade-up"
            style={{ animationDelay: "160ms" }}
          >
            {current.title}
          </h3>
          {current.blurb && (
            <p className="text-[15px] text-white/65 leading-[1.75] mb-5 max-w-[460px] fade-up" style={{ animationDelay: "240ms" }}>
              {current.blurb}
            </p>
          )}
          {domain && (
            <div className="flex items-center gap-2 text-[13px] text-white/50 mb-7 fade-up" style={{ animationDelay: "300ms" }}>
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" />
              </svg>
              {domain}
            </div>
          )}

          <div className="flex items-center gap-3 flex-wrap fade-up" style={{ animationDelay: "360ms" }}>
            <button
              type="button"
              onClick={() => onOpen(current.website)}
              className="group inline-flex items-center gap-2 bg-white text-ink pl-6 pr-2 py-2 rounded-full font-bold text-sm transition-colors hover:bg-orange hover:text-white"
            >
              View Live Site
              <span
                className="w-8 h-8 rounded-full bg-ink text-white flex items-center justify-center transition-transform group-hover:rotate-45 group-hover:bg-white group-hover:text-orange"
                aria-hidden="true"
              >
                ↑
              </span>
            </button>
            {items.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous project"
                  className="w-11 h-11 rounded-full border border-white/20 text-white flex items-center justify-center transition-colors hover:bg-white hover:text-ink"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next project"
                  className="w-11 h-11 rounded-full border border-white/20 text-white flex items-center justify-center transition-colors hover:bg-white hover:text-ink"
                >
                  →
                </button>
              </>
            )}
          </div>
        </div>

        {/* device stage */}
        <div className="order-1 lg:order-2 relative" onMouseMove={handleMove}>
          <div ref={stageRef} className="sp-stage relative">
            <div key={`shot-${index}`} className="sp-laptop-in relative">
              <div
                className={`rounded-[18px] overflow-hidden bg-white shadow-[0_40px_90px_-30px_rgba(0,0,0,0.8)] transition-shadow duration-300 ${
                  interactive ? "ring-[3px] ring-orange" : "ring-1 ring-white/10"
                }`}
              >
                {/* browser bar */}
                <div className="flex items-center gap-3 px-3 sm:px-4 h-10 bg-[#F4F4F8] border-b border-silver">
                  <span className="hidden sm:flex gap-1.5" aria-hidden="true">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange" />
                    <span className="w-2.5 h-2.5 rounded-full bg-navy" />
                    <span className="w-2.5 h-2.5 rounded-full bg-silver" />
                  </span>
                  <span className="flex-1 min-w-0 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-muted bg-white rounded-full px-3 py-1 border border-silver truncate">
                    <svg viewBox="0 0 24 24" className="w-3 h-3 flex-shrink-0 text-navy" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                      <rect x="5" y="11" width="14" height="10" rx="2" />
                      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                    </svg>
                    <span className="truncate">{domain}</span>
                  </span>
                  <button
                    type="button"
                    onClick={toggleInteractive}
                    aria-pressed={interactive}
                    className={`flex-shrink-0 flex items-center gap-1.5 text-[11px] font-bold rounded-full px-3 py-1 transition-colors ${
                      interactive ? "bg-orange text-ink" : "bg-navy text-white hover:bg-ink"
                    }`}
                  >
                    {interactive ? "✕ Done" : "Try it live"}
                  </button>
                </div>

                <div className="relative">
                  <LivePreview item={current} load={inView} interactive={interactive} onReady={markReady} />
                  {/* while not browsing, the frame behaves like a big "open" button */}
                  {!interactive && (
                    <button
                      type="button"
                      onClick={() => onOpen(current.website)}
                      aria-label={`Open ${current.title}`}
                      className="absolute inset-0 w-full h-full cursor-pointer"
                    />
                  )}
                </div>
              </div>

              {/* floating badges */}
              <div className="sp-pop absolute -top-4 -left-3 sm:-left-6 pointer-events-none" style={{ animationDelay: "450ms" }}>
                <div className="sp-float flex items-center gap-2 bg-white rounded-full pl-2.5 pr-4 py-2 shadow-[0_14px_30px_-10px_rgba(0,0,0,0.5)]">
                  <span className="live-dot-orange w-2.5 h-2.5 rounded-full bg-orange" />
                  <span className="text-[12px] font-bold text-ink">{interactive ? "You're browsing live" : "Live website"}</span>
                </div>
              </div>
              {category && !interactive && (
                <div className="sp-pop absolute -bottom-5 right-4 sm:-right-4 pointer-events-none" style={{ animationDelay: "650ms" }}>
                  <div
                    className="sp-float bg-navy/95 backdrop-blur-md border border-white/15 rounded-2xl px-4 py-3 shadow-[0_18px_40px_-14px_rgba(0,0,0,0.7)]"
                    style={{ animationDelay: "1.2s" }}
                  >
                    <div className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/50">Category</div>
                    <div className="text-[14px] font-extrabold text-white">
                      {category} <span className="text-orange">✦</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* thumbnail strip with the autoplay timer */}
      {items.length > 1 && (
        <div className="relative border-t border-white/10 px-6 sm:px-10 lg:px-14 py-5">
          <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
            {items.map((item, i) => {
              const on = i === index;
              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => show(i)}
                  aria-label={`Show ${item.tag}`}
                  aria-current={on}
                  className={`group relative flex-shrink-0 w-[150px] sm:w-[170px] text-left rounded-xl overflow-hidden border transition-all duration-300 ${
                    on ? "border-orange bg-white/10" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.07] opacity-60 hover:opacity-100"
                  }`}
                >
                  <div className="relative aspect-[2/1]">
                    <Image src={item.image} alt="" fill sizes="170px" className="object-cover object-top" />
                  </div>
                  <div className="px-3 py-2 text-[11px] font-bold text-white truncate">{item.tag}</div>
                  <span className="absolute left-0 bottom-0 h-[3px] w-full bg-white/10">
                    {on && ready && <span key={`p-${index}`} className="sp-progress block h-full bg-orange" onAnimationEnd={() => go(1)} />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
