"use client";

import { useLayoutEffect, useEffect, useRef, useState } from "react";
import { CONFIG } from "@/lib/config";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* ---------- tab icons ---------- */
const TAB_ICONS = {
  branding: (
    <>
      <path d="M12 3l7 7-7 11-7-11z" />
      <circle cx="12" cy="10" r="2" />
    </>
  ),
  social: (
    <>
      <path d="M4 5h16v11H9l-5 4z" />
      <path d="M12 13s-3-1.8-3-3.6A1.6 1.6 0 0 1 12 8.6a1.6 1.6 0 0 1 3 .8C15 11.2 12 13 12 13z" />
    </>
  ),
  ads: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  content: (
    <>
      <rect x="3" y="6" width="18" height="13" rx="2.5" />
      <path d="M3 10h18M7 6l2 4M12 6l2 4M17 6l2 4" />
    </>
  ),
};

function TabIcon({ k }) {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {TAB_ICONS[k] || TAB_ICONS.content}
    </svg>
  );
}

/* ---------- animated scenes (viewBox 640 × 220) ---------- */
function BrandingScene() {
  const swatches = [
    { c: "#F5A623", label: "#F5A623" },
    { c: "#1A1A5C", label: "#1A1A5C" },
    { c: "#FFFFFF", label: "#FFFFFF" },
    { c: "#E4E4EE", label: "#E4E4EE" },
  ];
  return (
    <>
      {/* artboard */}
      <rect x="40" y="28" width="230" height="164" rx="16" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.18)" />
      {[70, 100, 130, 160].map((y) => (
        <line key={y} x1="40" y1={y} x2="270" y2={y} stroke="rgba(255,255,255,0.05)" />
      ))}
      {[85, 130, 175, 220].map((x) => (
        <line key={x} x1={x} y1="28" x2={x} y2="192" stroke="rgba(255,255,255,0.05)" />
      ))}
      <circle className="cap-part cap-fly" cx="155" cy="110" r="52" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeDasharray="4 6" style={{ "--fy": "0px", "--fr": "-90deg" }} />
      <circle className="cap-part cap-fly" cx="155" cy="110" r="40" fill="#F5A623" style={{ animationDelay: "0.2s", "--fx": "-60px", "--fy": "-20px" }} />
      <text className="cap-part cap-fly" x="155" y="128" textAnchor="middle" fontSize="50" fontWeight="900" fill="#1A1A5C" style={{ animationDelay: "0.45s", "--fx": "40px", "--fy": "30px", "--fr": "40deg" }}>
        1
      </text>
      <g className="cap-trace">
        <path d="M214 150 l14 -14 l8 8 l-14 14 z" fill="#fff" />
        <path d="M214 150 l-5 13 l13 -5 z" fill="#F5A623" />
      </g>

      {/* colour system */}
      <text x="310" y="46" fontSize="11" fontWeight="700" fill="rgba(255,255,255,0.5)" letterSpacing="1.5">COLOUR SYSTEM</text>
      {swatches.map((s, i) => (
        <g key={s.label} className="cap-drop" style={{ animationDelay: `${0.5 + i * 0.12}s` }}>
          <circle cx={328 + i * 50} cy="84" r="19" fill={s.c} stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
          <text x={328 + i * 50} y="120" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="rgba(255,255,255,0.45)">{s.label}</text>
        </g>
      ))}

      {/* type scale */}
      <text x="310" y="152" fontSize="11" fontWeight="700" fill="rgba(255,255,255,0.5)" letterSpacing="1.5">TYPE SCALE</text>
      <text className="cap-part cap-fly" x="310" y="196" fontSize="40" fontWeight="900" fill="#fff" style={{ animationDelay: "0.9s" }}>Aa</text>
      {[150, 120, 90].map((w, i) => (
        <rect key={w} className="cap-type" x="380" y={166 + i * 12} width={w} height="6" rx="3" fill={i === 0 ? "#F5A623" : "rgba(255,255,255,0.35)"} style={{ animationDelay: `${1 + i * 0.3}s` }} />
      ))}
    </>
  );
}

