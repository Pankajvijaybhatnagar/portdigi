"use client";

import { useEffect, useState } from "react";
import { CONFIG } from "@/lib/config";
import MobileNav from "./MobileNav";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);

      const scrollPos = window.scrollY + 120;
      const sections = document.querySelectorAll("section[id]");
      sections.forEach((sec) => {
        if (
          sec.offsetTop <= scrollPos &&
          sec.offsetTop + sec.offsetHeight > scrollPos
        ) {
          setActiveHref("#" + sec.id);
        }
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nameParts = CONFIG.agencyName.match(/^([^\d]*)(\d)(.*)$/);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[1000] flex items-center justify-between px-5 py-3.5 sm:px-12 lg:px-20 bg-white/96 backdrop-blur-xl border-b border-silver transition-shadow ${
          scrolled ? "shadow-[0_4px_30px_rgba(0,0,0,0.07)]" : ""
        }`}
      >
        <div className="font-display text-[22px] font-extrabold tracking-[-0.5px] text-ink">
          {nameParts ? (
            <>
              {nameParts[1]}
              <span className="text-orange">{nameParts[2]}</span>
              {nameParts[3]}
            </>
          ) : (
            CONFIG.agencyName
          )}
        </div>

        <ul className="hidden lg:flex gap-8">
          {CONFIG.navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`text-sm font-semibold transition-colors ${
                  activeHref === link.href
                    ? "text-orange"
                    : "text-muted hover:text-orange"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="hidden lg:inline-block bg-orange text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-colors hover:bg-orange-dk"
        >
          Let&apos;s Talk
        </a>

        <div
          className="flex lg:hidden flex-col gap-[5px] cursor-pointer p-1"
          role="button"
          tabIndex={0}
          aria-label="Menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((o) => !o)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setMobileOpen((o) => !o);
          }}
        >
          <span className="block w-6 h-0.5 bg-ink rounded-sm transition-transform" />
          <span className="block w-6 h-0.5 bg-ink rounded-sm transition-transform" />
          <span className="block w-6 h-0.5 bg-ink rounded-sm transition-transform" />
        </div>
      </nav>

      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        links={CONFIG.navLinks}
      />
    </>
  );
}
