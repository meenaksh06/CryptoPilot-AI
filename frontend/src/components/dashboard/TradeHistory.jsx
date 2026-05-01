import { useNavigate } from 'react-router-dom';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { tradeHistory } from '../../data/mockData';

const fmt = (n, abs = false) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(abs ? Math.abs(n) : n);

export const TradeHistory = ({ limit, onViewAll }) => {
  const navigate = useNavigate();
  const trades = limit ? tradeHistory.slice(0, limit) : tradeHistory;
  const handleViewAll = onViewAll || (() => navigate('/history'));

  return (
    <section>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-[-0.02em] text-white">Trade History</h2>
          <p className="mt-1 text-sm text-white/42">Recent AI-executed simulated trades</p>
        </div>
        <button
          onClick={handleViewAll}
          className="text-xs font-bold uppercase tracking-[0.18em] text-white/45 transition-colors hover:text-white"
        >
          View all
        </button>
      </div>

      <div className="space-y-3">
        {trades.map((trade) => {
          const isProfit = trade.pnl >= 0;
          const isBuy = trade.action === 'BUY';
          const Icon = isBuy ? ArrowUp : ArrowDown;
          return (
            <div key={trade.id} className="premium-panel card-hover px-5 py-4">
              <div className="flex items-start gap-4">
                <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center border ${
                  isBuy ? 'border-emerald-300/20 bg-emerald-300/10 text-emerald-200' : 'border-red-300/20 bg-red-300/10 text-red-200'
                }`}>
                  <Icon size={17} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-black text-white">{trade.action} {trade.asset}</span>
                    <span className="text-xs text-white/35">{trade.amount}</span>
                    <span className="ml-auto border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">
                      {trade.strategy}
                    </span>
                  </div>
                  <p className="mt-2 truncate text-xs leading-5 text-white/42">{trade.reason}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <span className="text-xs text-white/35">
                      Entry: <span className="font-semibold text-white/65">{fmt(trade.price)}</span>
                    </span>
                    <span className="text-xs text-white/25">{trade.time}</span>
                    <span className="ml-auto">
                      <span className={`text-sm font-black ${isProfit ? 'text-emerald-300' : 'text-red-300'}`}>
                        {isProfit ? '+' : '-'}{fmt(trade.pnl, true)}
                      </span>
                      <span className={`ml-1 text-xs font-bold ${isProfit ? 'text-emerald-300/75' : 'text-red-300/75'}`}>
                        ({isProfit ? '+' : ''}{trade.pnlPct.toFixed(2)}%)
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