function SocialScene() {
  const posts = [0, 1, 2, 3, 4, 5, 6, 7];
  return (
    <>
      <defs>
        <clipPath id="capPhone">
          <rect x="262" y="30" width="112" height="170" rx="14" />
        </clipPath>
      </defs>

      {/* content calendar */}
      <text x="40" y="36" fontSize="11" fontWeight="700" fill="rgba(255,255,255,0.5)" letterSpacing="1.5">CALENDAR</text>
      <rect x="40" y="48" width="170" height="140" rx="14" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.18)" />
      <rect x="40" y="48" width="170" height="26" rx="14" fill="#F5A623" />
      <rect x="40" y="62" width="170" height="12" fill="#F5A623" />
      {Array.from({ length: 20 }, (_, i) => {
        const x = 62 + (i % 5) * 31;
        const y = 94 + Math.floor(i / 5) * 24;
        const on = [0, 2, 3, 6, 8, 11, 12, 14, 17, 19].includes(i);
        return (
          <circle
            key={i}
            className={on ? "cap-drop" : ""}
            cx={x}
            cy={y}
            r="6"
            fill={on ? "#F5A623" : "rgba(255,255,255,0.12)"}
            style={on ? { animationDelay: `${0.2 + i * 0.06}s` } : undefined}
          />
        );
      })}

      {/* phone with scrolling feed */}
      <rect x="256" y="22" width="124" height="186" rx="20" fill="#0B0B12" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
      <g clipPath="url(#capPhone)">
        <rect x="262" y="30" width="112" height="170" fill="#fff" />
        <g className="cap-feed">
          {posts.map((p) => (
            <g key={p} transform={`translate(270 ${38 + p * 60})`}>
              <circle cx="6" cy="6" r="5" fill={p % 2 ? "#1A1A5C" : "#F5A623"} />
              <rect x="16" y="3" width="40" height="5" rx="2.5" fill="#E4E4EE" />
              <rect x="0" y="16" width="96" height="30" rx="6" fill={p % 3 === 0 ? "#FDEBC8" : p % 3 === 1 ? "#E4E4F5" : "#1A1A5C"} />
              <rect x="0" y="50" width="60" height="4" rx="2" fill="#E4E4EE" />
            </g>
          ))}
        </g>
      </g>
      <rect x="298" y="26" width="40" height="6" rx="3" fill="#0B0B12" />

      {/* reactions floating up */}
      {[
        { x: 400, d: 0, el: <path d="M0 4 C0 -2 8 -2 8 4 C8 -2 16 -2 16 4 C16 10 8 14 8 14 C8 14 0 10 0 4 Z" fill="#F5A623" /> },
        { x: 424, d: 0.8, el: <path d="M0 0 h16 v10 h-9 l-4 4 v-4 h-3 z" fill="#fff" /> },
        { x: 408, d: 1.6, el: <path d="M2 8 L14 2 L10 14 L8 9 Z" fill="#E4E4EE" /> },
      ].map((r) => (
        <g key={r.x + "-" + r.d} className="cap-rise" style={{ animationDelay: `${r.d}s` }}>
          <g transform={`translate(${r.x} 160)`}>{r.el}</g>
        </g>
      ))}

      {/* engagement analytics */}
      <text x="470" y="36" fontSize="11" fontWeight="700" fill="rgba(255,255,255,0.5)" letterSpacing="1.5">ENGAGEMENT</text>
      <line x1="470" y1="188" x2="600" y2="188" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
      {[40, 64, 52, 90, 120].map((h, i) => (
        <rect
          key={i}
          className="cap-grow"
          x={474 + i * 25}
          y={188 - h}
          width="16"
          height={h}
          rx="4"
          fill={i === 4 ? "#F5A623" : "rgba(255,255,255,0.3)"}
          style={{ animationDelay: `${0.3 + i * 0.15}s` }}
        />
      ))}
    </>
  );
}

