/**
 * The Digi1Xprt mascot (same character as the growth-chart runner).
 * Feet at (0,0), facing right. `pose`: "run" | "megaphone".
 */
export default function Mascot({ pose = "run" }) {
  const running = pose === "run";
  const leg = (cls, color, shoe, rest) => (
    <g transform="translate(0 -18)">
      <g className={running ? `runner-limb ${cls}` : ""} transform={running ? undefined : `rotate(${rest})`}>
        <path d="M0 0 L1.5 9 L0 17" fill="none" stroke={color} strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="-2" y="15.5" width="8" height="4" rx="2" fill={shoe} />
      </g>
    </g>
  );

  return (
    <g className={running ? "runner-bob" : ""}>
      {leg("runner-leg-b", "#11113A", "#D4881A", 14)}
      {running && (
        <g transform="translate(0 -32)">
          <g className="runner-limb runner-arm-b">
            <path d="M0 0 L2 7 L6 11" fill="none" stroke="#E8B98C" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
      )}

      <rect x="-6.5" y="-36" width="13" height="20" rx="5" fill="#1A1A5C" />
      <text x="0" y="-21.5" textAnchor="middle" fontSize="10" fontWeight="900" fill="#F5A623">1</text>

      <circle cx="1" cy="-44" r="7.5" fill="#FFD7B0" />
      <path d="M-6.3 -47 Q1 -50.5 8.3 -47" fill="none" stroke="#F5A623" strokeWidth="3" strokeLinecap="round" />
      <path d="M-6 -47 L-13 -49.5 M-6 -46 L-12 -42.5" fill="none" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" />
      <circle cx="4.5" cy="-44" r="1.2" fill="#11113A" />
      {pose === "megaphone" ? (
        <ellipse cx="6" cy="-40" rx="2" ry="1.6" fill="#7A2E2E" />
      ) : (
        <path d="M3.5 -40.2 q2.2 1.2 4 -0.2" fill="none" stroke="#11113A" strokeWidth="1.2" strokeLinecap="round" />
      )}

      {leg("runner-leg-a", "#1A1A5C", "#F5A623", -12)}

      {pose === "megaphone" ? (
        <g>
          {/* arm raised holding a megaphone at the mouth */}
          <path d="M0 -32 L7 -36 L10 -40" fill="none" stroke="#FFD7B0" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 -42 L24 -49 L24 -31 L9 -38 Z" fill="#F5A623" stroke="#D4881A" strokeWidth="1" strokeLinejoin="round" />
          <rect x="23" y="-50" width="3" height="20" rx="1.5" fill="#D4881A" />
        </g>
      ) : (
        <g transform="translate(0 -32)">
          <g className="runner-limb runner-arm-a">
            <path d="M0 0 L2 7 L6 11" fill="none" stroke="#FFD7B0" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
      )}
    </g>
  );
}
