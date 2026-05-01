import { useState } from 'react';

const ARTICLES = [
  {
    id: 1,
    category: 'Market Analysis',
    title: 'Bitcoin Breaks $60K: How CryptoPilot turns volatility into a disciplined entry map',
    excerpt: 'A strategy note on live breadth, momentum, and why RSI context matters more than raw price excitement.',
    author: 'Sarah Chen',
    date: 'Apr 28, 2026',
  },
  {
    id: 2,
    category: 'AI Trading',
    title: 'Why strategy memory matters more than a pretty signal',
    excerpt: 'The strongest trading systems remember where they fail, not just where they win.',
    author: 'Dr. Michael Torres',
    date: 'Apr 25, 2026',
  },
  {
    id: 3,
    category: 'Education',
    title: 'Reading RSI and DCA states the right way',
    excerpt: 'Green should mean a favorable setup. Red should mean restraint. Anything else is noise.',
    author: 'Emily Rodriguez',
    date: 'Apr 21, 2026',
  },
];

const REVIEWS = [
  {
    id: 1,
    name: 'Marcus Chen',
    role: 'Crypto Trader',
    text: 'CryptoPilot feels like a polished trading cockpit instead of a toy dashboard. The strategy breakdowns are the difference-maker.',
    platform: 'Trustpilot',
  },
  {
    id: 2,
    name: 'Sarah Williams',
    role: 'DeFi Investor',
    text: 'The portfolio and history merge makes this much easier to use. I can see what happened, why it happened, and what the AI wants next.',
    platform: 'Product Hunt',
  },
  {
    id: 3,
    name: 'James Rodriguez',
    role: 'Day Trader',
    text: 'The UI finally feels premium. Markets, dashboard, and settings all look like the same serious product now.',
    platform: 'G2',
  },
];

export default function InsightsPage() {
  const [tab, setTab] = useState('articles');

  return (
    <main className="min-h-screen bg-[#080808] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="premium-panel p-6 lg:p-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/34">Insights</p>
          <h1 className="mt-4 text-5xl font-black leading-[0.92] tracking-[-0.04em] text-white sm:text-6xl">
            Research and proof in one premium surface.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/46">
            This single route replaces the old split blog and reviews pages with a more product-grade editorial space.
          </p>
          <div className="mt-6 flex gap-2">
            {[
              ['articles', 'Articles'],
              ['reviews', 'Reviews'],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setTab(value)}
                className={`border px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] ${
                  tab === value ? 'border-white bg-white text-black' : 'border-white/10 text-white/45'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        {tab === 'articles' ? (
          <section className="grid gap-px bg-white/10 md:grid-cols-2 xl:grid-cols-3">
            {ARTICLES.map((article) => (
              <article key={article.id} className="bg-[#0d0d0d] p-6 transition-colors hover:bg-[#111]">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/34">{article.category}</p>
                <h2 className="mt-4 text-2xl font-black leading-tight tracking-[-0.02em] text-white">{article.title}</h2>
                <p className="mt-4 text-sm leading-6 text-white/48">{article.excerpt}</p>
                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-white/32">
                  <span>{article.author}</span>
                  <span>{article.date}</span>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <section className="grid gap-px bg-white/10 md:grid-cols-2 xl:grid-cols-3">
            {REVIEWS.map((review) => (
              <article key={review.id} className="bg-[#0d0d0d] p-6 transition-colors hover:bg-[#111]">
                <p className="text-3xl font-black text-white/20">"</p>
                <p className="mt-4 text-sm leading-7 text-white/52">{review.text}</p>
                <div className="mt-6 border-t border-white/10 pt-4">
                  <p className="text-sm font-black text-white">{review.name}</p>
                  <p className="mt-1 text-xs text-white/35">{review.role}</p>
                  <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/28">{review.platform}</p>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