function AdsScene() {
  return (
    <>
      {/* what the audience sees */}
      <text x="40" y="34" fontSize="11" fontWeight="700" fill="rgba(255,255,255,0.5)" letterSpacing="1.5">WHAT THEY SEE</text>
      <g className="cap-drop">
        <rect x="40" y="46" width="150" height="152" rx="14" fill="#fff" />
        <circle cx="56" cy="62" r="7" fill="#F5A623" />
        <rect x="70" y="58" width="50" height="5" rx="2.5" fill="#E4E4EE" />
        <rect x="70" y="66" width="34" height="4" rx="2" fill="#F5A623" opacity="0.6" />
        <rect x="48" y="78" width="134" height="72" rx="8" fill="#1A1A5C" />
        <circle cx="115" cy="114" r="18" fill="#F5A623" />
        <text x="115" y="121" textAnchor="middle" fontSize="18" fontWeight="900" fill="#1A1A5C">1</text>
        <rect x="48" y="158" width="90" height="5" rx="2.5" fill="#E4E4EE" />
        <rect x="48" y="172" width="134" height="18" rx="9" fill="#F5A623" />
        <text x="115" y="184.5" textAnchor="middle" fontSize="9" fontWeight="800" fill="#1A1A5C">Learn more</text>
      </g>

      {/* behind the scenes divider */}
      <line x1="224" y1="24" x2="224" y2="200" stroke="rgba(255,255,255,0.25)" strokeWidth="2" className="cap-flow" />
      <text x="250" y="34" fontSize="11" fontWeight="700" fill="#F5A623" letterSpacing="1.5">BEHIND IT</text>

      {/* targeting */}
      {[46, 30, 14].map((r, i) => (
        <circle key={r} cx="330" cy="118" r={r} fill="none" stroke={i === 2 ? "#F5A623" : "rgba(255,255,255,0.35)"} strokeWidth="2" />
      ))}
      <line x1="330" y1="62" x2="330" y2="174" stroke="rgba(255,255,255,0.2)" />
      <line x1="274" y1="118" x2="386" y2="118" stroke="rgba(255,255,255,0.2)" />
      {[
        { y: 80, d: 0 },
        { y: 118, d: 0.7 },
        { y: 150, d: 1.4 },
        { y: 100, d: 2.1 },
      ].map((p) => (
        <circle key={p.d} className="cap-drift" cx="250" cy={p.y} r="5" fill="#fff" style={{ animationDelay: `${p.d}s`, "--dx": "80px", "--dy": `${118 - p.y}px` }} />
      ))}

      {/* tracking gear */}
      <g transform="translate(410 70)">
        <circle className="cap-spin" r="12" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="5" strokeDasharray="5 3.4" />
      </g>

      {/* conversion funnel */}
      <path d="M448 56 L596 56 L548 128 L548 170 L496 182 L496 128 Z" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinejoin="round" />
      {[0, 0.9, 1.8].map((d, i) => (
        <circle key={d} className="cap-drift" cx={478 + i * 32} cy="48" r="5" fill="#F5A623" style={{ animationDelay: `${d}s`, "--dx": `${522 - (478 + i * 32)}px`, "--dy": "110px" }} />
      ))}
      <g className="cap-drop" style={{ animationDelay: "0.6s" }}>
        <circle cx="522" cy="200" r="13" fill="#F5A623" />
        <path d="M516 200 l4 4 l8 -9" fill="none" stroke="#1A1A5C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </>
  );
}

