import { portfolio } from '../../data/mockData';

const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n);
const pct = (n) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;

export const PortfolioSummary = () => {
  const isUp = portfolio.todayChangePct >= 0;

  return (
    <div className="premium-panel overflow-hidden p-6 lg:p-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-white/35">Total portfolio value</p>
          <div className="mt-3 flex flex-wrap items-end gap-4">
            <span className="text-4xl font-black tracking-[-0.04em] text-white sm:text-6xl">
              {fmt(portfolio.totalValue)}
            </span>
            <span className={`mb-2 text-sm font-bold ${isUp ? 'text-emerald-200' : 'text-red-200'}`}>
              {pct(portfolio.todayChangePct)} today
            </span>
          </div>
          <p className={`mt-2 text-sm font-semibold ${isUp ? 'text-emerald-300' : 'text-red-300'}`}>
            {isUp ? '+' : ''}{fmt(portfolio.todayChange)} in today's session
          </p>
        </div>

        <div className="grid min-w-full grid-cols-2 gap-px bg-white/10 sm:min-w-[420px]">
          {[
            ['Invested', fmt(portfolio.invested), 'capital deployed'],
            ['Total P&L', `${portfolio.pnl >= 0 ? '+' : ''}${fmt(portfolio.pnl)}`, `${pct(portfolio.pnlPct)} overall`],
          ].map(([label, value, sub]) => (
            <div key={label} className="bg-[#101010] p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/35">{label}</p>
              <p className="mt-2 text-lg font-black text-white">{value}</p>
              <p className="mt-1 text-xs text-white/38">{sub}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
        <span className="h-2 w-2 rounded-full bg-emerald-300 live-dot" />
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">Agent running</span>
        <span className="ml-auto text-xs uppercase tracking-[0.18em] text-white/28">BTC/USDT · Simulation Mode</span>
      </div>
    </div>
  );
};
