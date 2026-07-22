"use client";

export default function MobileNav({ open, onClose, links }) {
  return (
    <div
      className={`fixed top-[73px] left-0 right-0 bottom-0 z-[999] bg-white/98 backdrop-blur-xl flex flex-col items-center justify-center gap-8 transition-transform duration-300 ease-in-out lg:hidden ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          onClick={onClose}
          className="text-[22px] font-extrabold text-ink hover:text-orange transition-colors"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
