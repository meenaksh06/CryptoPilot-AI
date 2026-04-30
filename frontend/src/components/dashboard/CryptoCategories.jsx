import { useState } from 'react';
import { categories, assets } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export const CryptoCategories = () => {
  const { darkMode: dark } = useApp();
  const [active, setActive] = useState('trending');

  const activeCategory  = categories.find((c) => c.id === active);
  const filteredAssets  = assets.filter((a) => activeCategory?.assets.includes(a.symbol));

  const miniCard = dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100';
  const muted    = dark ? 'text-gray-400' : 'text-gray-400';

  return (
    <section>
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>Explore</h2>
          <p className={`text-sm mt-0.5 ${muted}`}>Browse crypto by theme</p>
        </div>
      </div>

      {/* Tab pills */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1 mb-5">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActive(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
              active === cat.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : dark
                ? 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-indigo-500 hover:text-indigo-300'
                : 'bg-white text-gray-500 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
            }`}
          >
            <span>{cat.emoji}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Asset mini-cards */}
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {filteredAssets.length > 0 ? (
          filteredAssets.map((asset) => {
            const isUp = asset.change24h >= 0;
            return (
              <div key={asset.id} className={`min-w-[160px] rounded-2xl border p-4 card-hover cursor-pointer flex-shrink-0 ${miniCard}`}>
                <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center mb-3 text-xs font-extrabold text-indigo-600">
                  {asset.symbol.slice(0, 2)}
                </div>
                <p className={`text-sm font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>{asset.symbol}</p>
                <p className={`text-xs mb-3 ${muted}`}>{asset.name}</p>
                <p className={`text-sm font-semibold ${dark ? 'text-gray-200' : 'text-gray-800'}`}>
                  ${asset.price < 10 ? asset.price.toFixed(3) : asset.price.toLocaleString()}
                </p>
                <p className={`text-xs font-bold mt-0.5 ${isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                  {isUp ? '▲' : '▼'} {Math.abs(asset.change24h).toFixed(2)}%
                </p>
              </div>
            );
          })
        ) : (
          <p className={`text-sm py-4 ${muted}`}>No assets in this category</p>
        )}
      </div>
    </section>
  );
};
