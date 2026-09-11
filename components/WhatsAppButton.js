"use client";

import { CONFIG } from "@/lib/config";

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${CONFIG.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-6 right-5 sm:right-8 z-[1500] flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-[0_4px_16px_rgba(0,0,0,0.18)] transition-colors duration-200 hover:bg-[#20BD5A]"
    >
      <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full bg-ink text-white text-xs font-semibold px-3.5 py-2 opacity-0 translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
        Chat with us
      </span>
      <svg viewBox="0 0 32 32" className="relative w-7 h-7 fill-white">
        <path d="M16.004 3C9.376 3 4 8.373 4 15c0 2.362.687 4.564 1.875 6.418L4 29l7.79-1.84A11.93 11.93 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm6.981 17.06c-.294.828-1.463 1.523-2.403 1.71-.638.128-1.472.23-4.276-.918-3.588-1.487-5.903-5.076-6.083-5.312-.176-.235-1.456-1.939-1.456-3.7 0-1.762.925-2.628 1.253-2.988.328-.36.717-.45.956-.45.239 0 .478.002.686.012.221.01.517-.084.809.617.294.706 1.003 2.44 1.09 2.618.088.178.146.386.03.622-.117.235-.176.382-.35.588-.176.206-.37.46-.528.618-.176.176-.36.367-.155.72.206.353.916 1.512 1.966 2.448 1.35 1.205 2.49 1.578 2.844 1.755.353.176.56.147.766-.088.206-.235.883-1.03 1.118-1.383.235-.353.47-.294.795-.176.328.117 2.08.98 2.437 1.157.358.176.596.264.685.412.088.147.088.853-.206 1.68Z" />
      </svg>
    </a>
  );
}
