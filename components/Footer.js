import { CONFIG } from "@/lib/config";

export default function Footer() {
  const nameParts = CONFIG.agencyName.match(/^([^\d]*)(\d)(.*)$/);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink px-5 py-[52px] sm:px-12 lg:px-20 flex items-center justify-between gap-6 border-t border-white/[0.06] flex-wrap">
      <div>
        <div className="font-display text-[22px] font-extrabold text-white tracking-[-0.5px]">
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
        <div className="text-xs text-white/30 mt-1.5">{CONFIG.tagline}</div>
      </div>

      <div className="text-[13px] text-white/[0.28]">
        © {year} {CONFIG.agencyName}. All rights reserved.
      </div>

      <nav className="flex gap-6 flex-wrap">
        {CONFIG.navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-[13px] font-semibold text-white/35 hover:text-orange transition-colors"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </footer>
  );
}
