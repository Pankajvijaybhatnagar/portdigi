"use client";

import { useEffect } from "react";
import { CONFIG } from "@/lib/config";

export default function MobileNav({ open, onClose, links, activeHref }) {
  // lock page scroll while the menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div
      className={`fixed inset-0 z-[999] lg:hidden transition-[opacity,visibility] duration-300 ${
        open ? "opacity-100 visible menu-open" : "opacity-0 invisible"
      }`}
      aria-hidden={!open}
    >
      <div className="absolute inset-0 bg-white/95 backdrop-blur-xl" onClick={onClose} />
      <div className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full bg-[radial-gradient(circle,rgba(245,166,35,0.22),transparent_65%)] pointer-events-none" aria-hidden="true" />
      <div className="absolute -bottom-40 -left-32 w-[420px] h-[420px] rounded-full bg-[radial-gradient(circle,rgba(26,26,92,0.12),transparent_65%)] pointer-events-none" aria-hidden="true" />

      <nav className="relative h-full flex flex-col justify-center px-8 pt-24 pb-10 overflow-y-auto" aria-label="Mobile">
        <ul className="flex flex-col gap-1">
          {links.map((link, i) => {
            const active = activeHref === link.href;
            return (
              <li key={link.href} className="menu-link" style={{ transitionDelay: open ? `${80 + i * 55}ms` : "0ms" }}>
                <a
                  href={link.href}
                  onClick={onClose}
                  tabIndex={open ? 0 : -1}
                  className="group flex items-baseline gap-4 py-2.5 border-b border-silver/70"
                >
                  <span className="font-display text-[12px] font-bold text-muted tabular-nums w-6">{String(i + 1).padStart(2, "0")}</span>
                  <span
                    className={`font-display text-[30px] font-extrabold tracking-[-0.5px] transition-colors ${
                      active ? "text-orange" : "text-ink group-hover:text-orange"
                    }`}
                  >
                    {link.label}
                  </span>
                  <span className="ml-auto text-orange opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" aria-hidden="true">
                    →
                  </span>
                </a>
              </li>
            );
          })}
        </ul>

        <div className="menu-link mt-10 flex flex-col gap-4" style={{ transitionDelay: open ? `${120 + links.length * 55}ms` : "0ms" }}>
          <a
            href="#contact"
            onClick={onClose}
            tabIndex={open ? 0 : -1}
            className="cta-shimmer inline-flex items-center justify-center gap-2 bg-orange text-white px-6 py-4 rounded-full font-bold text-[15px]"
          >
            Let&apos;s Talk →
          </a>
          <div className="flex items-center justify-center gap-5 text-[13px] font-semibold text-muted">
            <a href={`mailto:${CONFIG.email}`} tabIndex={open ? 0 : -1} className="hover:text-orange transition-colors">
              {CONFIG.email}
            </a>
            <span className="w-1 h-1 rounded-full bg-silver" />
            <a
              href={`https://wa.me/${CONFIG.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={open ? 0 : -1}
              className="hover:text-orange transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
}
