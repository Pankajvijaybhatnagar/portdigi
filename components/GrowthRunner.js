"use client";

import { useEffect, useRef, useState } from "react";
import { formatCount } from "@/lib/format";

// Chart geometry (viewBox 0 0 720 300). Start = before value, end = after value.
const CURVE = "M 60 232 C 250 224, 380 210, 460 140 C 540 70, 600 46, 660 40";
const START_Y = 232;
const END_Y = 40;
const END_X = 660;

const RUN_SECONDS = 4.6; // time for one climb on flat ground; steep parts are slower
const CELEBRATE_SECONDS = 2.2;
const REST_SECONDS = 0.5;

// Deterministic confetti so server and client markup match
const CONFETTI = Array.from({ length: 18 }, (_, i) => {
  const a = (i / 18) * Math.PI * 2 + Math.sin(i * 7.3) * 0.3;
  const d = 40 + ((i * 37) % 30);
  // Rounded so the server and browser produce identical markup (no hydration mismatch)
  return {
    dx: Math.round(Math.cos(a) * d),
    dy: Math.round(Math.sin(a) * d - 25),
    rot: ((i * 83) % 360) - 180,
    color: ["#F5A623", "#1A1A5C", "#5AB4F0", "#FF6B6B"][i % 4],
    w: i % 3 === 0 ? 3 : 5,
  };
});

