import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Marcus Chen',
    role: 'Crypto Trader',
    avatar: 'MC',
    rating: 5,
    text: 'CryptoPilot AI has completely transformed my trading strategy. The AI signals have been incredibly accurate, and I\'ve seen a 40% increase in my portfolio since using it.',
    platform: 'Trustpilot',
    date: 'Apr 15, 2026'
  },
  {
    id: 2,
    name: 'Sarah Williams',
    role: 'DeFi Investor',
    avatar: 'SW',
    rating: 5,
    text: 'The risk management features are top-notch. I sleep better knowing my portfolio is protected by automated stop-losses. Best crypto tool I\'ve used.',
    platform: 'Product Hunt',
    date: 'Apr 12, 2026'
  },
  {
    id: 3,
    name: 'James Rodriguez',
    role: 'Day Trader',
    avatar: 'JR',
    rating: 5,
    text: 'The real-time analytics are game-changing. I can make informed decisions faster than ever before. The AI insights are like having a expert trader by my side 24/7.',
    platform: 'G2',
    date: 'Apr 10, 2026'
  },
  {
    id: 4,
    name: 'Emily Zhang',
    role: 'Portfolio Manager',
    avatar: 'EZ',
    rating: 5,
    text: 'As a professional portfolio manager, I\'m impressed by the sophistication of the AI engine. It\'s like having a team of analysts working around the clock.',
    platform: 'Trustpilot',
    date: 'Apr 8, 2026'
  },
  {
    id: 5,
    name: 'David Park',
    role: 'Hedge Fund Analyst',
    avatar: 'DP',
    rating: 5,
    text: 'The neural network predictions have been remarkably accurate. I\'ve recommended CryptoPilot to my entire team. It\'s that good.',
    platform: 'Capterra',
    date: 'Apr 5, 2026'
  },
  {
    id: 6,
    name: 'Lisa Thompson',
    role: 'Crypto Educator',
    avatar: 'LT',
    rating: 5,
    text: 'I recommend CryptoPilot to all my students. The educational insights combined with AI-powered trading make it the complete package.',
    platform: 'Trustpilot',
    date: 'Apr 3, 2026'
  }
];

const STATS = [
  { value: '4.9/5', label: 'Average Rating', icon: '⭐' },
  { value: '12K+', label: 'Reviews', icon: '💬' },
  { value: '98%', label: 'Would Recommend', icon: '👍' },
  { value: '50K+', label: 'Trades Executed', icon: '📈' }
];

const TRUST_LOGOS = [
  { name: 'CoinDesk', icon: '📰' },
  { name: 'CryptoSlate', icon: '🗞️' },
  { name: 'The Block', icon: '📑' },
  { name: 'Bloomberg', icon: '🏛️' },
  { name: 'Reuters', icon: 'Agency' },
  { name: 'CoinTelegraph', icon: '📷' }
];

export default function TestimonialsPage() {
  const { darkMode: dark } = useApp();
  const [activeReview, setActiveReview] = useState(0);
  const [animatedStats, setAnimatedStats] = useState({ reviews: 0, trades: 0 });

  useEffect(() => {
    const targets = { reviews: 12000, trades: 50000 };
    const duration = 2000;
    const steps = 60;
    const interval = setInterval(() => {
      setAnimatedStats(prev => ({
        reviews: Math.min(prev.reviews + Math.ceil(targets.reviews / steps), targets.reviews),
        trades: Math.min(prev.trades + Math.ceil(targets.trades / steps), targets.trades)
      }));
    }, duration / steps);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveReview(prev => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-4">
          ⭐ Trusted by 50,000+ Traders
        </span>
        <h1 className={`text-4xl md:text-5xl font-bold ${dark ? 'text-white' : 'text-gray-900'} mb-4`}>
          What Our Users Say
        </h1>
        <p className={`text-lg ${dark ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
          Join thousands of satisfied traders who have transformed their crypto journey with CryptoPilot AI
        </p>
      </div>

      {/* Stats Bar */}
      <div className={`mb-16 rounded-2xl p-8 ${dark ? 'bg-gray-800' : 'bg-white'} border ${dark ? 'border-gray-700' : 'border-gray-100'} shadow-lg`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">
                {i === 0 ? stat.value : i === 1 ? animatedStats.reviews.toLocaleString() + '+' : i === 2 ? stat.value : animatedStats.trades.toLocaleString() + '+'}
              </div>
              <div className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Review Carousel */}
      <div className="mb-16">
        <div className={`relative overflow-hidden rounded-3xl ${dark ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-indigo-600 to-purple-600'} p-8 md:p-12`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <div className="text-6xl mb-6">"</div>
            <p className="text-xl md:text-2xl text-white/90 font-medium mb-8 leading-relaxed">
              {TESTIMONIALS[activeReview].text}
            </p>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white text-xl font-bold">
                {TESTIMONIALS[activeReview].avatar}
              </div>
              <div className="text-left">
                <p className="text-white font-bold text-lg">{TESTIMONIALS[activeReview].name}</p>
                <p className="text-white/70 text-sm">{TESTIMONIALS[activeReview].role}</p>
              </div>
            </div>
            <div className="text-yellow-400 text-xl mb-2">{renderStars(TESTIMONIALS[activeReview].rating)}</div>
            <p className="text-white/50 text-sm">{TESTIMONIALS[activeReview].platform} • {TESTIMONIALS[activeReview].date}</p>
            
            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveReview(i)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    i === activeReview ? 'bg-white w-8' : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Review Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {TESTIMONIALS.map((testimonial, i) => (
          <div
            key={testimonial.id}
            className={`group p-6 rounded-2xl border transition-all hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-2 ${
              dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className={`font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>{testimonial.name}</p>
                  <p className={`text-sm ${dark ? 'text-gray-500' : 'text-gray-500'}`}>{testimonial.role}</p>
                </div>
              </div>
              <span className="text-yellow-400">{renderStars(testimonial.rating)}</span>
            </div>
            <p className={`text-sm leading-relaxed mb-4 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
              {testimonial.text}
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{testimonial.platform}</span>
              <span className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{testimonial.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Trust Section */}
      <div className={`rounded-2xl p-8 md:p-12 ${dark ? 'bg-gray-800' : 'bg-gray-50'} border ${dark ? 'border-gray-700' : 'border-gray-100'}`}>
        <div className="text-center mb-8">
          <h2 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'} mb-2`}>
            Featured In
          </h2>
          <p className={`${dark ? 'text-gray-400' : 'text-gray-600'}`}>
            Trusted by leading crypto publications
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {TRUST_LOGOS.map((logo, i) => (
            <div key={i} className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
              <span className="text-2xl">{logo.icon}</span>
              <span className={`font-semibold ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{logo.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 text-center">
        <h2 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'} mb-4`}>
          Ready to join thousands of successful traders?
        </h2>
        <p className={`mb-6 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
          Start your free trial today — no credit card required
        </p>
        <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-700 transition-all hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/30">
          Get Started Free →
        </button>
      </div>
    </div>
  );
}