import { useEffect, useMemo, useState } from 'react';
import { Search, TrendingUp } from 'lucide-react';
import { dashboardApi, getApiBaseUrl, marketsApi } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { PriceChart } from '../components/ui/PriceChart';

const formatCurrency = (value) => `$${Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
const wsBase = getApiBaseUrl().replace(/^http/, 'ws');

const StatCard = ({ label, value, tone = 'text-white', subtext }) => (
  <div className="premium-panel p-4">
    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/34">{label}</p>
    <p className={`mt-3 text-2xl font-black tracking-tight ${tone}`}>{value}</p>
    {subtext ? <p className="mt-1 text-xs text-white/38">{subtext}</p> : null}
  </div>
);

const SignalBadge = ({ label, value, state }) => {
  const color = state === 'good'
    ? 'border-emerald-300/20 bg-emerald-300/10 text-emerald-200'
    : state === 'bad'
      ? 'border-red-300/20 bg-red-300/10 text-red-200'
      : 'border-white/10 bg-white/[0.03] text-white/55';

  return (
    <div className={`border px-4 py-3 ${color}`}>
      <p className="text-[10px] font-bold uppercase tracking-[0.2em]">{label}</p>
      <p className="mt-2 text-xl font-black">{value}</p>
    </div>
  );
};

export default function DashboardPage() {
  const { token } = useAuth();
  const [selectedAssetId, setSelectedAssetId] = useState('bitcoin');
  const [range, setRange] = useState('7d');
  const [overview, setOverview] = useState(null);
  const [feed, setFeed] = useState([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    dashboardApi.overview({ token, assetId: selectedAssetId, range })
      .then((payload) => {
        if (active) {
          setOverview(payload);
          setError('');
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [token, selectedAssetId, range]);

  useEffect(() => {
    if (query.trim().length < 2) {
      return undefined;
    }

    let active = true;
    const timer = setTimeout(() => {
      marketsApi.list({ token, search: query, limit: 8 })
        .then((payload) => {
          if (active) {
            setResults(payload.assets || []);
          }
        })
        .catch(() => {
          if (active) {
            setResults([]);
          }
        });
    }, 250);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query, token]);

  useEffect(() => {
    const socket = new WebSocket(`${wsBase}/ws`);
    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        const decision = payload?.decision;
        if (!decision) {
          return;
        }
        setFeed((current) => [
          {
            id: `${decision.timestamp}-${current.length}`,
            text: `${decision.strategy} ${decision.action} on ${payload.market_data.symbol}`,
            time: 'live',
            type: decision.action === 'BUY' ? 'buy' : decision.action === 'SELL' ? 'sell' : 'info',
          },
          ...current,
        ].slice(0, 8));
      } catch {
        // ignore malformed socket payloads
      }
    };
    return () => socket.close();
  }, []);

  const selected = overview?.selected_asset;
  const portfolio = overview?.portfolio;
  const signalState = selected?.signal_state || {};
  const chartPoints = useMemo(
    () => (overview?.selected_history || []).map((point) => ({ ...point, timestamp: point.timestamp })),
    [overview]
  );

  if (loading && !overview) {
    return (
      <main className="min-h-screen bg-[#080808] px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="premium-panel p-8 text-sm text-white/45">Loading live dashboard...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080808] px-4 py-8 sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <section className="premium-panel p-6 lg:p-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-white/34">Live AI command center</p>
                <h1 className="mt-4 max-w-3xl text-5xl font-black leading-[0.92] tracking-[-0.04em] text-white sm:text-6xl">
                  Search any crypto and judge the setup fast.
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-white/46">
                  Live market snapshots, one-week and one-month price context, and strategy signals that read green only when the setup is actually favorable.
                </p>
                <div className="relative mt-8">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35" size={16} />
                  <input
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      if (event.target.value.trim().length < 2) {
                        setResults([]);
                      }
                    }}
                    className="w-full border border-white/10 bg-black/20 px-12 py-4 text-sm text-white outline-none focus:border-white/30"
                    placeholder="Search by coin name or symbol"
                  />
                  {results.length ? (
                    <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 border border-white/10 bg-[#111] shadow-2xl">
                      {results.map((asset) => (
                        <button
                          key={asset.id}
                          onClick={() => {
                            setSelectedAssetId(asset.id);
                            setQuery(asset.name);
                            setResults([]);
                          }}
                          className="flex w-full items-center justify-between border-b border-white/10 px-4 py-3 text-left last:border-b-0 hover:bg-white/[0.04]"
                        >
                          <div>
                            <p className="text-sm font-bold text-white">{asset.name}</p>
                            <p className="text-xs text-white/35">{asset.symbol}</p>
                          </div>
                          <span className="text-sm text-white/45">{formatCurrency(asset.price)}</span>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
                {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
              </div>

              <div className="grid gap-px bg-white/10">
                <div className="bg-[#101010] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/34">Portfolio value</p>
                  <p className="mt-3 text-4xl font-black tracking-tight text-white">{formatCurrency(portfolio?.total_value)}</p>
                  <p className={`mt-2 text-sm font-semibold ${Number(portfolio?.total_pnl || 0) >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                    {Number(portfolio?.total_pnl || 0) >= 0 ? '+' : ''}{formatCurrency(portfolio?.total_pnl)} overall
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-px bg-white/10">
                  <div className="bg-[#101010] p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/34">Win rate</p>
                    <p className="mt-3 text-2xl font-black text-white">{portfolio?.win_rate}%</p>
                  </div>
                  <div className="bg-[#101010] p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/34">Cash balance</p>
                    <p className="mt-3 text-2xl font-black text-white">{formatCurrency(portfolio?.cash_balance)}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {selected ? (
            <section className="premium-panel p-6 lg:p-8">
              <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/34">Tracked asset</p>
                  <h2 className="mt-3 text-4xl font-black tracking-[-0.03em] text-white">
                    {selected.asset.name}
                    <span className="ml-3 text-lg font-medium text-white/42">{selected.asset.symbol}</span>
                  </h2>
                  <p className="mt-2 text-sm text-white/42">Live price {formatCurrency(selected.asset.price)}</p>
                </div>
                <div className="flex gap-2">
                  {['7d', '30d'].map((option) => (
                    <button
                      key={option}
                      onClick={() => setRange(option)}
                      className={`border px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] ${
                        range === option ? 'border-white bg-white text-black' : 'border-white/10 text-white/45'
                      }`}
                    >
                      {option === '7d' ? '1 week' : '1 month'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
                <PriceChart points={chartPoints} color={selected.asset.change_24h >= 0 ? '#6ee7b7' : '#fda4af'} height={320} />
                <div className="space-y-4">
                  <SignalBadge label="RSI" value={selected.market_data.rsi} state={signalState.rsi} />
                  <SignalBadge label="DCA context" value={`${Math.round((selected.market_data.sentiment || 0) * 100)}%`} state={signalState.dca} />
                  <SignalBadge label="Volatility" value={`${((selected.market_data.volatility || 0) * 100).toFixed(2)}%`} state="neutral" />
                  <div className="border border-white/10 bg-black/20 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/34">AI recommendation</p>
                    <p className="mt-3 text-2xl font-black text-white">{selected.recommendation.action}</p>
                    <p className="mt-2 text-sm text-white/48">{selected.recommendation.reason}</p>
                  </div>
                </div>
              </div>
            </section>
          ) : null}

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Invested capital" value={formatCurrency(portfolio?.invested)} />
            <StatCard label="Realized P&L" value={formatCurrency(portfolio?.realized_pnl)} tone={Number(portfolio?.realized_pnl || 0) >= 0 ? 'text-emerald-200' : 'text-red-200'} />
            <StatCard label="Unrealized P&L" value={formatCurrency(portfolio?.unrealized_pnl)} tone={Number(portfolio?.unrealized_pnl || 0) >= 0 ? 'text-emerald-200' : 'text-red-200'} />
            <StatCard label="Best trade" value={formatCurrency(portfolio?.best_trade)} tone="text-emerald-200" />
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <div className="premium-panel p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/34">Featured assets</p>
                  <p className="mt-1 text-sm text-white/42">Fast-moving large caps from the live market feed</p>
                </div>
                <TrendingUp className="text-white/35" size={18} />
              </div>
              <div className="space-y-3">
                {(overview?.featured_assets || []).slice(0, 6).map((asset) => (
                  <button
                    key={asset.id}
                    onClick={() => setSelectedAssetId(asset.id)}
                    className="flex w-full items-center justify-between border border-white/10 bg-white/[0.03] px-4 py-3 text-left hover:bg-white/[0.06]"
                  >
                    <div>
                      <p className="text-sm font-bold text-white">{asset.name}</p>
                      <p className="text-xs text-white/35">{asset.symbol}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">{formatCurrency(asset.price)}</p>
                      <p className={`text-xs font-bold ${asset.change_24h >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                        {asset.change_24h >= 0 ? '+' : ''}{asset.change_24h.toFixed(2)}%
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="premium-panel p-5">
              <div className="mb-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/34">Strategy pulse</p>
                <p className="mt-1 text-sm text-white/42">Which systems are working now and which need restraint</p>
              </div>
              <div className="space-y-3">
                {(overview?.strategy_insights || []).map((item) => (
                  <div key={item.strategy} className="border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-black text-white">{item.strategy}</p>
                      <span className={`text-[10px] font-bold uppercase tracking-[0.18em] ${
                        item.state === 'promising' ? 'text-emerald-300' :
                        item.state === 'failing' ? 'text-red-300' :
                        item.state === 'stable' ? 'text-white/60' : 'text-amber-200'
                      }`}>
                        {item.state}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-white/48">{item.summary}</p>
                    <div className="mt-3 flex items-center gap-4 text-xs text-white/38">
                      <span>{item.trade_count} trades</span>
                      <span>{Math.round(item.win_rate * 100)}% win rate</span>
                      <span>${item.realized_pnl.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="premium-panel p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/34">Activity rail</p>
            <div className="mt-5 space-y-4">
              {feed.length ? feed.map((item) => (
                <div key={item.id} className="border-l border-white/10 pl-4">
                  <p className={`text-sm font-semibold ${item.type === 'buy' ? 'text-emerald-200' : item.type === 'sell' ? 'text-red-200' : 'text-white/60'}`}>
                    {item.text}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/26">{item.time}</p>
                </div>
              )) : <p className="text-sm text-white/42">Waiting for live decision updates.</p>}
            </div>
          </div>

          <div className="premium-panel p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/34">Top movers</p>
            <div className="mt-5 space-y-3">
              {(overview?.top_movers || []).map((asset) => (
                <button
                  key={asset.id}
                  onClick={() => setSelectedAssetId(asset.id)}
                  className="flex w-full items-center justify-between border border-white/10 px-4 py-3 hover:bg-white/[0.04]"
                >
                  <div>
                    <p className="text-sm font-bold text-white">{asset.symbol}</p>
                    <p className="text-xs text-white/35">{asset.name}</p>
                  </div>
                  <p className={`text-sm font-bold ${asset.change_24h >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                    {asset.change_24h >= 0 ? '+' : ''}{asset.change_24h.toFixed(2)}%
                  </p>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