function ContentScene() {
  return (
    <>
      <defs>
        <clipPath id="capFilm">
          <rect x="220" y="76" width="210" height="68" rx="6" />
        </clipPath>
      </defs>

      {/* clapperboard */}
      <g transform="translate(50 86)">
        <rect x="0" y="22" width="130" height="90" rx="10" fill="#fff" />
        <rect x="12" y="40" width="70" height="6" rx="3" fill="#E4E4EE" />
        <rect x="12" y="54" width="100" height="6" rx="3" fill="#E4E4EE" />
        <text x="12" y="92" fontSize="15" fontWeight="900" fill="#1A1A5C">SCENE 01</text>
        <g className="cap-snap">
          <rect x="0" y="0" width="130" height="20" rx="4" fill="#1A1A5C" />
          {[10, 40, 70, 100].map((x) => (
            <path key={x} d={`M${x} 0 l16 0 l-10 20 l-16 0 z`} fill="#F5A623" />
          ))}
        </g>
      </g>

      {/* film strip rolling */}
      <rect x="220" y="76" width="210" height="68" rx="6" fill="#0B0B12" stroke="rgba(255,255,255,0.25)" />
      <g clipPath="url(#capFilm)">
        <g className="cap-roll">
          {Array.from({ length: 7 }, (_, i) => (
            <g key={i} transform={`translate(${224 + i * 48} 0)`}>
              <rect x="0" y="80" width="6" height="5" rx="1" fill="rgba(255,255,255,0.5)" />
              <rect x="20" y="80" width="6" height="5" rx="1" fill="rgba(255,255,255,0.5)" />
              <rect x="0" y="135" width="6" height="5" rx="1" fill="rgba(255,255,255,0.5)" />
              <rect x="20" y="135" width="6" height="5" rx="1" fill="rgba(255,255,255,0.5)" />
              <rect x="0" y="90" width="40" height="40" rx="4" fill={i % 3 === 0 ? "#F5A623" : i % 3 === 1 ? "#1A1A5C" : "#2A2A6E"} />
              {i % 3 === 0 && <path d="M15 102 l12 8 l-12 8 z" fill="#1A1A5C" />}
            </g>
          ))}
        </g>
      </g>

      {/* caption being written */}
      <text x="460" y="52" fontSize="11" fontWeight="700" fill="rgba(255,255,255,0.5)" letterSpacing="1.5">CAPTION</text>
      <rect x="460" y="64" width="140" height="86" rx="12" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.18)" />
      {[110, 90, 120, 60].map((w, i) => (
        <rect key={i} className="cap-type" x="474" y={80 + i * 16} width={w} height="6" rx="3" fill={i === 0 ? "#F5A623" : "rgba(255,255,255,0.4)"} style={{ animationDelay: `${i * 0.5}s` }} />
      ))}

      {/* publish tick */}
      <g className="cap-drop" style={{ animationDelay: "0.8s" }}>
        <rect x="460" y="164" width="140" height="30" rx="15" fill="#F5A623" />
        <text x="530" y="183.5" textAnchor="middle" fontSize="11" fontWeight="800" fill="#1A1A5C">✓ Scheduled</text>
      </g>
    </>
  );
}

const SCENES = { branding: BrandingScene, social: SocialScene, ads: AdsScene, content: ContentScene };

