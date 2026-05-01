import { useState } from 'react';
import { useApp } from '../context/AppContext';

const BLOG_POSTS = [
  {
    id: 1,
    category: 'Market Analysis',
    title: 'Bitcoin Breaks $60K: What Experts Predict for Q2 2026',
    excerpt: 'Analysis of the recent bull run and what technical indicators suggest for the coming quarter.',
    author: 'Sarah Chen',
    date: 'Apr 28, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&h=250&fit=crop'
  },
  {
    id: 2,
    category: 'AI Trading',
    title: 'How Neural Networks Predict Crypto Market Movements',
    excerpt: 'Deep dive into the AI models powering CryptoPilot and their accuracy rates.',
    author: 'Dr. Michael Torres',
    date: 'Apr 25, 2026',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=250&fit=crop'
  },
  {
    id: 3,
    category: 'Strategy',
    title: 'Dollar-Cost Averaging vs. AI-Triggered Buys: A Comparison',
    excerpt: 'Backtested results comparing traditional DCA with AI-optimized entry points.',
    author: 'James Wilson',
    date: 'Apr 22, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop'
  },
  {
    id: 4,
    category: 'Security',
    title: 'Best Practices for Securing Your Crypto Assets in 2026',
    excerpt: 'Essential security measures every crypto trader should implement.',
    author: 'Emily Rodriguez',
    date: 'Apr 18, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=250&fit=crop'
  },
  {
    id: 5,
    category: 'DeFi',
    title: 'Yield Farming Strategies: Risks and Rewards Explained',
    excerpt: 'Understanding the DeFi landscape and how to maximize yields safely.',
    author: 'Alex Kim',
    date: 'Apr 15, 2026',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=400&h=250&fit=crop'
  },
  {
    id: 6,
    category: 'Education',
    title: 'Understanding RSI, MACD, and Other Key Technical Indicators',
    excerpt: 'A comprehensive guide to the technical indicators used by our AI engine.',
    author: 'Sarah Chen',
    date: 'Apr 12, 2026',
    readTime: '10 min read',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop'
  }
];

const CATEGORIES = ['All', 'Market Analysis', 'AI Trading', 'Strategy', 'Security', 'DeFi', 'Education'];

export default function BlogPage() {
  const { darkMode: dark } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold mb-4">
          📝 Crypto Insights
        </span>
        <h1 className={`text-4xl md:text-5xl font-bold ${dark ? 'text-white' : 'text-gray-900'} mb-4`}>
          Latest Articles & Updates
        </h1>
        <p className={`text-lg ${dark ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
          Stay informed with the latest crypto market analysis, trading strategies, and AI insights
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : dark ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full md:w-72 px-4 py-2.5 rounded-xl border ${
              dark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        </div>
      </div>

      {/* Featured Post */}
      {selectedCategory === 'All' && searchQuery === '' && (
        <div className="mb-12">
          <div className={`relative overflow-hidden rounded-3xl ${dark ? 'bg-gray-800' : 'bg-white'} border ${dark ? 'border-gray-700' : 'border-gray-100'} shadow-xl`}>
            <div className="grid md:grid-cols-2">
              <div className="relative h-64 md:h-auto">
                <img 
                  src={BLOG_POSTS[0].image} 
                  alt={BLOG_POSTS[0].title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/60" />
              </div>
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <span className="inline-block self-start px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold mb-4">
                  {BLOG_POSTS[0].category}
                </span>
                <h2 className={`text-2xl md:text-3xl font-bold ${dark ? 'text-white' : 'text-gray-900'} mb-4`}>
                  {BLOG_POSTS[0].title}
                </h2>
                <p className={`${dark ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
                  {BLOG_POSTS[0].excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {BLOG_POSTS[0].author[0]}
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>{BLOG_POSTS[0].author}</p>
                      <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-500'}`}>{BLOG_POSTS[0].date}</p>
                    </div>
                  </div>
                  <span className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{BLOG_POSTS[0].readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blog Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post, i) => (
          <article 
            key={post.id}
            className={`group rounded-2xl border overflow-hidden transition-all hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 ${
              dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
            }`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="relative h-48 overflow-hidden">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold">
                  {post.category}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className={`text-lg font-bold mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors ${
                dark ? 'text-white' : 'text-gray-900'
              }`}>
                {post.title}
              </h3>
              <p className={`text-sm mb-4 line-clamp-2 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                    {post.author[0]}
                  </div>
                  <span className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{post.author}</span>
                </div>
                <span className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{post.readTime}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📝</div>
          <h3 className={`text-xl font-bold mb-2 ${dark ? 'text-white' : 'text-gray-900'}`}>No articles found</h3>
          <p className={`${dark ? 'text-gray-400' : 'text-gray-600'}`}>Try adjusting your search or filter</p>
        </div>
      )}

      {/* Newsletter */}
      <div className={`mt-16 rounded-3xl p-8 md:p-12 ${dark ? 'bg-gray-800' : 'bg-gradient-to-br from-indigo-50 to-purple-50'} border ${dark ? 'border-gray-700' : 'border-indigo-100'}`}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>
            📬 Subscribe to Our Newsletter
          </h2>
          <p className={`mb-6 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
            Get the latest crypto insights delivered to your inbox weekly
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className={`flex-1 px-4 py-3 rounded-xl border ${
                dark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}