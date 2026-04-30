import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PortfolioSummary } from '../components/dashboard/PortfolioSummary';
import { AIDecisionPanel } from '../components/dashboard/AIDecisionPanel';
import { AIInsights } from '../components/dashboard/AIInsights';
import { CryptoCategories } from '../components/dashboard/CryptoCategories';
import { AssetGrid } from '../components/dashboard/AssetGrid';
import { TradeHistory } from '../components/dashboard/TradeHistory';
import { useEffect, useRef, useState } from 'react';

const FEED_INITIAL = [
  { id: 1, text: 'Agent executed BUY on BTC — RSI oversold', time: 'just now', type: 'buy' },
  { id: 2, text: 'Strategy switched to RSI Mode', time: '30s ago', type: 'info' },
  { id: 3, text: 'Volatility alert on ETH detected', time: '1m ago', type: 'warn' },
  { id: 4, text: 'DCA scheduled for SOL at $148', time: '2m ago', type: 'info' },
  { id: 5, text: 'SELL signal on ADA — trend breakdown', time: '5m ago', type: 'sell' },
];
const typeStyle = {
  buy:  { dot: 'bg-emerald-500', text: 'text-emerald-700' },
  sell: { dot: 'bg-red-500',     text: 'text-red-600' },
  warn: { dot: 'bg-amber-400',   text: 'text-amber-700' },
  info: { dot: 'bg-indigo-400',  text: 'text-indigo-600' },
};

const ActivityFeed = ({ feed, dark }) => (
  <aside className="hidden xl:flex flex-col w-72 flex-shrink-0">
    <div className={`rounded-2xl border p-5 sticky top-20 ${dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
      <div className="flex items-center justify-between mb-5">
        <h3 className={`text-sm font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>Agent Activity</h3>
        <span className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 live-dot" /> Live
        </span>
      </div>
      <div className="space-y-4">
        {feed.map((item) => {
          const s = typeStyle[item.type] || typeStyle.info;
          return (
            <div key={item.id} className="flex gap-3 items-start">
              <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${s.dot}`} />
              <div>
                <p className={`text-xs font-semibold leading-snug ${dark ? 'text-gray-300' : s.text}`}>{item.text}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{item.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </aside>
);

export default function DashboardPage() {
  const { darkMode: dark } = useApp();
  const [feed, setFeed] = useState(FEED_INITIAL);
  const nextId = useRef(FEED_INITIAL.length + 1);
  const navigate = useNavigate();

  useEffect(() => {
    const messages = [
      { text: 'BTC trend analysis updated — Bullish', type: 'info' },
      { text: 'Buy signal triggered on SOL', type: 'buy' },
      { text: 'High RSI warning on BNB (71.2)', type: 'warn' },
      { text: 'DCA cycle completed for ETH', type: 'info' },
      { text: 'Stop-loss threshold updated to 5%', type: 'warn' },
      { text: 'Sell signal on ADA — momentum loss', type: 'sell' },
    ];
    let idx = 0;
    const timer = setInterval(() => {
      const msg = messages[idx % messages.length];
      setFeed((prev) => [
        { id: nextId.current++, text: msg.text, time: 'just now', type: msg.type },
        ...prev.slice(0, 7),
      ]);
      idx++;
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex gap-8">
      <div className="flex-1 min-w-0 space-y-8">
        <PortfolioSummary />

        <section>
          <div className="flex items-end justify-between mb-5">
            <div>
              <h2 className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>AI Decision Panel</h2>
              <p className="text-sm text-gray-400 mt-0.5">Agent's latest reasoning — refreshed every 2s</p>
            </div>
            <span className="text-xs bg-indigo-50 text-indigo-600 font-semibold px-3 py-1.5 rounded-full border border-indigo-100">
              Strategy: RSI Neural v2
            </span>
          </div>
          <AIDecisionPanel />
        </section>

        <AIInsights />
        <CryptoCategories />

        {/* Asset grid with "See all" */}
        <div>
          <AssetGrid />
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/markets')}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
            >
              View all assets in Markets →
            </button>
          </div>
        </div>

        {/* Trade history with working "View all" */}
        <TradeHistory limit={3} onViewAll={() => navigate('/history')} />
      </div>
      <ActivityFeed feed={feed} dark={dark} />
    </div>
  );
}
