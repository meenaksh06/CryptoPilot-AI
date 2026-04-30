// Reusable Badge component
export const Badge = ({ label, color = 'green' }) => {
  const styles = {
    green: 'bg-emerald-50 text-emerald-700',
    red: 'bg-red-50 text-red-600',
    yellow: 'bg-amber-50 text-amber-700',
    blue: 'bg-blue-50 text-blue-700',
    grey: 'bg-gray-100 text-gray-500',
    purple: 'bg-purple-50 text-purple-700',
  };
  return (
    <span className={`badge ${styles[color] || styles.grey}`}>
      {label}
    </span>
  );
};

// Action badge — BUY/SELL/HOLD
export const ActionBadge = ({ action, size = 'sm' }) => {
  const map = {
    BUY:     { cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200', label: '↑ BUY' },
    SELL:    { cls: 'bg-red-50 text-red-600 border border-red-200',             label: '↓ SELL' },
    HOLD:    { cls: 'bg-gray-100 text-gray-500 border border-gray-200',          label: '⏸ HOLD' },
    DCA:     { cls: 'bg-blue-50 text-blue-700 border border-blue-200',           label: '+ DCA' },
    CAUTION: { cls: 'bg-amber-50 text-amber-700 border border-amber-200',        label: '⚠ CAUTION' },
    BULLISH: { cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200',  label: '📈 BULLISH' },
  };
  const config = map[action] || map.HOLD;
  const sizeClass = size === 'lg' ? 'px-4 py-1.5 text-sm font-bold rounded-xl' : 'badge';
  return (
    <span className={`${config.cls} ${sizeClass} inline-flex items-center gap-1`}>
      {config.label}
    </span>
  );
};

// Divider
export const Divider = () => <div className="h-px w-full bg-gray-100 my-4" />;

// Section header
export const SectionHeader = ({ title, subtitle, action }) => (
  <div className="flex items-end justify-between mb-5">
    <div>
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
    {action && (
      <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
        {action} →
      </button>
    )}
  </div>
);
