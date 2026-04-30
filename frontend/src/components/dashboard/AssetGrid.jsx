import { useState } from 'react';
import { assets } from '../../data/mockData';
import { ActionBadge, SectionHeader } from '../ui/Badge';
import { Sparkline } from '../ui/Sparkline';

const AssetCard = ({ asset }) => {
  const isUp = asset.change24h >= 0;
  const isBuy = asset.aiAction === 'BUY';
  const isSell = asset.aiAction === 'SELL';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 card-hover cursor-pointer">
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs font-extrabold text-indigo-600 flex-shrink-0">
            {asset.symbol.slice(0, 2)}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 leading-tight">{asset.symbol}</p>
            <p className="text-xs text-gray-400">{asset.name}</p>
          </div>
        </div>
        <ActionBadge action={asset.aiAction} />
      </div>

      {/* Sparkline + price */}
      <div className="flex items-end justify-between mb-3">
        <div>
          <p className="text-xl font-extrabold text-gray-900">
            ${asset.price < 10
              ? asset.price.toFixed(3)
              : asset.price >= 1000
              ? asset.price.toLocaleString()
              : asset.price.toFixed(2)}
          </p>
          <p className={`text-xs font-bold mt-0.5 flex items-center gap-1 ${isUp ? 'text-emerald-600' : 'text-red-500'}`}>
            {isUp ? '▲' : '▼'} {Math.abs(asset.change24h).toFixed(2)}% today
          </p>
        </div>
        <Sparkline data={asset.sparkline} positive={isUp} />
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 mb-3" />

      {/* AI Confidence row */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">AI Confidence</span>
        <div className="flex items-center gap-2">
          <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isBuy ? 'bg-emerald-500' : isSell ? 'bg-red-500' : 'bg-gray-400'
              }`}
              style={{ width: `${asset.confidence}%` }}
            />
          </div>
          <span className={`text-xs font-bold ${isBuy ? 'text-emerald-600' : isSell ? 'text-red-500' : 'text-gray-500'}`}>
            {asset.confidence}%
          </span>
        </div>
      </div>

      {/* Market cap */}
      <p className="text-[10px] text-gray-300 mt-3 text-right">Mkt cap {asset.marketCap}</p>
    </div>
  );
};

export const AssetGrid = () => {
  const [view, setView] = useState('grid');

  return (
    <section>
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Assets</h2>
          <p className="text-sm text-gray-400 mt-0.5">AI-powered signals on every coin</p>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setView('grid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              view === 'grid' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            ▦ Grid
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              view === 'list' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            ≡ List
          </button>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {assets.map((asset) => {
            const isUp = asset.change24h >= 0;
            const isBuy = asset.aiAction === 'BUY';
            const isSell = asset.aiAction === 'SELL';
            return (
              <div
                key={asset.id}
                className="bg-white rounded-2xl border border-gray-100 px-5 py-4 card-hover cursor-pointer flex items-center gap-4"
              >
                <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs font-extrabold text-indigo-600 flex-shrink-0">
                  {asset.symbol.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900">{asset.symbol}
                    <span className="text-xs font-normal text-gray-400 ml-1">{asset.name}</span>
                  </p>
                  <p className="text-xs text-gray-400">{asset.marketCap}</p>
                </div>
                <Sparkline data={asset.sparkline} positive={isUp} />
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">
                    ${asset.price >= 1000 ? asset.price.toLocaleString() : asset.price.toFixed(3)}
                  </p>
                  <p className={`text-xs font-bold ${isUp ? 'text-emerald-600' : 'text-red-500'}`}>
                    {isUp ? '▲' : '▼'} {Math.abs(asset.change24h).toFixed(2)}%
                  </p>
                </div>
                <ActionBadge action={asset.aiAction} />
                <div className="text-right min-w-[40px]">
                  <p className={`text-xs font-bold ${isBuy ? 'text-emerald-600' : isSell ? 'text-red-500' : 'text-gray-400'}`}>
                    {asset.confidence}%
                  </p>
                  <p className="text-[10px] text-gray-300">conf.</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
