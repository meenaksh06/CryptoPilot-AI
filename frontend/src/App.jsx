import { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/dashboard/Navbar';
import { PortfolioSummary } from './components/dashboard/PortfolioSummary';
import { AIDecisionPanel } from './components/dashboard/AIDecisionPanel';
import { AIInsights } from './components/dashboard/AIInsights';
import { CryptoCategories } from './components/dashboard/CryptoCategories';
import { AssetGrid } from './components/dashboard/AssetGrid';
import { TradeHistory } from './components/dashboard/TradeHistory';

// ── Simulated live ticker at the top ─────────────────────────────────────────
const TICKER_ITEMS = [
  { sym: 'BTC', price: 63412, change: +2.34 },
  { sym: 'ETH', price: 3128, change: -1.12 },
  { sym: 'SOL', price: 148.9, change: +5.61 },
  { sym: 'BNB', price: 584, change: +0.87 },
  { sym: 'ADA', price: 0.412, change: -3.20 },
  { sym: 'AVAX', price: 32.18, change: +4.15 },
  { sym: 'DOT', price: 6.82, change: -0.44 },
  { sym: 'MATIC', price: 0.548, change: +1.23 },
];

const TickerBar = () => (
  <div className="bg-gray-900 text-xs font-mono overflow-hidden py-2">
    <div className="flex gap-8 ticker-scroll" style={{ width: 'max-content' }}>
      {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
        <span key={i} className="flex items-center gap-1.5 text-gray-400 whitespace-nowrap px-1">
          <span className="text-white font-bold">{item.sym}</span>
          <span>${item.price.toLocaleString()}</span>
          <span className={item.change >= 0 ? 'text-emerald-400' : 'text-red-400'}>
            {item.change >= 0 ? '▲' : '▼'} {Math.abs(item.change).toFixed(2)}%
          </span>
        </span>
      ))}
    </div>
  </div>
);

// ── Live activity feed (right panel) ─────────────────────────────────────────
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

const ActivityFeed = ({ feed }) => (
  <aside className="hidden xl:flex flex-col w-72 flex-shrink-0">
    <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-20">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-bold text-gray-900">Agent Activity</h3>
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
                <p className={`text-xs font-semibold leading-snug ${s.text}`}>{item.text}</p>
                <p className="text-[10px] text-gray-300 mt-0.5">{item.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </aside>
);

// ── Footer ────────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer className="border-t border-gray-100 bg-white mt-12">
    <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center">
          <span className="text-white text-[9px] font-extrabold">CP</span>
        </div>
        <span className="text-sm font-bold text-gray-700">CryptoPilot AI</span>
        <span className="text-xs text-gray-400">· Simulation Mode · Not financial advice</span>
      </div>
      <div className="flex items-center gap-4 text-xs text-gray-400">
        <span>Powered by FastAPI + React</span>
        <span>·</span>
        <span>Agentic Decision Engine v2</span>
      </div>
    </div>
  </footer>
);

// ── Root App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [feed, setFeed] = useState(FEED_INITIAL);
  const nextId = useRef(FEED_INITIAL.length + 1);

  // Simulate new feed items every ~4 seconds
  useEffect(() => {
    const messages = [
      { text: 'BTC trend analysis updated — Bullish', type: 'info' },
      { text: 'Buy signal triggered on SOL', type: 'buy' },
      { text: 'High RSI warning on BNB (71.2)', type: 'warn' },
      { text: 'DCA cycle completed for ETH', type: 'info' },
      { text: 'Stop-loss threshold updated to 5%', type: 'warn' },
      { text: 'Sell signal on ADA — momentum loss', type: 'sell' },
      { text: 'Agent selected RSI strategy', type: 'info' },
      { text: 'Market sentiment shifted to Bullish', type: 'buy' },
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
    <div className={darkMode ? 'dark' : ''}>
      {/* Ticker */}
      <TickerBar />

      {/* Nav */}
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Page */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex gap-8">
        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-8">
          {/* 1 — Portfolio Summary */}
          <PortfolioSummary />

          {/* 2 — AI Decision (most prominent) */}
          <section>
            <div className="flex items-end justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">AI Decision Panel</h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  Agent's latest reasoning — refreshed every 2s
                </p>
              </div>
              <span className="text-xs bg-indigo-50 text-indigo-600 font-semibold px-3 py-1.5 rounded-full border border-indigo-100">
                Strategy: RSI Neural v2
              </span>
            </div>
            <AIDecisionPanel />
          </section>

          {/* 3 — AI Insights grid */}
          <AIInsights />

          {/* 4 — Categories */}
          <CryptoCategories />

          {/* 5 — Asset grid/list */}
          <AssetGrid />

          {/* 6 — Trade history */}
          <TradeHistory />
        </div>

        {/* Right sidebar — live activity */}
        <ActivityFeed feed={feed} />
      </div>

      <Footer />

      {/* Ticker animation via inline style */}

    </div>
  );
}
