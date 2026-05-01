import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { portfolioApi } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { PriceChart } from '../components/ui/PriceChart';

const formatCurrency = (value) => `$${Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

export default function PortfolioPage() {
  const { token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [analytics, setAnalytics] = useState(null);

  const tab = searchParams.get('tab') || 'overview';

  useEffect(() => {
    let active = true;
    portfolioApi.analytics(token).then((payload) => {
      if (active) {
        setAnalytics(payload);
      }
    }).catch(() => {
      if (active) {
        setAnalytics(null);
      }
    });
    return () => {
      active = false;
    };
  }, [token]);

  const equityPoints = useMemo(
    () => (analytics?.equity_curve || []).map((point) => ({ ...point, timestamp: point.timestamp })),
    [analytics]
  );

  const failingStrategies = (analytics?.strategy_performance || []).filter((item) => item.state === 'failing');
  const promisingStrategies = (analytics?.strategy_performance || []).filter((item) => item.state === 'promising');

  return (
    <main className="min-h-screen bg-[#080808] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="premium-panel p-6 lg:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-white/34">Unified portfolio and history</p>
              <h1 className="mt-4 text-5xl font-black leading-[0.92] tracking-[-0.04em] text-white sm:text-6xl">
                One command center for positions, history, and strategy memory.
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-white/46">
                This page now combines holdings, execution history, realized and unrealized P&L, plus a forward-looking strategy read on what is failing now and what is likely to work next.
              </p>
            </div>
            <div className="grid gap-px bg-white/10 sm:grid-cols-2">
              {[
                ['Portfolio value', formatCurrency(analytics?.summary?.total_value)],
                ['Total P&L', formatCurrency(analytics?.summary?.total_pnl)],
                ['Win rate', `${analytics?.summary?.win_rate || 0}%`],
                ['Cash balance', formatCurrency(analytics?.summary?.cash_balance)],
              ].map(([label, value]) => (
                <div key={label} className="bg-[#101010] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/34">{label}</p>
                  <p className="mt-3 text-2xl font-black text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[
            ['Invested', formatCurrency(analytics?.summary?.invested)],
            ['Realized P&L', formatCurrency(analytics?.summary?.realized_pnl)],
            ['Unrealized P&L', formatCurrency(analytics?.summary?.unrealized_pnl)],
            ['Best trade', formatCurrency(analytics?.summary?.best_trade)],
            ['Worst trade', formatCurrency(analytics?.summary?.worst_trade)],
          ].map(([label, value]) => (
            <div key={label} className="premium-panel p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/34">{label}</p>
              <p className="mt-3 text-xl font-black text-white">{value}</p>
            </div>
          ))}
        </section>

        <section className="premium-panel p-5">
          <div className="mb-5 flex flex-wrap gap-2">
            {[
              ['overview', 'Overview'],
              ['history', 'History'],
              ['strategies', 'Strategies'],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setSearchParams({ tab: value })}
                className={`border px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] ${
                  tab === value ? 'border-white bg-white text-black' : 'border-white/10 text-white/45'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === 'overview' ? (
            <div className="space-y-8">
              <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
                <PriceChart points={equityPoints} color="#6ee7b7" height={300} />
                <div className="space-y-3">
                  {(analytics?.allocation || []).map((item) => (
                    <div key={item.symbol} className="border border-white/10 bg-white/[0.03] p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-black text-white">{item.symbol}</p>
                        <p className="text-sm text-white/45">{item.allocation}%</p>
                      </div>
                      <p className="mt-1 text-xs text-white/35">{item.name}</p>
                      <p className="mt-3 text-lg font-semibold text-white">{formatCurrency(item.value)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="premium-panel p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/34">Current holdings</p>
                <div className="mt-5 space-y-3">
                  {(analytics?.holdings || []).map((position) => {
                    const pnl = (position.current_price - position.entry_price) * position.amount;
                    return (
                      <div key={position.id} className="flex items-center justify-between border border-white/10 bg-white/[0.03] px-4 py-4">
                        <div>
                          <p className="text-sm font-black text-white">{position.name}</p>
                          <p className="text-xs text-white/35">{position.amount} {position.symbol} at {formatCurrency(position.entry_price)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-white">{formatCurrency(position.amount * position.current_price)}</p>
                          <p className={`text-xs font-bold ${pnl >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                            {pnl >= 0 ? '+' : ''}{formatCurrency(pnl)} | {position.allocation}%
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}

          {tab === 'history' ? (
            <div className="space-y-3">
              {(analytics?.history || []).map((trade) => (
                <div key={trade.id} className="border border-white/10 bg-white/[0.03] px-4 py-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-sm font-black text-white">{trade.action} {trade.symbol}</p>
                    <span className="text-xs text-white/35">{trade.strategy}</span>
                    <span className="ml-auto text-xs text-white/35">{new Date(trade.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="mt-2 text-sm text-white/48">{trade.reason}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                    <span className="text-white/55">Entry {formatCurrency(trade.price)}</span>
                    <span className="text-white/55">Current {formatCurrency(trade.current_price)}</span>
                    <span className={trade.pnl >= 0 ? 'text-emerald-300 font-bold' : 'text-red-300 font-bold'}>
                      {trade.pnl >= 0 ? '+' : ''}{formatCurrency(trade.pnl)} ({trade.pnl_pct}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {tab === 'strategies' ? (
            <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
              <div className="space-y-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/34">Strategy scorecard</p>
                {(analytics?.strategy_performance || []).map((item) => (
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
                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-white/35">
                      <span>{item.trade_count} trades</span>
                      <span>{Math.round(item.win_rate * 100)}% wins</span>
                      <span>{formatCurrency(item.realized_pnl)}</span>
                      <span>{item.recent_streak > 0 ? '+' : ''}{item.recent_streak} streak</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/34">Failing now</p>
                  <div className="mt-4 space-y-3">
                    {failingStrategies.map((item) => (
                      <div key={item.strategy} className="border border-red-300/15 bg-red-300/8 p-4">
                        <p className="text-sm font-black text-red-100">{item.strategy}</p>
                        <p className="mt-2 text-sm text-red-100/70">{item.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/34">Could work next</p>
                  <div className="mt-4 space-y-3">
                    {promisingStrategies.map((item) => (
                      <div key={item.strategy} className="border border-emerald-300/15 bg-emerald-300/8 p-4">
                        <p className="text-sm font-black text-emerald-100">{item.strategy}</p>
                        <p className="mt-2 text-sm text-emerald-100/70">{item.summary}</p>
                      </div>
                    ))}
                    {(analytics?.future_opportunities || []).map((item) => (
                      <div key={item.title} className="border border-white/10 bg-white/[0.03] p-4">
                        <p className="text-sm font-black text-white">{item.title}</p>
                        <p className="mt-2 text-sm text-white/48">{item.summary}</p>
                        <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-white/35">
                          Opportunity score {Math.round(Number(item.score) * 100)}%
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
