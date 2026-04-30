import { portfolio } from '../../data/mockData';

const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n);

const pct = (n) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;

export const PortfolioSummary = () => {
  const isUp = portfolio.todayChangePct >= 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 card-hover">
      {/* Row 1 */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-6">
        {/* Total value */}
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
            Total Portfolio Value
          </p>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-extrabold tracking-tight text-gray-900">
              {fmt(portfolio.totalValue)}
            </span>
            <span
              className={`flex items-center gap-1 text-sm font-bold mb-1 ${
                isUp ? 'text-emerald-600' : 'text-red-500'
              }`}
            >
              {isUp ? '▲' : '▼'} {pct(portfolio.todayChangePct)}
              <span className="font-normal text-gray-400 ml-1">today</span>
            </span>
          </div>
          <p className={`text-sm mt-1 ${isUp ? 'text-emerald-600' : 'text-red-500'}`}>
            {isUp ? '+' : ''}{fmt(portfolio.todayChange)} today
          </p>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-16 bg-gray-100" />

        {/* Invested & P&L */}
        <div className="flex gap-8">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Invested</p>
            <p className="text-lg font-bold text-gray-800">{fmt(portfolio.invested)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total P&L</p>
            <p className={`text-lg font-bold ${portfolio.pnl >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {portfolio.pnl >= 0 ? '+' : ''}{fmt(portfolio.pnl)}
              <span className="text-sm font-normal ml-1">({pct(portfolio.pnlPct)})</span>
            </p>
          </div>
        </div>
      </div>

      {/* Live indicator */}
      <div className="flex items-center gap-2 mt-5 pt-4 border-t border-gray-100">
        <span className="w-2 h-2 rounded-full bg-emerald-500 live-dot" />
        <span className="text-xs text-gray-400">Agent running · Updated just now</span>
        <span className="ml-auto text-xs text-gray-300">BTC/USDT · Simulation Mode</span>
      </div>
    </div>
  );
};
