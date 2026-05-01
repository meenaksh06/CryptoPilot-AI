import { useState } from 'react';
import { Search } from 'lucide-react';

const BLOG_POSTS = [
  {
    id: 1,
    category: 'Market Analysis',
    title: 'Bitcoin Breaks $60K: What Experts Predict for Q2 2026',
    excerpt: 'Analysis of the recent bull run and what technical indicators suggest for the coming quarter.',
    author: 'Sarah Chen',
    date: 'Apr 28, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=900&h=600&fit=crop',
  },
  {
    id: 2,
    category: 'AI Trading',
    title: 'How Neural Networks Predict Crypto Market Movements',
    excerpt: 'A look at the signal models powering CryptoPilot and how they rank confidence.',
    author: 'Dr. Michael Torres',
    date: 'Apr 25, 2026',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=900&h=600&fit=crop',
  },
  {
    id: 3,
    category: 'Strategy',
    title: 'Dollar-Cost Averaging vs. AI-Triggered Buys',
    excerpt: 'Backtested results comparing traditional DCA with AI-optimized entry points.',
    author: 'James Wilson',
    date: 'Apr 22, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=900&h=600&fit=crop',
  },
  {
    id: 4,
    category: 'Security',
    title: 'Best Practices for Securing Your Crypto Assets in 2026',
    excerpt: 'Essential security measures every crypto trader should understand.',
    author: 'Emily Rodriguez',
    date: 'Apr 18, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=900&h=600&fit=crop',
  },
  {
    id: 5,
    category: 'DeFi',
    title: 'Yield Farming Strategies: Risks and Rewards Explained',
    excerpt: 'Understanding the DeFi landscape and how to maximize yields carefully.',
    author: 'Alex Kim',
    date: 'Apr 15, 2026',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=900&h=600&fit=crop',
  },
  {
    id: 6,
    category: 'Education',
    title: 'Understanding RSI, MACD, and Other Key Indicators',
    excerpt: 'A practical guide to the indicators used by the AI decision engine.',
    author: 'Sarah Chen',
    date: 'Apr 12, 2026',
    readTime: '10 min read',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=900&h=600&fit=crop',
  },
];

const CATEGORIES = ['All', 'Market Analysis', 'AI Trading', 'Strategy', 'Security', 'DeFi', 'Education'];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-[#080808] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <section className="mb-12 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-white/35">crypto insights</p>
          <h1 className="mx-auto mt-5 max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.04em] text-white md:text-6xl">
            signal-rich writing for sharper decisions.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/45">
            Market analysis, trading strategy, and AI research from the CryptoPilot desk.
          </p>
        </section>

        <section className="mb-10 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`border px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] transition-all ${
                  selectedCategory === cat
                    ? 'border-white bg-white text-black'
                    : 'border-white/10 bg-white/[0.03] text-white/45 hover:border-white/30 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <label className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search articles"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full border border-white/10 bg-[#111] px-4 py-3 pr-10 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-white/30"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
          </label>
        </section>

        {selectedCategory === 'All' && searchQuery === '' && (
          <section className="premium-panel mb-12 overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="relative min-h-72">
                <img src={BLOG_POSTS[0].image} alt={BLOG_POSTS[0].title} className="absolute inset-0 h-full w-full object-cover opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#101010]" />
              </div>
              <div className="flex flex-col justify-center p-8 md:p-10">
                <span className="mb-5 self-start border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white/50">
                  {BLOG_POSTS[0].category}
                </span>
                <h2 className="text-3xl font-black tracking-[-0.03em] text-white">{BLOG_POSTS[0].title}</h2>
                <p className="mt-4 leading-7 text-white/48">{BLOG_POSTS[0].excerpt}</p>
                <div className="mt-8 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center bg-white text-sm font-black text-black">
                      {BLOG_POSTS[0].author[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{BLOG_POSTS[0].author}</p>
                      <p className="text-xs text-white/35">{BLOG_POSTS[0].date}</p>
                    </div>
                  </div>
                  <span className="text-xs uppercase tracking-[0.16em] text-white/35">{BLOG_POSTS[0].readTime}</span>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="grid gap-px bg-white/10 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <article key={post.id} className="group bg-[#0c0c0c] p-6 transition-colors hover:bg-[#111]">
              <div className="relative mb-5 h-44 overflow-hidden">
                <img src={post.image} alt={post.title} className="h-full w-full object-cover opacity-75 transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute left-4 top-4 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-black">
                  {post.category}
                </span>
              </div>
              <h3 className="text-xl font-black leading-tight tracking-[-0.02em] text-white">{post.title}</h3>
              <p className="mt-3 min-h-14 text-sm leading-6 text-white/45">{post.excerpt}</p>
              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center border border-white/10 bg-white/[0.04] text-xs font-bold text-white">
                    {post.author[0]}
                  </div>
                  <span className="text-sm text-white/48">{post.author}</span>
                </div>
                <span className="text-xs uppercase tracking-[0.16em] text-white/28">{post.readTime}</span>
              </div>
            </article>
          ))}
        </section>

        {filteredPosts.length === 0 && (
          <div className="premium-panel py-16 text-center">
            <h3 className="text-xl font-black text-white">No articles found</h3>
            <p className="mt-2 text-white/42">Try adjusting your search or filter.</p>
          </div>
        )}

        <section className="premium-panel mt-12 p-8 text-center md:p-12">
          <h2 className="text-3xl font-black tracking-[-0.03em] text-white">Get market notes in your inbox.</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/45">Weekly crypto insights, AI strategy notes, and risk reads.</p>
          <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Email address"
              className="flex-1 border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-white/30"
            />
            <button className="bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-black transition-colors hover:bg-white/85">
              Subscribe
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
