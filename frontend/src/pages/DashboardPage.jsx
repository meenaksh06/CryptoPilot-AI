import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Radio, ShieldCheck } from 'lucide-react';
import { PortfolioSummary } from '../components/dashboard/PortfolioSummary';
import { AIDecisionPanel } from '../components/dashboard/AIDecisionPanel';
import { AIInsights } from '../components/dashboard/AIInsights';
import { CryptoCategories } from '../components/dashboard/CryptoCategories';
import { AssetGrid } from '../components/dashboard/AssetGrid';
import { TradeHistory } from '../components/dashboard/TradeHistory';

const FEED_INITIAL = [
  { id: 1, text: 'Agent executed BUY on BTC - RSI oversold', time: 'just now', type: 'buy' },
  { id: 2, text: 'Strategy switched to RSI Mode', time: '30s ago', type: 'info' },
  { id: 3, text: 'Volatility alert on ETH detected', time: '1m ago', type: 'warn' },
  { id: 4, text: 'DCA scheduled for SOL at $148', time: '2m ago', type: 'info' },
  { id: 5, text: 'SELL signal on ADA - trend breakdown', time: '5m ago', type: 'sell' },
];

const typeStyle = {
  buy: { dot: 'bg-emerald-300', text: 'text-emerald-200' },
  sell: { dot: 'bg-red-300', text: 'text-red-200' },
  warn: { dot: 'bg-amber-300', text: 'text-amber-200' },
  info: { dot: 'bg-white/45', text: 'text-white/45' },
};

const ActivityFeed = ({ feed }) => (
  <aside className="hidden w-80 flex-shrink-0 xl:flex xl:flex-col">
    <div className="premium-panel sticky top-24 p-5">
      <div className="mb-7 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.18em] text-white">Agent Activity</h3>
          <p className="mt-1 text-xs text-white/35">Transparent signal flow</p>
        </div>
        <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 live-dot" /> Live
        </span>
      </div>
      <div className="space-y-5">
        {feed.map((item) => {
          const style = typeStyle[item.type] || typeStyle.info;
          return (
            <div key={item.id} className="grid grid-cols-[10px_1fr] gap-3">
              <span className={`mt-1.5 h-2 w-2 rounded-full ${style.dot}`} />
              <div>
                <p className={`text-xs font-semibold leading-5 ${style.text}`}>{item.text}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/25">{item.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </aside>
);

const DashboardHero = () => (
  <section className="premium-panel overflow-hidden p-6 lg:p-8">
    <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
      <div>
        <div className="mb-6 flex items-center gap-4">
          <span className="h-px w-12 bg-white/25" />
          <span className="text-[11px] font-bold uppercase tracking-[0.32em] text-white/35">AI command center</span>
        </div>
        <h1 className="max-w-3xl text-5xl font-black leading-[0.92] tracking-[-0.04em] text-white sm:text-6xl">
          Intelligence for disciplined crypto decisions.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-white/48">
          Monitor portfolio value, agent rationale, market signals, and simulated execution from one refined cockpit.
        </p>
      </div>
      <div className="grid gap-px bg-white/10">
        {[
          ['Strategy', 'RSI Neural v2', Radio],
          ['Risk State', 'Controlled', ShieldCheck],
        ].map(([label, value, Icon]) => (
          <div key={label} className="flex items-center gap-4 bg-[#101010] p-4">
            <div className="flex h-10 w-10 items-center justify-center border border-white/10 bg-white/[0.04] text-white/50">
              <Icon size={17} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/30">{label}</p>
              <p className="mt-1 text-sm font-black text-white">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default function DashboardPage() {
  const [feed, setFeed] = useState(FEED_INITIAL);
  const nextId = useRef(FEED_INITIAL.length + 1);
  const navigate = useNavigate();

  useEffect(() => {
    const messages = [
      { text: 'BTC trend analysis updated - Bullish', type: 'info' },
      { text: 'Buy signal triggered on SOL', type: 'buy' },
      { text: 'High RSI warning on BNB (71.2)', type: 'warn' },
      { text: 'DCA cycle completed for ETH', type: 'info' },
      { text: 'Stop-loss threshold updated to 5%', type: 'warn' },
      { text: 'Sell signal on ADA - momentum loss', type: 'sell' },
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
    <main className="min-h-screen bg-[#080808]">
      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 sm:px-6">
        <div className="min-w-0 flex-1 space-y-8">
          <DashboardHero />
          <PortfolioSummary />

          <section>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-black tracking-[-0.02em] text-white">AI Decision Panel</h2>
                <p className="mt-1 text-sm text-white/42">Agent's latest reasoning</p>
              </div>
              <span className="hidden border border-white/10 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 sm:inline-flex">
                RSI Neural v2
              </span>
            </div>
            <AIDecisionPanel />
          </section>

          <AIInsights />
          <CryptoCategories />

          <div>
            <AssetGrid />
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/markets')}
                className="inline-flex items-center gap-2 bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-black transition-colors hover:bg-white/85"
              >
                View all assets <ArrowUpRight size={15} />
              </button>
            </div>
          </div>

          <TradeHistory limit={3} onViewAll={() => navigate('/history')} />
        </div>
        <ActivityFeed feed={feed} />
      </div>
    </main>
  );
}
