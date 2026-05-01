import { useState } from 'react';
import { categories, assets } from '../../data/mockData';

export const CryptoCategories = () => {
  const [active, setActive] = useState('trending');
  const activeCategory = categories.find((category) => category.id === active);
  const filteredAssets = assets.filter((asset) => activeCategory?.assets.includes(asset.symbol));

  return (
    <section>
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="text-xl font-black tracking-[-0.02em] text-white">Explore</h2>
          <p className="mt-1 text-sm text-white/42">Browse crypto by theme</p>
        </div>
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActive(cat.id)}
            className={`whitespace-nowrap border px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] transition-all ${
              active === cat.id
                ? 'border-white bg-white text-black'
                : 'border-white/10 bg-white/[0.03] text-white/45 hover:border-white/30 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {filteredAssets.length > 0 ? (
          filteredAssets.map((asset) => {
            const isUp = asset.change24h >= 0;
            return (
              <div key={asset.id} className="premium-panel min-w-[176px] flex-shrink-0 p-4 card-hover">
                <div className="mb-5 flex h-10 w-10 items-center justify-center border border-white/10 bg-white/[0.04] text-xs font-black text-white">
                  {asset.symbol.slice(0, 2)}
                </div>
                <p className="text-sm font-black text-white">{asset.symbol}</p>
                <p className="mb-4 text-xs text-white/38">{asset.name}</p>
                <p className="text-sm font-bold text-white">
                  ${asset.price < 10 ? asset.price.toFixed(3) : asset.price.toLocaleString()}
                </p>
                <p className={`mt-1 text-xs font-bold ${isUp ? 'text-emerald-300' : 'text-red-300'}`}>
                  {isUp ? '+' : '-'}{Math.abs(asset.change24h).toFixed(2)}%
                </p>
              </div>
            );
          })
        ) : (
          <p className="py-4 text-sm text-white/45">No assets in this category</p>
        )}
      </div>
    </section>
  );
};
