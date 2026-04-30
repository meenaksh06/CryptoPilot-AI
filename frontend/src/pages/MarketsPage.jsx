import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { assets } from '../data/mockData';
import { ActionBadge } from '../components/ui/Badge';
import { Sparkline } from '../components/ui/Sparkline';

const FILTERS = ['All', 'BUY', 'SELL', 'HOLD'];
const SORTS   = ['Price ↓', 'Price ↑', 'Change ↓', 'Change ↑', 'Confidence ↓'];

export default function MarketsPage() {
  const { darkMode: dark } = useApp();
  const [filter, setFilter] = useState('All');
  const [sort,   setSort]   = useState('Price ↓');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const card   = dark ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-100 text-gray-900';
  const input  = dark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400';
  const muted  = dark ? 'text-gray-400' : 'text-gray-500';
  const pillActive   = 'bg-indigo-600 text-white';
  const pillInactive = dark ? 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-indigo-400 hover:text-indigo-300' : 'bg-white text-gray-500 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600';

  const filtered = assets
    .filter(a => filter === 'All' || a.aiAction === filter)
    .filter(a => a.symbol.toLowerCase().includes(search.toLowerCase()) || a.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'Price ↓') return b.price - a.price;
      if (sort === 'Price ↑') return a.price - b.price;
      if (sort === 'Change ↓') return b.change24h - a.change24h;
      if (sort === 'Change ↑') return a.change24h - b.change24h;
      return b.confidence - a.confidence;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-3xl font-extrabold ${dark ? 'text-white' : 'text-gray-900'}`}>Markets</h1>
        <p className={`mt-1 text-sm ${muted}`}>Live AI signals across all tracked cryptocurrencies</p>
      </div>

      {/* Market overview stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Market Cap', value: '$2.41T', change: '+2.1%', up: true },
          { label: 'BTC Dominance',    value: '52.3%',  change: '+0.4%', up: true },
          { label: 'Fear & Greed',     value: '68 Greed',change: '+5pts',up: true },
          { label: 'Active Signals',   value: '4 BUY / 1 SELL', change: 'RSI driven', up: true },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl border p-4 card-hover ${card}`}>
            <p className={`text-xs uppercase tracking-wider mb-2 ${muted}`}>{s.label}</p>
            <p className="text-xl font-extrabold">{s.value}</p>
            <p className={`text-xs font-semibold mt-1 ${s.up ? 'text-emerald-500' : 'text-red-500'}`}>{s.change}</p>
          </div>
        ))}
      </div>

      {/* Search + filter bar */}
      <div className={`rounded-2xl border p-5 mb-6 ${card}`}>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search coin (BTC, Ethereum...)"
            className={`flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none focus:border-indigo-400 transition-colors ${input}`}
          />
          <select
            value={sort} onChange={e => setSort(e.target.value)}
            className={`px-4 py-2.5 rounded-xl border text-sm outline-none cursor-pointer ${input}`}
          >
            {SORTS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex gap-2 mt-4 flex-wrap">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filter === f ? pillActive : pillInactive}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Full asset table */}
      <div className={`rounded-2xl border overflow-hidden ${card}`}>
        <div className={`grid grid-cols-12 gap-2 px-5 py-3 text-[10px] font-bold uppercase tracking-widest ${muted} border-b ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
          <span className="col-span-4">Asset</span>
          <span className="col-span-2 text-right">Price</span>
          <span className="col-span-2 text-right">24h Change</span>
          <span className="col-span-2 text-right hidden sm:block">7d Trend</span>
          <span className="col-span-1 text-right hidden md:block">Conf.</span>
          <span className="col-span-1 text-right">Signal</span>
        </div>
        {filtered.map((asset, i) => {
          const isUp = asset.change24h >= 0;
          return (
            <button key={asset.id} onClick={() => setSelected(selected === asset.id ? null : asset.id)}
              className={`w-full grid grid-cols-12 gap-2 px-5 py-4 items-center text-left transition-all
                ${dark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}
                ${i !== filtered.length - 1 ? (dark ? 'border-b border-gray-800' : 'border-b border-gray-50') : ''}`}>
              <div className="col-span-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs font-extrabold text-indigo-600 flex-shrink-0">
                  {asset.symbol.slice(0,2)}
                </div>
                <div>
                  <p className="text-sm font-bold">{asset.symbol}</p>
                  <p className={`text-xs ${muted}`}>{asset.name}</p>
                </div>
              </div>
              <div className="col-span-2 text-right">
                <p className="text-sm font-bold">
                  ${asset.price >= 1000 ? asset.price.toLocaleString() : asset.price < 10 ? asset.price.toFixed(3) : asset.price.toFixed(2)}
                </p>
                <p className={`text-xs ${muted}`}>{asset.marketCap}</p>
              </div>
              <div className="col-span-2 text-right">
                <p className={`text-sm font-bold ${isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                  {isUp ? '▲' : '▼'} {Math.abs(asset.change24h).toFixed(2)}%
                </p>
              </div>
              <div className="col-span-2 flex justify-end hidden sm:flex">
                <Sparkline data={asset.sparkline} positive={isUp} />
              </div>
              <div className="col-span-1 text-right hidden md:block">
                <p className={`text-sm font-bold ${asset.aiAction === 'BUY' ? 'text-emerald-500' : asset.aiAction === 'SELL' ? 'text-red-500' : 'text-gray-400'}`}>
                  {asset.confidence}%
                </p>
              </div>
              <div className="col-span-1 flex justify-end">
                <ActionBadge action={asset.aiAction} />
              </div>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-4xl mb-3">🔍</p>
            <p className={`font-semibold ${muted}`}>No assets match your filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