export default function GrowthRunner({ before, after, milestones = [] }) {
  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const runnerRef = useRef(null);
  const counterRef = useRef(null);
  const clipRef = useRef(null);
  const confettiRef = useRef(null);
  const flagRef = useRef(null);
  const markerRefs = useRef([]);
  const [markers, setMarkers] = useState([]);
  // On phones the 720-wide chart shrinks a lot — draw the runner and labels larger
  const [compact, setCompact] = useState(false);
  const runnerScale = useRef(1.45);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => {
      setCompact(mq.matches);
      runnerScale.current = mq.matches ? 2.3 : 1.45;
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const valueToY = (v) =>
    START_Y - ((v - before) / (after - before)) * (START_Y - END_Y);

  // Where each milestone sits on the curve (needs the real path to measure)
  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const total = path.getTotalLength();
    setMarkers(
      milestones.map((v) => {
        const targetY = valueToY(v);
        let len = 0;
        for (; len <= total; len += 2) {
          if (path.getPointAtLength(len).y <= targetY) break;
        }
        const p = path.getPointAtLength(Math.min(len, total));
        return { value: v, x: p.x, y: p.y, frac: len / total };
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const path = pathRef.current;
    const runner = runnerRef.current;
    if (!path || !runner) return;

    const total = path.getTotalLength();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let visible = false;
    let firstPass = true;
    let phase = "run"; // run | celebrate | rest
    let phaseTime = 0;
    let len = 0;
    let raf;
    let last = 0;

    const place = (l) => {
      const p = path.getPointAtLength(l);
      const ahead = path.getPointAtLength(Math.min(l + 2, total));
      const slope = Math.atan2(ahead.y - p.y, ahead.x - p.x); // negative uphill
      const lean = 10 + (slope * 180) / Math.PI * 0.2;
      runner.setAttribute("transform", `translate(${p.x} ${p.y}) rotate(${lean}) scale(${runnerScale.current})`);

      const value = before + ((START_Y - p.y) / (START_Y - END_Y)) * (after - before);
      if (counterRef.current) {
        counterRef.current.textContent = formatCount(
          Math.round(Math.min(after, Math.max(before, value)) / 1000) * 1000
        );
      }
      return slope;
    };

    const reveal = (frac, x) => {
      path.style.strokeDashoffset = String(1 - frac);
      if (clipRef.current) clipRef.current.setAttribute("width", String(Math.max(0, x)));
      markers.forEach((m, i) => {
        if (frac >= m.frac) markerRefs.current[i]?.classList.add("on");
      });
    };

    const finishDrawing = () => {
      reveal(1, 720);
      flagRef.current?.classList.add("on");
    };

    if (reduced) {
      place(total);
      finishDrawing();
      runner.classList.add("celebrating");
      return;
    }

    place(0);

    const frame = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      phaseTime += dt;

      if (phase === "run") {
        const slope = place(len);
        // Harder going on the steep stretch — the runner visibly slows down
        const effort = 1 - 0.5 * Math.abs(Math.sin(slope));
        len = Math.min(total, len + (total / RUN_SECONDS) * effort * dt);
        if (firstPass) reveal(len / total, path.getPointAtLength(len).x);
        if (len >= total) {
          place(total);
          if (firstPass) finishDrawing();
          firstPass = false;
          phase = "celebrate";
          phaseTime = 0;
          runner.classList.add("celebrating");
          const c = confettiRef.current;
          if (c) {
            c.classList.remove("burst");
            void c.getBoundingClientRect(); // restart the burst animation
            c.classList.add("burst");
          }
        }
      } else if (phase === "celebrate" && phaseTime >= CELEBRATE_SECONDS) {
        phase = "rest";
        phaseTime = 0;
        runner.style.opacity = "0";
      } else if (phase === "rest" && phaseTime >= REST_SECONDS) {
        phase = "run";
        phaseTime = 0;
        len = 0;
        runner.classList.remove("celebrating");
        place(0);
        runner.style.opacity = "1";
      }

      if (visible) raf = requestAnimationFrame(frame);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          last = performance.now();
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(frame);
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(svgRef.current);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
    // markers are needed so milestone dots light up as the runner passes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 720 300"
      className="w-full h-auto overflow-visible"
      role="img"
      aria-label={`Line chart showing followers rising from ${formatCount(before)} to ${formatCount(after)}, with a cartoon runner climbing the growth curve`}
    >
      <defs>
        <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F5A623" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#F5A623" stopOpacity="0" />
        </linearGradient>
        <clipPath id="growthReveal">
          <rect ref={clipRef} x="0" y="-100" width="0" height="400" />
        </clipPath>
      </defs>

      {/* milestone gridlines */}
      {milestones.map((v) => {
        const y = valueToY(v);
        return (
          <g key={v}>
            <line x1="40" y1={y} x2="680" y2={y} stroke="#E4E4EE" strokeWidth="1" strokeDasharray="4 6" />
            <text x="34" y={y + 4} textAnchor="end" fontSize={compact ? 18 : 11} fontWeight="600" fill="#7A7A90">
              {formatCount(v)}
            </text>
          </g>
        );
      })}

      {/* baseline */}
      <line x1="40" y1="248" x2="680" y2="248" stroke="#E5E1D8" strokeWidth="1.5" />

      {/* area under curve, revealed behind the runner */}
      <path
        d={`${CURVE} L 660 248 L 60 248 Z`}
        fill="url(#growthFill)"
        clipPath="url(#growthReveal)"
      />

      {/* growth line, drawn by the runner on the first climb */}
      <path
        ref={pathRef}
        d={CURVE}
        fill="none"
        stroke="#F5A623"
        strokeWidth="4"
        strokeLinecap="round"
        pathLength="1"
        style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
      />

      {/* start marker */}
      <circle cx="60" cy="232" r="7" fill="#FFFFFF" stroke="#F5A623" strokeWidth="3" />

      {/* milestone dots that pop as the runner passes */}
      {markers.map((m, i) => (
        <g key={m.value} ref={(el) => (markerRefs.current[i] = el)} className="milestone">
          <circle cx={m.x} cy={m.y} r="5" fill="#fff" stroke="#1A1A5C" strokeWidth="2.5" />
          <g transform={`translate(${m.x + 10} ${m.y + 22}) scale(${compact ? 1.7 : 1})`}>
            <rect x="0" y="-11" width="40" height="16" rx="8" fill="#1A1A5C" />
            <text x="20" y="1" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">
              {formatCount(m.value)}
            </text>
          </g>
        </g>
      ))}

      {/* peak flag — planted after the first climb */}
      <g ref={flagRef} className="milestone">
        <line x1="682" y1="40" x2="682" y2="2" stroke="#1A1A5C" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 682 3 L 712 10 L 682 18 Z" fill="#F5A623" />
        <circle cx={END_X} cy={END_Y} r="8" fill="#F5A623" />
      </g>

      {/* confetti burst at the peak */}
      <g ref={confettiRef} className="confetti" transform={`translate(${END_X} ${END_Y - 30})`}>
        {CONFETTI.map((c, i) => (
          <rect
            key={i}
            className="confetti-piece"
            x={-c.w / 2}
            y="-2"
            width={c.w}
            height="4"
            rx="1"
            fill={c.color}
            style={{ "--dx": `${c.dx}px`, "--dy": `${c.dy}px`, "--rot": `${c.rot}deg` }}
          />
        ))}
      </g>

      {/* The runner — feet at (0,0), facing right */}
      <g ref={runnerRef} className="runner" style={{ transition: "opacity 0.35s" }}>
        {/* dust kicked up behind */}
        {[0, 0.22, 0.44].map((d) => (
          <circle key={d} className="runner-dust" cx="-4" cy="-1" r="3" fill="#D9D4C7" style={{ animationDelay: `${d}s` }} />
        ))}

        <g className="runner-bob">
          {/* back leg + arm */}
          <g transform="translate(0 -18)">
            <g className="runner-limb runner-leg-b">
              <path d="M0 0 L1.5 9 L0 17" fill="none" stroke="#11113A" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="-2" y="15.5" width="8" height="4" rx="2" fill="#D4881A" />
            </g>
          </g>
          <g transform="translate(0 -32)">
            <g className="runner-limb runner-arm-b">
              <path d="M0 0 L2 7 L6 11" fill="none" stroke="#E8B98C" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </g>

          {/* body */}
          <rect x="-6.5" y="-36" width="13" height="20" rx="5" fill="#1A1A5C" />
          <text x="0" y="-21.5" textAnchor="middle" fontSize="10" fontWeight="900" fill="#F5A623">1</text>

          {/* head with headband */}
          <circle cx="1" cy="-44" r="7.5" fill="#FFD7B0" />
          <path d="M-6.3 -47 Q1 -50.5 8.3 -47" fill="none" stroke="#F5A623" strokeWidth="3" strokeLinecap="round" />
          <path d="M-6 -47 L-13 -49.5 M-6 -46 L-12 -42.5" fill="none" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" />
          <circle cx="4.5" cy="-44" r="1.2" fill="#11113A" />
          <path d="M3.5 -40.2 q2.2 1.2 4 -0.2" fill="none" stroke="#11113A" strokeWidth="1.2" strokeLinecap="round" />

          {/* sweat — this is hard work */}
          {[
            { x: -6, y: -50, d: 0 },
            { x: -4, y: -41, d: 0.35 },
            { x: 6, y: -53, d: 0.18 },
          ].map((s) => (
            <path
              key={s.d}
              className="runner-sweat"
              d={`M${s.x} ${s.y} q-1.6 2.6 0 3.6 q1.6 -1 0 -3.6 Z`}
              fill="#5AB4F0"
              style={{ animationDelay: `${s.d}s` }}
            />
          ))}

          {/* front leg + arm */}
          <g transform="translate(0 -18)">
            <g className="runner-limb runner-leg-a">
              <path d="M0 0 L1.5 9 L0 17" fill="none" stroke="#1A1A5C" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="-2" y="15.5" width="8" height="4" rx="2" fill="#F5A623" />
            </g>
          </g>
          <g transform="translate(0 -32)">
            <g className="runner-limb runner-arm-a">
              <path d="M0 0 L2 7 L6 11" fill="none" stroke="#FFD7B0" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </g>

          {/* live follower count riding above the runner */}
          <g transform="translate(1 -66)">
            <rect x="-23" y="-11" width="46" height="19" rx="9.5" fill="#111118" />
            <path d="M-4 8 L0 12.5 L4 8 Z" fill="#111118" />
            <text ref={counterRef} x="0" y="2.5" textAnchor="middle" fontSize="11" fontWeight="800" fill="#FFFFFF">
              {formatCount(before)}
            </text>
          </g>
        </g>
      </g>
    </svg>
  );
}
