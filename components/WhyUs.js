"use client";

import { useEffect, useRef, useState } from "react";
import { CONFIG } from "@/lib/config";

const SPEED = 18; // degrees per second — one full turn every 20s
const MAX_TILT_X = 10; // degrees the cube leans with the cursor
const MAX_TILT_Y = 16;
const CARD_HALF_W = 120; // orbit card is 240px wide
const CARD_HALF_H = 80;

// Brand faces: alternate logo orange and logo navy glass
const FACE_STYLES = [
  {
    face: "border-orange/70 bg-gradient-to-br from-orange/25 via-orange/10 to-white/40",
    glow: "0 0 40px rgba(245,166,35,0.35), inset 0 0 60px rgba(245,166,35,0.15)",
    stat: "text-orange",
  },
  {
    face: "border-navy/50 bg-gradient-to-br from-navy/20 via-navy/[0.07] to-white/40",
    glow: "0 0 40px rgba(26,26,92,0.25), inset 0 0 60px rgba(26,26,92,0.12)",
    stat: "text-navy",
  },
];

export default function WhyUs() {
  const perks = CONFIG.perks.slice(0, 4);
  const [active, setActive] = useState(0);

  const stageRef = useRef(null);
  const cubeRef = useRef(null);
  const parallaxRef = useRef(null);
  const cardRefs = useRef([]);

  // Animation state lives in a ref so the loop never re-renders React
  const anim = useRef({
    angle: 0,
    speed: SPEED,
    paused: false,
    target: null,
    tilt: { x: 0, y: 0 },
    tiltTarget: { x: 0, y: 0 },
    rx: 0,
    ry: 0,
  });

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const a = anim.current;
    let last = performance.now();
    let raf;
    let lastActive = -1;

    // Oval orbit sized from the stage so cards stay clear of the cube and heading
    const measure = () => {
      const el = stageRef.current;
      if (!el) return;
      a.rx = el.clientWidth / 2 - CARD_HALF_W - 8;
      a.ry = el.clientHeight / 2 - CARD_HALF_H - 8;
    };
    measure();
    window.addEventListener("resize", measure);

    const frame = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (a.target !== null) {
        // Glide to a chosen face
        const diff = a.target - a.angle;
        a.angle += diff * Math.min(1, dt * 5);
        a.speed = 0;
        if (Math.abs(diff) < 0.05) {
          a.angle = a.target;
          a.target = null;
        }
      } else {
        // Ease the spin up or down instead of snapping
        const goal = a.paused || reduced ? 0 : SPEED;
        a.speed += (goal - a.speed) * Math.min(1, dt * 2.5);
        a.angle += a.speed * dt;
      }

      a.tilt.x += (a.tiltTarget.x - a.tilt.x) * Math.min(1, dt * 6);
      a.tilt.y += (a.tiltTarget.y - a.tilt.y) * Math.min(1, dt * 6);

      const { angle, tilt } = a;
      if (cubeRef.current) {
        cubeRef.current.style.transform = `translateZ(calc(var(--size) / -2)) rotateX(${-8 + tilt.x}deg) rotateY(${-angle + tilt.y}deg)`;
      }
      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translate3d(${tilt.y * 0.6}px, ${-tilt.x * 0.6}px, 0)`;
      }
      // Card i sits at the top-right of the oval when its cube face is in front
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const t = ((-45 - i * 90 + angle) * Math.PI) / 180;
        const x = Math.cos(t) * a.rx;
        const y = Math.sin(t) * a.ry;
        el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      });

      const idx = ((Math.round(angle / 90) % 4) + 4) % 4;
      if (idx !== lastActive) {
        lastActive = idx;
        setActive(idx);
      }

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const goTo = (i) => {
    const a = anim.current;
    let diff = (((i * 90 - a.angle) % 360) + 360) % 360;
    if (diff > 180) diff -= 360;
    a.target = a.angle + diff;
  };

  const handlePointerMove = (e) => {
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const nx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
    const ny = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
    anim.current.tiltTarget = { x: -ny * MAX_TILT_X, y: nx * MAX_TILT_Y };
  };

  const handlePointerLeave = () => {
    anim.current.tiltTarget = { x: 0, y: 0 };
  };

  const hoverProps = (i) => ({
    onMouseEnter: () => {
      anim.current.paused = true;
      goTo(i);
    },
    onMouseLeave: () => {
      anim.current.paused = false;
    },
    onClick: () => goTo(i),
  });

  return (
    <section
      id="why"
      className="px-5 py-[72px] sm:px-12 lg:px-20 lg:py-[110px] bg-white overflow-hidden"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="relative z-[2] text-center max-w-[640px] mx-auto">
        <div className="eyebrow center">Why Digi1Xprt</div>
        <h2 className="font-display text-[30px] sm:text-[42px] lg:text-[52px] font-extrabold leading-[1.08] tracking-[-1.5px] text-ink mb-4">
          We Don&apos;t Just Market.
          <br />
          We <span className="text-orange">Build.</span>
        </h2>
        <p className="text-[17px] text-muted leading-[1.8]">
          Most agencies execute tasks. We build brands from the ground up —
          with creative ambition and business sense baked in from day one.
        </p>
      </div>

      {/* Stage: cube in the centre, cards orbiting on an oval around it (xl+) */}
      <div
        ref={stageRef}
        className="relative mx-auto mt-10 xl:mt-12 flex items-center justify-center [--size:230px] sm:[--size:360px] lg:[--size:420px] xl:[--size:340px] 2xl:[--size:460px] h-[calc(var(--size)+100px)] xl:h-[980px] 2xl:h-[1140px] max-w-[1400px]"
      >
        <div
          ref={parallaxRef}
          className="hidden xl:block absolute inset-0 will-change-transform"
        >
          {/* Orbit path — same oval the cards travel on */}
          <div
            className="absolute rounded-full border-[1.5px] border-dashed border-orange/45"
            style={{
              left: CARD_HALF_W + 8,
              right: CARD_HALF_W + 8,
              top: CARD_HALF_H + 8,
              bottom: CARD_HALF_H + 8,
            }}
          />

          {/* Orbiting cards */}
          {perks.map((perk, i) => {
            const isActive = i === active;
            return (
              <div
                key={perk.title}
                ref={(el) => (cardRefs.current[i] = el)}
                className="absolute left-1/2 top-1/2 will-change-transform"
              >
                <button
                  type="button"
                  {...hoverProps(i)}
                  className={`block w-[240px] text-left rounded-md2 p-5 bg-white border transition-all duration-500 ${
                    isActive
                      ? "border-orange shadow-[0_20px_50px_-12px_rgba(245,166,35,0.45)] scale-105"
                      : "border-silver opacity-70 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`font-display text-sm font-bold tabular-nums ${
                        isActive ? "text-orange" : "text-muted"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h4 className="text-[15px] font-bold text-ink">
                      {perk.title}
                    </h4>
                  </div>
                  <p className="text-[13px] text-muted leading-[1.6]">
                    {perk.desc}
                  </p>
                </button>
              </div>
            );
          })}
        </div>

        {/* 3D cube */}
        <div
          className="relative z-[1] w-[var(--size)] h-[var(--size)]"
          style={{ perspective: "1400px" }}
        >
          <div
            ref={cubeRef}
            className="absolute inset-0 will-change-transform"
            style={{
              transformStyle: "preserve-3d",
              transform: "translateZ(calc(var(--size) / -2)) rotateX(-8deg)",
            }}
          >
            {perks.map((perk, i) => {
              const s = FACE_STYLES[i % 2];
              return (
                <div
                  key={perk.title}
                  aria-hidden={i !== active}
                  className={`absolute inset-0 rounded-lg2 p-6 sm:p-9 flex flex-col border-2 text-ink ${s.face}`}
                  style={{
                    backfaceVisibility: "hidden",
                    boxShadow: s.glow,
                    transform: `rotateY(${i * 90}deg) translateZ(calc(var(--size) / 2))`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-sm font-bold tabular-nums text-orange">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-[13px] font-extrabold tracking-[-0.3px] text-ink/70">
                      Digi<span className="text-orange">1</span>Xprt
                    </span>
                  </div>
                  <div className="mt-auto">
                    <div
                      className={`font-display text-[52px] sm:text-[84px] xl:text-[72px] 2xl:text-[100px] font-extrabold leading-none tracking-[-3px] ${s.stat}`}
                    >
                      {perk.stat}
                    </div>
                    <p className="text-[13px] mt-2 text-muted">
                      {perk.statLabel}
                    </p>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mt-4 sm:mb-3">
                    {perk.title}
                    <span className="text-orange">.</span>
                  </h3>
                  <ul className="hidden sm:flex flex-col gap-1.5">
                    {perk.points.map((pt) => (
                      <li
                        key={pt}
                        className="flex gap-2 items-start text-xs sm:text-[13px] text-ink/75 leading-snug"
                      >
                        <span className="mt-[5px] w-1.5 h-1.5 rounded-full bg-orange flex-shrink-0" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Below xl: active card under the cube */}
      <div className="xl:hidden max-w-[440px] mx-auto">
        <div className="flex justify-center gap-2 mb-6">
          {perks.map((perk, i) => (
            <button
              key={perk.title}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show ${perk.title}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === active ? "w-8 bg-orange" : "w-2 bg-silver"
              }`}
            />
          ))}
        </div>
        <div
          key={active}
          className="rounded-md2 p-5 border border-orange bg-white animate-[fadeUp_0.5s_ease]"
        >
          <h4 className="text-[15px] font-bold text-ink mb-1.5">
            {perks[active].title}
          </h4>
          <p className="text-[13px] text-muted leading-[1.6]">
            {perks[active].desc}
          </p>
          {/* bullets live here on phones, where the cube face is too small for them */}
          <ul className="sm:hidden flex flex-col gap-1.5 mt-3 pt-3 border-t border-dashed border-silver">
            {perks[active].points.map((pt) => (
              <li key={pt} className="flex gap-2 items-start text-[13px] text-ink/75 leading-snug">
                <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-orange flex-shrink-0" />
                {pt}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
