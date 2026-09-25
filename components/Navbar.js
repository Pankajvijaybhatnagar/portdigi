"use client";

import { useEffect, useRef, useState } from "react";
import { CONFIG } from "@/lib/config";
import MobileNav from "./MobileNav";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState("");
  const [hoverHref, setHoverHref] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pill, setPill] = useState(null);

  const listRef = useRef(null);
  const linkRefs = useRef({});

  useEffect(() => {
    let ticking = false;

    function update() {
      ticking = false;
      const y = window.scrollY;
      setScrolled(y > 20);

      // which section are we in?
      const scrollPos = y + 120;
      document.querySelectorAll("section[id]").forEach((sec) => {
        if (sec.offsetTop <= scrollPos && sec.offsetTop + sec.offsetHeight > scrollPos) {
          setActiveHref("#" + sec.id);
        }
      });
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Pill that glides behind the hovered link, or rests on the current section
  const target = hoverHref || activeHref;
  useEffect(() => {
    const measure = () => {
      const el = linkRefs.current[target];
      const list = listRef.current;
      if (!el || !list) return setPill(null);
      setPill({ left: el.offsetLeft, width: el.offsetWidth });
    };
    measure();
    // the bar changes width when it turns into a capsule — re-measure after that
    const id = setTimeout(measure, 520);
    return () => clearTimeout(id);
  }, [target, scrolled]);

  const nameParts = CONFIG.agencyName.match(/^([^\d]*)(\d)(.*)$/);
  const capsule = scrolled && !mobileOpen;

  return (
    <>
      {/* sticky: stays pinned to the top for the whole page */}
      <header className="fixed inset-x-0 top-0 z-[1000]">
        <nav
          className={`nav-drop relative mx-auto flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            capsule
              ? "mt-3 w-[calc(100%-24px)] max-w-[1200px] rounded-full border border-silver/80 bg-white/80 backdrop-blur-xl shadow-[0_18px_40px_-20px_rgba(17,17,24,0.35)] px-4 sm:px-6 py-2.5"
              : "mt-0 w-full max-w-full rounded-none border border-transparent bg-white/70 backdrop-blur-md px-5 sm:px-12 lg:px-20 py-4"
          }`}
        >
          {/* logo */}
          <a href="#" className="logo-link font-display text-[22px] font-extrabold tracking-[-0.5px] text-ink [perspective:400px]" aria-label={`${CONFIG.agencyName} — home`}>
            {nameParts ? (
              <>
                {nameParts[1]}
                <span className="logo-one text-orange">{nameParts[2]}</span>
                {nameParts[3]}
              </>
            ) : (
              CONFIG.agencyName
            )}
          </a>

          {/* links with a gliding pill */}
          <ul ref={listRef} className="relative hidden lg:flex items-center gap-1" onMouseLeave={() => setHoverHref(null)}>
            {pill && (
              <li
                aria-hidden="true"
                className="absolute top-0 bottom-0 rounded-full bg-orange-lt transition-all duration-300 ease-[cubic-bezier(0.34,1.3,0.64,1)] pointer-events-none"
                style={{ left: pill.left, width: pill.width }}
              />
            )}
            {CONFIG.navLinks.map((link) => {
              const active = activeHref === link.href;
              return (
                <li key={link.href}>
                  <a
                    ref={(el) => (linkRefs.current[link.href] = el)}
                    href={link.href}
                    onMouseEnter={() => setHoverHref(link.href)}
                    aria-current={active ? "location" : undefined}
                    className={`relative block px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${
                      active ? "text-orange" : "text-muted hover:text-ink"
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute left-1/2 -translate-x-1/2 bottom-1 h-1 w-1 rounded-full bg-orange transition-all duration-300 ${
                        active ? "opacity-100 scale-100" : "opacity-0 scale-0"
                      }`}
                      aria-hidden="true"
                    />
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="cta-shimmer group hidden lg:inline-flex items-center gap-2 bg-orange text-white pl-5 pr-1.5 py-1.5 rounded-full font-bold text-sm shadow-[0_10px_24px_-12px_rgba(245,166,35,0.9)] transition-all hover:bg-orange-dk hover:-translate-y-0.5"
            >
              Let&apos;s Talk
              <span className="cta-arrow w-7 h-7 rounded-full bg-white text-orange flex items-center justify-center text-[13px]" aria-hidden="true">
                →
              </span>
            </a>

            {/* hamburger → ✕ */}
            <button
              type="button"
              className="lg:hidden relative w-11 h-11 rounded-full border border-silver bg-white flex items-center justify-center"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((o) => !o)}
            >
              <span className={`absolute h-0.5 w-5 rounded bg-ink transition-all duration-300 ${mobileOpen ? "rotate-45" : "-translate-y-[6px]"}`} />
              <span className={`absolute h-0.5 w-5 rounded bg-ink transition-all duration-300 ${mobileOpen ? "opacity-0 scale-x-0" : ""}`} />
              <span className={`absolute h-0.5 w-5 rounded bg-ink transition-all duration-300 ${mobileOpen ? "-rotate-45" : "translate-y-[6px]"}`} />
            </button>
          </div>

        </nav>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} links={CONFIG.navLinks} activeHref={activeHref} />
    </>
  );
}
