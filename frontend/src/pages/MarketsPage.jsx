import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, BarChart3 } from 'lucide-react';
import { marketsApi } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { PriceChart } from '../components/ui/PriceChart';

const SORT_OPTIONS = [
  { value: 'market_cap_desc', label: 'Market cap' },
  { value: 'volume_desc', label: 'Volume' },
  { value: 'id_asc', label: 'Name' },
];

const formatCurrency = (value) => `$${Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

export default function MarketsPage() {
  const { token } = useAuth();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('market_cap_desc');
  const [payload, setPayload] = useState(null);
  const [selectedId, setSelectedId] = useState('bitcoin');
  const [selectedRange, setSelectedRange] = useState('7d');
  const [detail, setDetail] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    let active = true;
    marketsApi.list({ token, search, sort, limit: 60 })
      .then((nextPayload) => {
        if (!active) {
          return;
        }
        setPayload(nextPayload);
        if (!nextPayload.assets.find((asset) => asset.id === selectedId) && nextPayload.assets[0]) {
          setSelectedId(nextPayload.assets[0].id);
        }
      })
      .catch(() => {
        if (active) {
          setPayload(null);
        }
      });
    return () => {
      active = false;
    };
  }, [token, search, sort, selectedId]);

  useEffect(() => {
    let active = true;
    Promise.all([
      marketsApi.detail({ token, assetId: selectedId }),
      marketsApi.history({ token, assetId: selectedId, range: selectedRange }),
    ]).then(([detailPayload, historyPayload]) => {
      if (!active) {
        return;
      }
      setDetail(detailPayload);
      setHistory(historyPayload.points || []);
    }).catch(() => {
      if (active) {
        setDetail(null);
        setHistory([]);
      }
    });
    return () => {
      active = false;
    };
  }, [token, selectedId, selectedRange]);

  const chartPoints = useMemo(() => history.map((point) => ({ ...point, timestamp: point.timestamp })), [history]);
  const assets = payload?.assets || [];
  const global = payload?.global || {};

  return (
    <main className="min-h-screen bg-[#080808] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="premium-panel p-6 lg:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/34">Live markets</p>
              <h1 className="mt-4 text-5xl font-black leading-[0.92] tracking-[-0.04em] text-white sm:text-6xl">
                A premium market terminal for deeper screening.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/46">
                Explore more coins, watch market breadth in real time, and inspect each asset with the same strategy-first visual system as the dashboard.
              </p>
            </div>
            <div className="grid gap-px bg-white/10 sm:grid-cols-2">
              {[
                ['Global market cap', formatCurrency(global.market_cap_usd)],
                ['24h volume', formatCurrency(global.volume_usd)],
                ['BTC dominance', `${Number(global.btc_dominance || 0).toFixed(2)}%`],
                ['Tracked assets', payload?.assets?.length || 0],
              ].map(([label, value]) => (
                <div key={label} className="bg-[#101010] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/34">{label}</p>
                  <p className="mt-3 text-2xl font-black text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <div className="premium-panel p-5">
              <div className="flex flex-col gap-4 lg:flex-row">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="flex-1 border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-white/30"
                  placeholder="Search by asset name or symbol"
                />
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="premium-panel overflow-hidden">
              <div className="grid grid-cols-12 gap-2 border-b border-white/10 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.22em] text-white/34">
                <span className="col-span-4">Asset</span>
                <span className="col-span-2 text-right">Price</span>
                <span className="col-span-2 text-right">24h</span>
                <span className="col-span-2 text-right hidden sm:block">7d</span>
                <span className="col-span-2 text-right">Volume</span>
              </div>
              <div className="max-h-[720px] overflow-auto">
                {assets.map((asset) => (
                  <button
                    key={asset.id}
                    onClick={() => setSelectedId(asset.id)}
                    className={`grid w-full grid-cols-12 gap-2 border-b border-white/10 px-5 py-4 text-left transition-colors hover:bg-white/[0.04] ${
                      selectedId === asset.id ? 'bg-white/[0.04]' : ''
                    }`}
                  >
                    <div className="col-span-4">
                      <p className="text-sm font-black text-white">{asset.name}</p>
                      <p className="text-xs text-white/35">{asset.symbol}</p>
                    </div>
                    <div className="col-span-2 text-right text-sm font-semibold text-white">{formatCurrency(asset.price)}</div>
                    <div className={`col-span-2 text-right text-sm font-bold ${asset.change_24h >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                      {asset.change_24h >= 0 ? '+' : ''}{asset.change_24h.toFixed(2)}%
                    </div>
                    <div className={`col-span-2 hidden text-right text-sm font-bold sm:block ${Number(asset.change_7d || 0) >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                      {Number(asset.change_7d || 0) >= 0 ? '+' : ''}{Number(asset.change_7d || 0).toFixed(2)}%
                    </div>
                    <div className="col-span-2 text-right text-sm text-white/50">{formatCurrency(asset.total_volume)}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            {detail ? (
              <div className="premium-panel p-5">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/34">Selected asset</p>
                    <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white">{detail.asset.name}</h2>
                    <p className="mt-1 text-sm text-white/42">{detail.asset.symbol}</p>
                  </div>
                  <BarChart3 className="text-white/35" size={18} />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/34">Price</p>
                    <p className="mt-2 text-xl font-black text-white">{formatCurrency(detail.asset.price)}</p>
                  </div>
                  <div className="border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/34">RSI</p>
                    <p className={`mt-2 text-xl font-black ${detail.signal_state.rsi === 'good' ? 'text-emerald-200' : detail.signal_state.rsi === 'bad' ? 'text-red-200' : 'text-white'}`}>
                      {detail.market_data.rsi}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  {['7d', '30d'].map((option) => (
                    <button
                      key={option}
                      onClick={() => setSelectedRange(option)}
                      className={`border px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] ${
                        selectedRange === option ? 'border-white bg-white text-black' : 'border-white/10 text-white/45'
                      }`}
                    >
                      {option === '7d' ? '1 week' : '1 month'}
                    </button>
                  ))}
                </div>

                <div className="mt-5">
                  <PriceChart points={chartPoints} color={detail.asset.change_24h >= 0 ? '#6ee7b7' : '#fda4af'} height={220} />
                </div>

                <div className="mt-5 border border-white/10 bg-black/20 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/34">AI recommendation</p>
                  <p className="mt-2 text-2xl font-black text-white">{detail.recommendation.action}</p>
                  <p className="mt-2 text-sm text-white/48">{detail.recommendation.reason}</p>
                </div>

                <div className="mt-5 text-sm text-white/45">
                  {detail.description || 'Live market description unavailable for this asset.'}
                </div>
                {detail.homepage ? (
                  <a href={detail.homepage} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-white/60">
                    Visit project <ArrowUpRight size={14} />
                  </a>
                ) : null}
              </div>
            ) : null}
          </aside>
        </section>
      </div>
    </main>
  );
}
