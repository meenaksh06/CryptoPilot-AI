export const Badge = ({ label, color = 'green' }) => {
  const styles = {
    green: 'border-emerald-300/20 bg-emerald-300/10 text-emerald-200',
    red: 'border-red-300/20 bg-red-300/10 text-red-200',
    yellow: 'border-amber-300/20 bg-amber-300/10 text-amber-200',
    blue: 'border-sky-300/20 bg-sky-300/10 text-sky-200',
    grey: 'border-white/10 bg-white/5 text-white/55',
    purple: 'border-violet-300/20 bg-violet-300/10 text-violet-200',
  };

  return (
    <span className={`badge border ${styles[color] || styles.grey}`}>
      {label}
    </span>
  );
};

export const ActionBadge = ({ action, size = 'sm' }) => {
  const map = {
    BUY: { cls: 'border-emerald-300/20 bg-emerald-300/10 text-emerald-200', label: 'BUY' },
    SELL: { cls: 'border-red-300/20 bg-red-300/10 text-red-200', label: 'SELL' },
    HOLD: { cls: 'border-white/10 bg-white/5 text-white/55', label: 'HOLD' },
    DCA: { cls: 'border-sky-300/20 bg-sky-300/10 text-sky-200', label: 'DCA' },
    CAUTION: { cls: 'border-amber-300/20 bg-amber-300/10 text-amber-200', label: 'CAUTION' },
    BULLISH: { cls: 'border-emerald-300/20 bg-emerald-300/10 text-emerald-200', label: 'BULLISH' },
  };
  const config = map[action] || map.HOLD;
  const sizeClass = size === 'lg'
    ? 'px-4 py-2 text-sm font-bold uppercase tracking-[0.18em]'
    : 'badge text-[10px]';

  return (
    <span className={`${config.cls} ${sizeClass} inline-flex items-center border`}>
      {config.label}
    </span>
  );
};

export const Divider = () => <div className="my-4 h-px w-full bg-white/10" />;

export const SectionHeader = ({ title, subtitle, action }) => (
  <div className="mb-5 flex items-end justify-between gap-4">
    <div>
      <h2 className="text-xl font-black tracking-[-0.02em] text-white">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-white/42">{subtitle}</p>}
    </div>
    {action && (
      <button className="text-xs font-bold uppercase tracking-[0.18em] text-white/45 transition-colors hover:text-white">
        {action}
      </button>
    )}
  </div>
);
