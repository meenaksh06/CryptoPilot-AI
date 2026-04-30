import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { assets, portfolio, tradeHistory } from '../data/mockData';
import { ActionBadge } from '../components/ui/Badge';

const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export default function PortfolioPage() {
  const { darkMode: dark } = useApp();
  const navigate = useNavigate();

  const card  = dark ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-100 text-gray-900';
  const muted = dark ? 'text-gray-400' : 'text-gray-500';
  const sub   = dark ? 'bg-gray-800' : 'bg-gray-50';

  const HOLDINGS = [
    { symbol: 'BTC', name: 'Bitcoin',   amount: 0.042, buyPrice: 61200, currentPrice: 63412, allocation: 42 },
    { symbol: 'ETH', name: 'Ethereum',  amount: 1.5,   buyPrice: 3280,  currentPrice: 3128,  allocation: 31 },
    { symbol: 'SOL', name: 'Solana',    amount: 10,    buyPrice: 138.5, currentPrice: 148.9, allocation: 20 },
    { symbol: 'BNB', name: 'BNB',       amount: 0.5,   buyPrice: 570,   currentPrice: 584,   allocation: 7  },
  ];

  const totalInvested = HOLDINGS.reduce((s, h) => s + h.amount * h.buyPrice, 0);
  const totalCurrent  = HOLDINGS.reduce((s, h) => s + h.amount * h.currentPrice, 0);
  const totalPnL      = totalCurrent - totalInvested;
  const totalPct      = ((totalPnL / totalInvested) * 100).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <h1 className={`text-3xl font-extrabold ${dark ? 'text-white' : 'text-gray-900'}`}>Portfolio</h1>
        <p className={`mt-1 text-sm ${muted}`}>Your simulated holdings & performance</p>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Value',  value: fmt(totalCurrent * 83),  sub: 'Current',  color: 'text-gray-900' },
          { label: 'Invested',     value: fmt(totalInvested * 83), sub: 'Cost basis', color: 'text-gray-900' },
          { label: 'Total P&L',    value: `+${fmt(totalPnL * 83)}`, sub: `+${totalPct}% overall`, color: 'text-emerald-600' },
          { label: "Today's P&L",  value: '+₹3,842', sub: '+1.37% today', color: 'text-emerald-600' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl border p-5 card-hover ${card}`}>
            <p className={`text-xs uppercase tracking-wider mb-1 ${muted}`}>{s.label}</p>
            <p className={`text-xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className={`text-xs mt-1 ${muted}`}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Holdings */}
      <div className={`rounded-2xl border ${card}`}>
        <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: dark ? '#1f2937' : '#f3f4f6' }}>
          <h2 className="font-bold text-lg">Holdings</h2>
          <button onClick={() => navigate('/markets')} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">
            + Add position →
          </button>
        </div>
        <div className="divide-y" style={{ '--tw-divide-opacity': 1 }}>
          {HOLDINGS.map(h => {
            const pnl = (h.currentPrice - h.buyPrice) * h.amount;
            const pnlPct = ((h.currentPrice / h.buyPrice - 1) * 100).toFixed(2);
            const isUp = pnl >= 0;
            return (
              <div key={h.symbol} className={`px-5 py-4 flex items-center gap-4 ${dark ? 'border-gray-800' : 'border-gray-50'}`}>
                <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs font-extrabold text-indigo-600 flex-shrink-0">
                  {h.symbol.slice(0,2)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-sm">{h.symbol} <span className={`font-normal text-xs ${muted}`}>{h.name}</span></p>
                      <p className={`text-xs ${muted}`}>{h.amount} units @ ${h.buyPrice.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">${(h.amount * h.currentPrice).toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                      <p className={`text-xs font-bold ${isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                        {isUp ? '+' : ''}${pnl.toFixed(0)} ({isUp ? '+' : ''}{pnlPct}%)
                      </p>
                    </div>
                  </div>
                  {/* Allocation bar */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className={`flex-1 h-1.5 rounded-full ${dark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <div className="h-full rounded-full bg-indigo-500" style={{ width: `${h.allocation}%` }} />
                    </div>
                    <span className={`text-[10px] font-semibold ${muted}`}>{h.allocation}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Allocation chart — visual donut style */}
      <div className={`rounded-2xl border p-6 ${card}`}>
        <h2 className="font-bold text-lg mb-5">Asset Allocation</h2>
        <div className="flex flex-wrap gap-4">
          {HOLDINGS.map((h, i) => {
            const colors = ['bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500'];
            return (
              <div key={h.symbol} className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${colors[i]}`} />
                <span className="text-sm font-semibold">{h.symbol}</span>
                <span className={`text-sm ${muted}`}>{h.allocation}%</span>
              </div>
            );
          })}
        </div>
        <div className="flex h-6 rounded-full overflow-hidden mt-5 gap-0.5">
          {HOLDINGS.map((h, i) => {
            const colors = ['bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500'];
            return <div key={h.symbol} className={`${colors[i]} h-full`} style={{ width: `${h.allocation}%` }} />;
          })}
        </div>
      </div>

      {/* Risk metrics */}
      <div className={`rounded-2xl border p-6 ${card}`}>
        <h2 className="font-bold text-lg mb-5">Risk Dashboard</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { label: 'Portfolio Beta', value: '1.24', note: 'Moderate risk', color: 'text-amber-500' },
            { label: 'Sharpe Ratio',   value: '2.18', note: 'Good risk-adjusted return', color: 'text-emerald-500' },
            { label: 'Max Drawdown',   value: '-8.4%', note: '30-day rolling', color: 'text-red-400' },
          ].map(m => (
            <div key={m.label} className={`p-4 rounded-xl ${sub}`}>
              <p className={`text-xs uppercase tracking-wider mb-2 ${muted}`}>{m.label}</p>
              <p className={`text-2xl font-extrabold ${m.color}`}>{m.value}</p>
              <p className={`text-xs mt-1 ${muted}`}>{m.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
