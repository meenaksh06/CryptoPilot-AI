import { useState } from 'react';
import { assets } from '../../data/mockData';
import { ActionBadge } from '../ui/Badge';
import { Sparkline } from '../ui/Sparkline';
import { useApp } from '../../context/AppContext';

const AssetCard = ({ asset, dark }) => {
  const isUp  = asset.change24h >= 0;
  const isBuy  = asset.aiAction === 'BUY';
  const isSell = asset.aiAction === 'SELL';
  const card  = dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100';
  const muted = dark ? 'text-gray-400' : 'text-gray-400';

  return (
    <div className={`rounded-2xl border p-5 card-hover cursor-pointer ${card}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs font-extrabold text-indigo-600 flex-shrink-0">
            {asset.symbol.slice(0, 2)}
          </div>
          <div>
            <p className={`text-sm font-bold leading-tight ${dark ? 'text-white' : 'text-gray-900'}`}>{asset.symbol}</p>
            <p className={`text-xs ${muted}`}>{asset.name}</p>
          </div>
        </div>
        <ActionBadge action={asset.aiAction} />
      </div>

      <div className="flex items-end justify-between mb-3">
        <div>
          <p className={`text-xl font-extrabold ${dark ? 'text-white' : 'text-gray-900'}`}>
            ${asset.price < 10 ? asset.price.toFixed(3) : asset.price >= 1000 ? asset.price.toLocaleString() : asset.price.toFixed(2)}
          </p>
          <p className={`text-xs font-bold mt-0.5 flex items-center gap-1 ${isUp ? 'text-emerald-500' : 'text-red-500'}`}>
            {isUp ? '▲' : '▼'} {Math.abs(asset.change24h).toFixed(2)}% today
          </p>
        </div>
        <Sparkline data={asset.sparkline} positive={isUp} />
      </div>

      <div className={`h-px mb-3 ${dark ? 'bg-gray-800' : 'bg-gray-100'}`} />

      <div className="flex items-center justify-between">
        <span className={`text-xs ${muted}`}>AI Confidence</span>
        <div className="flex items-center gap-2">
          <div className={`w-20 h-1.5 rounded-full overflow-hidden ${dark ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isBuy ? 'bg-emerald-500' : isSell ? 'bg-red-500' : 'bg-gray-400'
              }`}
              style={{ width: `${asset.confidence}%` }}
            />
          </div>
          <span className={`text-xs font-bold ${isBuy ? 'text-emerald-500' : isSell ? 'text-red-500' : 'text-gray-400'}`}>
            {asset.confidence}%
          </span>
        </div>
      </div>

      <p className={`text-[10px] mt-3 text-right ${dark ? 'text-gray-700' : 'text-gray-300'}`}>
        Mkt cap {asset.marketCap}
      </p>
    </div>
  );
};

export const AssetGrid = () => {
  const { darkMode: dark } = useApp();
  const [view, setView] = useState('grid');
  const muted = dark ? 'text-gray-400' : 'text-gray-400';

  return (
    <section>
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>Assets</h2>
          <p className={`text-sm mt-0.5 ${muted}`}>AI-powered signals on every coin</p>
        </div>
        <div className={`flex gap-1 rounded-xl p-1 ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}>
          {['grid', 'list'].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                view === v
                  ? dark ? 'bg-gray-700 text-white shadow-sm' : 'bg-white text-gray-800 shadow-sm'
                  : `${muted} hover:text-gray-600`
              }`}
            >
              {v === 'grid' ? '▦ Grid' : '≡ List'}
            </button>
          ))}
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets.map((asset) => <AssetCard key={asset.id} asset={asset} dark={dark} />)}
        </div>
      ) : (
        <div className="space-y-3">
          {assets.map((asset) => {
            const isUp   = asset.change24h >= 0;
            const isBuy  = asset.aiAction === 'BUY';
            const isSell = asset.aiAction === 'SELL';
            const card   = dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100';
            return (
              <div key={asset.id} className={`rounded-2xl border px-5 py-4 card-hover cursor-pointer flex items-center gap-4 ${card}`}>
                <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs font-extrabold text-indigo-600 flex-shrink-0">
                  {asset.symbol.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                    {asset.symbol} <span className={`text-xs font-normal ${muted}`}>{asset.name}</span>
                  </p>
                  <p className={`text-xs ${muted}`}>{asset.marketCap}</p>
                </div>
                <Sparkline data={asset.sparkline} positive={isUp} />
                <div className="text-right">
                  <p className={`text-sm font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                    ${asset.price >= 1000 ? asset.price.toLocaleString() : asset.price.toFixed(3)}
                  </p>
                  <p className={`text-xs font-bold ${isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                    {isUp ? '▲' : '▼'} {Math.abs(asset.change24h).toFixed(2)}%
                  </p>
                </div>
                <ActionBadge action={asset.aiAction} />
                <div className="text-right min-w-[40px]">
                  <p className={`text-xs font-bold ${isBuy ? 'text-emerald-500' : isSell ? 'text-red-500' : 'text-gray-400'}`}>
                    {asset.confidence}%
                  </p>
                  <p className={`text-[10px] ${muted}`}>conf.</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
