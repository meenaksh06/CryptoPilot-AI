// Inline sparkline SVG — no chart library needed for these tiny previews
export const Sparkline = ({ data = [], positive = true }) => {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const W = 80;
  const H = 32;

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * W;
      const y = H - ((v - min) / range) * H;
      return `${x},${y}`;
    })
    .join(' ');

  // Area fill
  const firstX = 0;
  const lastX = W;
  const areaPoints = `0,${H} ${points} ${lastX},${H}`;

  const stroke = positive ? '#10b981' : '#ef4444';
  const fill   = positive ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)';

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="overflow-visible">
      <polygon points={areaPoints} fill={fill} />
      <polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="sparkline-path"
      />
    </svg>
  );
};
