// Catmull-Rom -> cubic Bezier, so the line reads as a smooth trend curve
// instead of a jagged connect-the-dots polyline.
export function smoothPath(coords) {
  if (coords.length < 3) {
    return "M " + coords.map(([x, y]) => `${x},${y}`).join(" L ");
  }
  let d = `M ${coords[0][0]},${coords[0][1]}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = coords[i - 1] || coords[i];
    const p1 = coords[i];
    const p2 = coords[i + 1];
    const p3 = coords[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0]},${p2[1]}`;
  }
  return d;
}

export default function Sparkline({
  points,
  width = 96,
  height = 36,
  color = "#F5A623",
  className = "",
}) {
  const pad = height * 0.12;
  const plotHeight = height - pad * 2;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const step = points.length > 1 ? width / (points.length - 1) : width;

  const coords = points.map((p, i) => [
    Number((i * step).toFixed(1)),
    Number((pad + plotHeight - ((p - min) / range) * plotHeight).toFixed(1)),
  ]);
  const linePath = smoothPath(coords);
  const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`;
  const [lastX, lastY] = coords[coords.length - 1];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <line x1="0" y1={height} x2={width} y2={height} stroke="#E4E4EE" strokeWidth="1" />
      <path d={areaPath} fill={color} fillOpacity="0.12" />
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={lastX} cy={lastY} r="3" fill="#fff" stroke={color} strokeWidth="2" />
    </svg>
  );
}
