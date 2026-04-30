import { useState } from 'react';
import { categories, assets } from '../../data/mockData';
import { SectionHeader } from '../ui/Badge';

export const CryptoCategories = () => {
  const [active, setActive] = useState('trending');

  const activeCategory = categories.find((c) => c.id === active);
  const filteredAssets = assets.filter((a) =>
    activeCategory?.assets.includes(a.symbol)
  );

  return (
    <section>
      <SectionHeader title="Explore" subtitle="Browse crypto by theme" />

      {/* Scrollable tab pills */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1 mb-5">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActive(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
              active === cat.id
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                : 'bg-white text-gray-500 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
            }`}
          >
            <span>{cat.emoji}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Horizontally scrollable cards */}
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {filteredAssets.length > 0 ? (
          filteredAssets.map((asset) => {
            const isUp = asset.change24h >= 0;
            return (
              <div
                key={asset.id}
                className="min-w-[160px] bg-white rounded-2xl border border-gray-100 p-4 card-hover cursor-pointer flex-shrink-0"
              >
                {/* Coin icon placeholder */}
                <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center mb-3 text-xs font-extrabold text-indigo-600">
                  {asset.symbol.slice(0, 2)}
                </div>
                <p className="text-sm font-bold text-gray-900">{asset.symbol}</p>
                <p className="text-xs text-gray-400 mb-3">{asset.name}</p>
                <p className="text-sm font-semibold text-gray-800">
                  ${asset.price < 10 ? asset.price.toFixed(3) : asset.price.toLocaleString()}
                </p>
                <p className={`text-xs font-bold mt-0.5 ${isUp ? 'text-emerald-600' : 'text-red-500'}`}>
                  {isUp ? '▲' : '▼'} {Math.abs(asset.change24h).toFixed(2)}%
                </p>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-gray-400 py-4">No assets in this category</p>
        )}
      </div>
    </section>
  );
};
