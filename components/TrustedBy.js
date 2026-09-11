import { CONFIG } from "@/lib/config";

export default function TrustedBy() {
  const clients = CONFIG.portfolio.filter((item) => item.website);

  if (clients.length === 0) return null;

  return (
    <div className="px-5 py-10 sm:px-12 lg:px-20 bg-white border-b border-silver">
      <div className="text-center text-[11px] font-bold tracking-[2.5px] uppercase text-muted mb-7">
        Trusted By Real Brands We&apos;ve Grown
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-5">
        {clients.map((client) => (
          <span
            key={client.tag}
            className="font-display text-lg sm:text-xl font-extrabold tracking-[-0.5px] text-ink/25 grayscale transition-all duration-300 hover:text-ink hover:grayscale-0 cursor-default"
          >
            {client.tag}
          </span>
        ))}
      </div>
    </div>
  );
}
