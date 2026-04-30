import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { tradeHistory } from '../data/mockData';

const EXTENDED_HISTORY = [
  ...tradeHistory,
  { id: 5, action: 'BUY',  asset: 'BNB',  assetName: 'BNB',       amount: '0.5 BNB',   price: 570,   currentPrice: 584,   pnl: +7.00,   pnlPct: +2.46, reason: 'DCA entry point — weekly schedule',         time: '3d ago', strategy: 'DCA'      },
  { id: 6, action: 'SELL', asset: 'ETH',  assetName: 'Ethereum',   amount: '0.8 ETH',   price: 3350,  currentPrice: 3128,  pnl: +177.60, pnlPct: +6.64, reason: 'Resistance rejection at 3,350 confirmed',   time: '4d ago', strategy: 'RSI'      },
  { id: 7, action: 'BUY',  asset: 'AVAX', assetName: 'Avalanche',  amount: '20 AVAX',   price: 28.10, currentPrice: 32.18, pnl: +81.60,  pnlPct: +14.52,reason: 'Breakout above 28 resistance — momentum',    time: '5d ago', strategy: 'Momentum' },
  { id: 8, action: 'SELL', asset: 'BTC',  assetName: 'Bitcoin',    amount: '0.01 BTC',  price: 64200, currentPrice: 63412, pnl: -7.88,   pnlPct: -1.23, reason: 'Short-term take profit at local high',       time: '6d ago', strategy: 'RSI'      },
  { id: 9, action: 'BUY',  asset: 'SOL',  assetName: 'Solana',     amount: '5 SOL',     price: 130.0, currentPrice: 148.9, pnl: +94.50,  pnlPct: +14.54,reason: 'DCA — adding at support level',              time: '7d ago', strategy: 'DCA'      },
  { id:10, action: 'HOLD', asset: 'ADA',  assetName: 'Cardano',    amount: '—',         price: 0.42,  currentPrice: 0.412, pnl: 0,       pnlPct: 0,     reason: 'Neutral RSI — awaiting direction',          time: '8d ago', strategy: 'HOLD'     },
];

const STRATEGY_FILTERS = ['All', 'RSI', 'DCA', 'Stop Loss', 'Momentum', 'HOLD'];
const ACTION_FILTERS   = ['All', 'BUY', 'SELL', 'HOLD'];

export default function HistoryPage() {
  const { darkMode: dark } = useApp();
  const [actionFilter,   setActionFilter]   = useState('All');
  const [strategyFilter, setStrategyFilter] = useState('All');
  const [search,         setSearch]         = useState('');

  const card  = dark ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-100 text-gray-900';
  const input = dark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-800';
  const muted = dark ? 'text-gray-400' : 'text-gray-500';
  const pill  = (active) => active
    ? 'bg-indigo-600 text-white'
    : dark ? 'bg-gray-800 text-gray-400 border border-gray-700' : 'bg-white text-gray-500 border border-gray-200 hover:border-indigo-300';

  const filtered = EXTENDED_HISTORY
    .filter(t => actionFilter   === 'All' || t.action   === actionFilter)
    .filter(t => strategyFilter === 'All' || t.strategy === strategyFilter)
    .filter(t => t.asset.toLowerCase().includes(search.toLowerCase()) || t.assetName.toLowerCase().includes(search.toLowerCase()));

  const totalPnL  = filtered.reduce((s, t) => s + t.pnl, 0);
  const wins      = filtered.filter(t => t.pnl > 0).length;
  const winRate   = filtered.length ? ((wins / filtered.length) * 100).toFixed(0) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <h1 className={`text-3xl font-extrabold ${dark ? 'text-white' : 'text-gray-900'}`}>Trade History</h1>
        <p className={`mt-1 text-sm ${muted}`}>All AI-executed simulated trades with full reasoning</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Trades',  value: filtered.length, color: '' },
          { label: 'Win Rate',      value: `${winRate}%`,   color: 'text-emerald-500' },
          { label: 'Total P&L',     value: `${totalPnL >= 0 ? '+' : ''}$${totalPnL.toFixed(2)}`, color: totalPnL >= 0 ? 'text-emerald-500' : 'text-red-500' },
          { label: 'Best Trade',    value: `+$${Math.max(...filtered.map(t => t.pnl)).toFixed(2)}`, color: 'text-emerald-500' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl border p-5 card-hover ${card}`}>
            <p className={`text-xs uppercase tracking-wider mb-1 ${muted}`}>{s.label}</p>
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className={`rounded-2xl border p-5 ${card}`}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search asset..."
          className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:border-indigo-400 mb-4 ${input}`}
        />
        <div className="flex flex-wrap gap-3">
          <div className="flex gap-2 flex-wrap">
            <span className={`text-xs font-bold uppercase ${muted} self-center`}>Action:</span>
            {ACTION_FILTERS.map(f => (
              <button key={f} onClick={() => setActionFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${pill(actionFilter === f)}`}>{f}</button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className={`text-xs font-bold uppercase ${muted} self-center`}>Strategy:</span>
            {STRATEGY_FILTERS.map(f => (
              <button key={f} onClick={() => setStrategyFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${pill(strategyFilter === f)}`}>{f}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Trade list */}
      <div className="space-y-3">
        {filtered.map(trade => {
          const isProfit = trade.pnl > 0;
          const isBuy    = trade.action === 'BUY';
          const stratColor = trade.strategy === 'DCA' ? 'bg-blue-50 text-blue-600' : trade.strategy === 'Stop Loss' ? 'bg-rose-50 text-rose-500' : trade.strategy === 'Momentum' ? 'bg-purple-50 text-purple-600' : 'bg-indigo-50 text-indigo-600';
          return (
            <div key={trade.id} className={`rounded-2xl border px-5 py-4 card-hover ${card}`}>
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-extrabold flex-shrink-0
                  ${isBuy ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : trade.action === 'SELL' ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-gray-100 text-gray-500'}`}>
                  {isBuy ? '↑' : trade.action === 'SELL' ? '↓' : '⏸'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold">{trade.action} {trade.asset}</span>
                    <span className={`text-xs ${muted}`}>· {trade.amount}</span>
                    <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${stratColor}`}>{trade.strategy}</span>
                  </div>
                  <p className={`text-xs mt-1 leading-relaxed ${muted}`}>💡 {trade.reason}</p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className={`text-xs ${muted}`}>Entry: <span className="font-semibold">${trade.price.toLocaleString()}</span></span>
                    <span className={`text-xs ${muted}`}>· {trade.time}</span>
                    <span className="ml-auto">
                      {trade.pnl !== 0 ? (
                        <>
                          <span className={`text-sm font-extrabold ${isProfit ? 'text-emerald-600' : 'text-red-500'}`}>
                            {isProfit ? '+' : ''}${Math.abs(trade.pnl).toFixed(2)}
                          </span>
                          <span className={`text-xs font-semibold ml-1 ${isProfit ? 'text-emerald-500' : 'text-red-400'}`}>
                            ({isProfit ? '+' : ''}{trade.pnlPct.toFixed(2)}%)
                          </span>
                        </>
                      ) : <span className={`text-sm font-semibold ${muted}`}>No trade</span>}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className={`rounded-2xl border py-16 text-center ${card}`}>
            <p className="text-4xl mb-3">📭</p>
            <p className={`font-semibold ${muted}`}>No trades match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
