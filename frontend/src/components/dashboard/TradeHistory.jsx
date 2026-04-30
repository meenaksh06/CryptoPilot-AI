import { tradeHistory } from '../../data/mockData';
import { SectionHeader } from '../ui/Badge';

const fmt = (n, abs = false) => {
  const v = abs ? Math.abs(n) : n;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(v);
};

export const TradeHistory = () => (
  <section>
    <SectionHeader
      title="Trade History"
      subtitle="Recent AI-executed simulated trades"
      action="View all"
    />

    <div className="space-y-3">
      {tradeHistory.map((trade) => {
        const isProfit = trade.pnl >= 0;
        const isBuy = trade.action === 'BUY';

        return (
          <div
            key={trade.id}
            className="bg-white rounded-2xl border border-gray-100 px-5 py-4 card-hover cursor-pointer"
          >
            <div className="flex items-start gap-4">
              {/* Action icon */}
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-extrabold flex-shrink-0 ${
                  isBuy
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    : 'bg-red-50 text-red-500 border border-red-100'
                }`}
              >
                {isBuy ? '↑' : '↓'}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-gray-900">
                    {trade.action} {trade.asset}
                  </span>
                  <span className="text-xs text-gray-400">·</span>
                  <span className="text-xs text-gray-500">{trade.amount}</span>
                  <span
                    className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${
                      trade.strategy === 'DCA'
                        ? 'bg-blue-50 text-blue-600'
                        : trade.strategy === 'Stop Loss'
                        ? 'bg-rose-50 text-rose-500'
                        : 'bg-indigo-50 text-indigo-600'
                    }`}
                  >
                    {trade.strategy}
                  </span>
                </div>

                <p className="text-xs text-gray-400 mt-1 leading-relaxed truncate">
                  💡 {trade.reason}
                </p>

                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className="text-xs text-gray-400">
                    Entry: <span className="font-semibold text-gray-600">{fmt(trade.price)}</span>
                  </span>
                  <span className="text-xs text-gray-300">·</span>
                  <span className="text-xs text-gray-400">{trade.time}</span>
                  <span className="ml-auto">
                    <span
                      className={`text-sm font-extrabold ${
                        isProfit ? 'text-emerald-600' : 'text-red-500'
                      }`}
                    >
                      {isProfit ? '+' : '-'}{fmt(trade.pnl, true)}
                    </span>
                    <span
                      className={`text-xs font-semibold ml-1 ${
                        isProfit ? 'text-emerald-500' : 'text-red-400'
                      }`}
                    >
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
