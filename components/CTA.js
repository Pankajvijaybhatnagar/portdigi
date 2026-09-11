import { CONFIG } from "@/lib/config";

export default function CTA() {
  return (
    <section
      id="contact"
      className="relative px-5 py-[72px] sm:px-12 lg:px-20 lg:py-[110px] bg-white text-center overflow-hidden"
    >
      <div className="absolute w-[900px] h-[900px] rounded-full bg-[radial-gradient(circle,rgba(245,166,35,0.07),transparent_70%)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="relative">
        <div className="eyebrow center">Ready?</div>
        <h2 className="font-display text-[30px] sm:text-[42px] lg:text-[52px] font-extrabold leading-[1.08] tracking-[-1.5px] text-ink max-w-[620px] mx-auto mb-4">
          Let&apos;s Build Something
          <br />
          <span className="text-orange">Big Together.</span>
        </h2>
        <p className="text-[17px] text-muted leading-[1.8] max-w-[500px] mx-auto mb-12">
          Tell us about your project and we&apos;ll get back to you within 24
          hours.
        </p>

        <div className="flex gap-3.5 justify-center flex-wrap">
          <a
            href={`mailto:${CONFIG.email}`}
            className="inline-flex items-center gap-2 bg-orange text-white px-8 py-4 rounded-full font-semibold text-[15px] transition-colors hover:bg-orange-dk"
          >
            Email Us Now
          </a>
          <a
            href={`https://wa.me/${CONFIG.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-silver text-ink px-8 py-3.5 rounded-full font-semibold text-[15px] transition-colors hover:border-ink"
          >
            WhatsApp Chat
          </a>
        </div>

        <div className="flex items-center justify-center gap-2.5 mt-9 flex-wrap sm:flex-row flex-col">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-muted">
            📧{" "}
            <a href={`mailto:${CONFIG.email}`} className="text-ink hover:text-orange transition-colors">
              {CONFIG.email}
            </a>
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-silver" />
          <div className="flex items-center gap-1.5 text-sm font-semibold text-muted">
            📱{" "}
            <a
              href={`https://wa.me/${CONFIG.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink hover:text-orange transition-colors"
            >
              WhatsApp
            </a>
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-silver" />
          <div className="flex items-center gap-1.5 text-sm font-semibold text-muted">
            📍 {CONFIG.location}
          </div>
        </div>
      </div>
    </section>
  );
}
