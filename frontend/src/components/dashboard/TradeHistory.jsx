import { useNavigate } from 'react-router-dom';
import { tradeHistory } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

const fmt = (n, abs = false) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(abs ? Math.abs(n) : n);

export const TradeHistory = ({ limit, onViewAll }) => {
  const { darkMode: dark } = useApp();
  const navigate = useNavigate();
  const trades   = limit ? tradeHistory.slice(0, limit) : tradeHistory;
  const handleViewAll = onViewAll || (() => navigate('/history'));

  const card  = dark ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-100 text-gray-900';
  const muted = dark ? 'text-gray-400' : 'text-gray-500';

  return (
    <section>
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>Trade History</h2>
          <p className={`text-sm mt-0.5 ${muted}`}>Recent AI-executed simulated trades</p>
        </div>
        <button onClick={handleViewAll}
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
          View all →
        </button>
      </div>

      <div className="space-y-3">
        {trades.map((trade) => {
          const isProfit = trade.pnl >= 0;
          const isBuy    = trade.action === 'BUY';
          const stratColor = {
            DCA:        'bg-blue-50 text-blue-600',
            'Stop Loss':'bg-rose-50 text-rose-500',
            Momentum:   'bg-purple-50 text-purple-600',
          }[trade.strategy] || 'bg-indigo-50 text-indigo-600';

          return (
            <div key={trade.id} className={`rounded-2xl border px-5 py-4 card-hover cursor-pointer ${card}`}>
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-extrabold flex-shrink-0 ${
                  isBuy ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        : 'bg-red-50 text-red-500 border border-red-100'}`}>
                  {isBuy ? '↑' : '↓'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-sm font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                      {trade.action} {trade.asset}
                    </span>
                    <span className={`text-xs ${muted}`}>· {trade.amount}</span>
                    <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${stratColor}`}>
                      {trade.strategy}
                    </span>
                  </div>
                  <p className={`text-xs mt-1 leading-relaxed truncate ${muted}`}>💡 {trade.reason}</p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className={`text-xs ${muted}`}>
                      Entry: <span className={`font-semibold ${dark ? 'text-gray-200' : 'text-gray-600'}`}>{fmt(trade.price)}</span>
                    </span>
                    <span className={`text-xs ${muted}`}>· {trade.time}</span>
                    <span className="ml-auto">
                      <span className={`text-sm font-extrabold ${isProfit ? 'text-emerald-600' : 'text-red-500'}`}>
                        {isProfit ? '+' : '-'}{fmt(trade.pnl, true)}
                      </span>
                      <span className={`text-xs font-semibold ml-1 ${isProfit ? 'text-emerald-500' : 'text-red-400'}`}>
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
