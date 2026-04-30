import { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/dashboard/Navbar';
import { PortfolioSummary } from './components/dashboard/PortfolioSummary';
import { AIDecisionPanel } from './components/dashboard/AIDecisionPanel';
import { AIInsights } from './components/dashboard/AIInsights';
import { CryptoCategories } from './components/dashboard/CryptoCategories';
import { AssetGrid } from './components/dashboard/AssetGrid';
import { TradeHistory } from './components/dashboard/TradeHistory';
import './index.css';

// Live ticker bar data
const TICKERS = [
  { sym: 'BTC', val: '+2.34%', up: true },
  { sym: 'ETH', val: '-1.12%', up: false },
  { sym: 'SOL', val: '+5.61%', up: true },
  { sym: 'BNB', val: '+0.87%', up: true },
  { sym: 'ADA', val: '-3.20%', up: false },
  { sym: 'AVAX', val: '+4.15%', up: true },
  { sym: 'DOGE', val: '+1.92%', up: true },
  { sym: 'DOT', val: '-0.45%', up: false },
];

const Ticker = () => (
  <div className="bg-gray-900 text-xs py-2 overflow-hidden">
    <div className="flex gap-8 animate-[marquee_20s_linear_infinite] whitespace-nowrap min-w-max px-4">
      {[...TICKERS, ...TICKERS].map((t, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <span className="text-gray-400 font-semibold">{t.sym}</span>
          <span className={t.up ? 'text-emerald-400' : 'text-red-400'}>{t.val}</span>
        </span>
      ))}
    </div>
  </div>
);

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [agentStatus, setAgentStatus] = useState('thinking');

  // Simulate agent cycling through states
  useEffect(() => {
    const states = ['thinking', 'analyzing', 'decided'];
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % states.length;
      setAgentStatus(states[i]);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const statusLabel = {
    thinking:  { text: 'Thinking…',   color: 'text-amber-500',   dot: 'bg-amber-500' },
    analyzing: { text: 'Analyzing…',  color: 'text-blue-500',    dot: 'bg-blue-500'  },
    decided:   { text: 'Decision Ready', color: 'text-emerald-600', dot: 'bg-emerald-500' },
  }[agentStatus];

  return (
    <div className={darkMode ? 'dark' : ''}>
      {/* Scrolling ticker */}
      <style>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>
      <Ticker />

      {/* Navbar */}
      <Navbar darkMode={darkMode} onToggleDark={() => setDarkMode(!darkMode)} />

      {/* Page */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">

        {/* Agent status banner */}
        <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-5 py-3 shadow-sm">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusLabel.dot} live-dot`} />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Agent Status</span>
          <span className={`text-sm font-bold ${statusLabel.color}`}>{statusLabel.text}</span>
          <span className="ml-auto text-xs text-gray-300">Sim mode · BTC/USDT · ₹ Portfolio</span>
        </div>

        {/* 1. Portfolio Summary */}
        <PortfolioSummary />

        {/* 2. AI Decision Panel */}
        <AIDecisionPanel />

        {/* 3. AI Insights Grid */}
        <AIInsights />

        {/* 4. Crypto Categories */}
        <CryptoCategories />

        {/* 5. Asset Cards */}
        <AssetGrid />

        {/* 6. Trade History */}
        <TradeHistory />

        {/* Footer */}
        <footer className="text-center pb-6">
          <p className="text-xs text-gray-300">
            CryptoPilot AI · Simulation Mode · Not financial advice · {new Date().getFullYear()}
          </p>
        </footer>
      </main>
    </div>
  );
}