export default function Capabilities() {
  const caps = CONFIG.capabilities;
  const [activeKey, setActiveKey] = useState(caps[0].key);
  const active = caps.find((c) => c.key === activeKey);
  const Scene = SCENES[active.key];

  // Sliding highlight behind the active tab (vertical on desktop, horizontal on phones)
  const tabRefs = useRef({});
  const [hl, setHl] = useState(null);
  useIsoLayoutEffect(() => {
    const update = () => {
      const el = tabRefs.current[activeKey];
      if (el) setHl({ top: el.offsetTop, left: el.offsetLeft, width: el.offsetWidth, height: el.offsetHeight });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [activeKey]);

  let cardIndex = 0;

  return (
    <section id="capabilities" className="relative px-5 py-[72px] sm:px-12 lg:px-20 lg:py-[110px] bg-white overflow-hidden">
      <div className="mb-11 max-w-[640px]">
        <div className="eyebrow">How We Work</div>
        <h2 className="font-display text-[30px] sm:text-[42px] lg:text-[52px] font-extrabold leading-[1.08] tracking-[-1.5px] text-ink mb-4">
          What <span className="text-orange">Branding</span>, <span className="text-orange">Social</span>,{" "}
          <span className="text-orange">Ads</span> &amp; <span className="text-orange">Content</span> Mean Here
        </h2>
        <p className="text-[17px] text-muted leading-[1.8]">
          The same categories you see in our portfolio filters, broken down into the actual tools, channels, and
          techniques behind each one.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-6 lg:gap-8 items-start">
        {/* category rail */}
        <div className="lg:sticky lg:top-24 -mx-5 px-5 lg:mx-0 lg:px-0 overflow-x-auto lg:overflow-visible">
          <div className="relative flex lg:flex-col gap-2 lg:gap-3 min-w-max lg:min-w-0 pb-1" role="tablist" aria-label="Capabilities">
            {hl && (
              <span
                className="absolute rounded-2xl bg-ink shadow-[0_18px_36px_-16px_rgba(17,17,24,0.6)] transition-all duration-500 ease-[cubic-bezier(0.34,1.2,0.64,1)]"
                style={{ top: hl.top, left: hl.left, width: hl.width, height: hl.height }}
                aria-hidden="true"
              />
            )}
            {caps.map((cap) => {
              const on = cap.key === activeKey;
              const count = cap.groups.reduce((n, g) => n + g.items.length, 0);
              return (
                <button
                  key={cap.key}
                  ref={(el) => (tabRefs.current[cap.key] = el)}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActiveKey(cap.key)}
                  className={`relative z-[1] flex items-center gap-3 text-left rounded-2xl px-4 py-3 lg:py-4 border transition-colors duration-300 ${
                    on ? "border-transparent" : "border-silver bg-cloud hover:bg-white hover:border-orange/40"
                  }`}
                >
                  <span
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                      on ? "bg-orange text-ink" : "bg-white text-orange border border-silver"
                    }`}
                  >
                    <TabIcon k={cap.key} />
                  </span>
                  <span className="pr-2">
                    <span className={`block text-[15px] font-extrabold transition-colors ${on ? "text-white" : "text-ink"}`}>{cap.label}</span>
                    <span className={`block text-[12px] font-semibold transition-colors ${on ? "text-white/55" : "text-muted"}`}>
                      {count} services
                    </span>
                  </span>
                  <span className={`hidden lg:block ml-auto text-lg transition-all duration-300 ${on ? "text-orange translate-x-0" : "text-silver -translate-x-1"}`} aria-hidden="true">
                    →
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* studio panel */}
        <div key={active.key} className="rounded-[28px] border border-silver bg-cloud overflow-hidden" role="tabpanel">
          {/* animated scene */}
          <div className="relative overflow-hidden bg-gradient-to-br from-navy via-[#15154A] to-ink">
            <div
              className="absolute inset-0 opacity-[0.08] pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
              aria-hidden="true"
            />
            <div className="absolute -top-24 -right-16 w-[340px] h-[340px] rounded-full bg-[radial-gradient(circle,rgba(245,166,35,0.3),transparent_65%)] pointer-events-none" aria-hidden="true" />
            <svg viewBox="0 0 640 220" className="relative w-full h-auto" aria-hidden="true">
              {Scene && <Scene />}
            </svg>
          </div>

          <div className="p-6 sm:p-10">
            <p className="fade-up text-[16px] sm:text-[18px] text-ink/80 leading-[1.75] max-w-[720px] mb-9 font-medium">{active.description}</p>

            <div className="flex flex-col">
              {active.groups.map((group, gi) => {
                const behind = gi > 0; // second layer (e.g. Ads: "What Runs Behind It")
                return (
                  <div key={group.title}>
                    {gi > 0 && (
                      <div className="flex items-center gap-3 my-7" aria-hidden="true">
                        <svg viewBox="0 0 200 20" preserveAspectRatio="none" className="flex-1 h-5">
                          <line x1="0" y1="10" x2="200" y2="10" stroke="#F5A623" strokeWidth="2" className="cap-flow" />
                        </svg>
                        <span className="w-9 h-9 rounded-full bg-orange text-ink flex items-center justify-center font-bold flex-shrink-0">↓</span>
                        <svg viewBox="0 0 200 20" preserveAspectRatio="none" className="flex-1 h-5">
                          <line x1="0" y1="10" x2="200" y2="10" stroke="#F5A623" strokeWidth="2" className="cap-flow" />
                        </svg>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mb-4 fade-up">
                      <span className={`w-2 h-2 rounded-full ${behind ? "bg-navy" : "bg-orange"}`} />
                      <span className="text-[11px] font-bold uppercase tracking-[1.8px] text-orange">{group.title}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {group.items.map((item) => {
                        const n = ++cardIndex;
                        return (
                          <div
                            key={item.name}
                            className={`cap-card fade-up rounded-2xl p-5 pl-6 border ${
                              behind ? "bg-navy border-navy text-white" : "bg-white border-silver"
                            }`}
                            style={{ animationDelay: `${120 + n * 80}ms` }}
                          >
                            <div className="flex items-start gap-3">
                              <span
                                className={`font-display text-[12px] font-extrabold rounded-lg px-2 py-1 flex-shrink-0 tabular-nums ${
                                  behind ? "bg-white/10 text-orange" : "bg-orange-lt text-orange"
                                }`}
                              >
                                {String(n).padStart(2, "0")}
                              </span>
                              <div>
                                <h4 className={`text-[15px] font-bold mb-1.5 ${behind ? "text-white" : "text-ink"}`}>{item.name}</h4>
                                <p className={`text-[13px] leading-[1.65] ${behind ? "text-white/65" : "text-muted"}`}>{item.desc}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
