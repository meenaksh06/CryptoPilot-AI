import { useState } from 'react';
import { Grid2X2, List } from 'lucide-react';
import { assets } from '../../data/mockData';
import { ActionBadge } from '../ui/Badge';
import { Sparkline } from '../ui/Sparkline';

const fmtPrice = (price) =>
  price < 10 ? price.toFixed(3) : price >= 1000 ? price.toLocaleString() : price.toFixed(2);

const AssetCard = ({ asset }) => {
  const isUp = asset.change24h >= 0;
  const isBuy = asset.aiAction === 'BUY';
  const isSell = asset.aiAction === 'SELL';

  return (
    <div className="premium-panel card-hover p-5">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-white/10 bg-white/[0.04] text-xs font-black text-white">
            {asset.symbol.slice(0, 2)}
          </div>
          <div>
            <p className="text-sm font-black leading-tight text-white">{asset.symbol}</p>
            <p className="text-xs text-white/38">{asset.name}</p>
          </div>
        </div>
        <ActionBadge action={asset.aiAction} />
      </div>

      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-2xl font-black tracking-tight text-white">${fmtPrice(asset.price)}</p>
          <p className={`mt-1 text-xs font-bold ${isUp ? 'text-emerald-300' : 'text-red-300'}`}>
            {isUp ? '+' : '-'}{Math.abs(asset.change24h).toFixed(2)}% today
          </p>
        </div>
        <Sparkline data={asset.sparkline} positive={isUp} />
      </div>

      <div className="mb-4 h-px bg-white/10" />

      <div className="flex items-center justify-between gap-4">
        <span className="text-xs uppercase tracking-[0.16em] text-white/35">Confidence</span>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-20 overflow-hidden bg-white/10">
            <div
              className={`h-full ${isBuy ? 'bg-emerald-300' : isSell ? 'bg-red-300' : 'bg-white/45'}`}
              style={{ width: `${asset.confidence}%` }}
            />
          </div>
          <span className={`text-xs font-bold ${isBuy ? 'text-emerald-300' : isSell ? 'text-red-300' : 'text-white/45'}`}>
            {asset.confidence}%
          </span>
        </div>
      </div>

      <p className="mt-4 text-right text-[10px] uppercase tracking-[0.18em] text-white/25">
        Mkt cap {asset.marketCap}
      </p>
    </div>
  );
};

export const AssetGrid = () => {
  const [view, setView] = useState('grid');

  return (
    <section>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-[-0.02em] text-white">Assets</h2>
          <p className="mt-1 text-sm text-white/42">AI-powered signals on every coin</p>
        </div>
        <div className="flex border border-white/10 bg-white/[0.03] p-1">
          {[
            ['grid', Grid2X2],
            ['list', List],
          ].map(([v, Icon]) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`flex h-8 w-9 items-center justify-center transition-all ${
                view === v ? 'bg-white text-black' : 'text-white/45 hover:text-white'
              }`}
              title={v}
            >
              <Icon size={15} />
            </button>
          ))}
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {assets.map((asset) => <AssetCard key={asset.id} asset={asset} />)}
        </div>
      ) : (
        <div className="space-y-3">
          {assets.map((asset) => {
            const isUp = asset.change24h >= 0;
            return (
              <div key={asset.id} className="premium-panel card-hover flex items-center gap-4 px-5 py-4">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center border border-white/10 bg-white/[0.04] text-xs font-black text-white">
                  {asset.symbol.slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black text-white">
                    {asset.symbol} <span className="text-xs font-medium text-white/38">{asset.name}</span>
                  </p>
                  <p className="text-xs text-white/35">{asset.marketCap}</p>
                </div>
                <div className="hidden justify-end sm:flex">
                  <Sparkline data={asset.sparkline} positive={isUp} />
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">${fmtPrice(asset.price)}</p>
                  <p className={`text-xs font-bold ${isUp ? 'text-emerald-300' : 'text-red-300'}`}>
                    {isUp ? '+' : '-'}{Math.abs(asset.change24h).toFixed(2)}%
                  </p>
                </div>
                <ActionBadge action={asset.aiAction} />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
