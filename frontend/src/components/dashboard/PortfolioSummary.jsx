import { portfolio } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n);
const pct = (n) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;

export const PortfolioSummary = () => {
  const { darkMode: dark } = useApp();
  const isUp = portfolio.todayChangePct >= 0;
  const card = dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100';
  const heading = dark ? 'text-white' : 'text-gray-900';
  const muted = dark ? 'text-gray-400' : 'text-gray-400';

  return (
    <div className={`rounded-2xl shadow-sm border p-6 card-hover ${card}`}>
      <div className="flex flex-col sm:flex-row sm:items-end gap-6">
        <div className="flex-1">
          <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${muted}`}>
            Total Portfolio Value
          </p>
          <div className="flex items-end gap-3">
            <span className={`text-4xl font-extrabold tracking-tight ${heading}`}>
              {fmt(portfolio.totalValue)}
            </span>
            <span className={`flex items-center gap-1 text-sm font-bold mb-1 ${isUp ? 'text-emerald-600' : 'text-red-500'}`}>
              {isUp ? '▲' : '▼'} {pct(portfolio.todayChangePct)}
              <span className={`font-normal ml-1 ${muted}`}>today</span>
            </span>
          </div>
          <p className={`text-sm mt-1 ${isUp ? 'text-emerald-600' : 'text-red-500'}`}>
            {isUp ? '+' : ''}{fmt(portfolio.todayChange)} today
          </p>
        </div>
        <div className={`hidden sm:block w-px h-16 ${dark ? 'bg-gray-700' : 'bg-gray-100'}`} />
        <div className="flex gap-8">
          <div>
            <p className={`text-xs uppercase tracking-wider mb-1 ${muted}`}>Invested</p>
            <p className={`text-lg font-bold ${heading}`}>{fmt(portfolio.invested)}</p>
          </div>
          <div>
            <p className={`text-xs uppercase tracking-wider mb-1 ${muted}`}>Total P&L</p>
            <p className={`text-lg font-bold ${portfolio.pnl >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {portfolio.pnl >= 0 ? '+' : ''}{fmt(portfolio.pnl)}
              <span className={`text-sm font-normal ml-1 ${muted}`}>({pct(portfolio.pnlPct)})</span>
            </p>
          </div>
        </div>
      </div>
      <div className={`flex items-center gap-2 mt-5 pt-4 border-t ${dark ? 'border-gray-700' : 'border-gray-100'}`}>
        <span className="w-2 h-2 rounded-full bg-emerald-500 live-dot" />
        <span className={`text-xs ${muted}`}>Agent running · Updated just now</span>
        <span className={`ml-auto text-xs ${dark ? 'text-gray-600' : 'text-gray-300'}`}>BTC/USDT · Simulation Mode</span>
      </div>
    </div>
  );
};
