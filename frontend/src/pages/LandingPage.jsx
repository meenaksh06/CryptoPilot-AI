import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const FEATURES = [
  {
    icon: '🤖',
    title: 'AI-Powered Decisions',
    desc: 'Advanced neural networks analyze market patterns in real-time to execute optimal trades.'
  },
  {
    icon: '🛡️',
    title: 'Risk Management',
    desc: 'Built-in safeguards protect your portfolio with automated stop-loss and position sizing.'
  },
  {
    icon: '📊',
    title: 'Smart Portfolio Tracking',
    desc: 'Track performance across all assets with detailed analytics and insights.'
  },
  {
    icon: '⚡',
    title: 'Real-Time Analytics',
    desc: 'Live market data and AI-generated insights keep you ahead of market movements.'
  }
];

const STATS = [
  { value: '$2.4B+', label: 'Trading Volume' },
  { value: '150K+', label: 'Active Users' },
  { value: '99.9%', label: 'Uptime' },
  { value: '24/7', label: 'AI Monitoring' }
];

const TRUST_BADGES = [
  { icon: '🔒', text: 'Bank-grade Security' },
  { icon: '✅', text: 'SOC 2 Certified' },
  { icon: '🌐', text: 'Regulatory Compliant' },
  { icon: '💎', text: 'Insured Funds' }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { darkMode: dark } = useApp();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [animatedStats, setAnimatedStats] = useState(STATS.map(() => 0));

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const targets = STATS.map((_, i) => parseInt(STATS[i].value.replace(/[^0-9]/g, '')));
    const duration = 2000;
    const steps = 60;
    const intervals = targets.map((target, i) => {
      const stepValue = target / steps;
      return setInterval(() => {
        setAnimatedStats(prev => {
          const newStats = [...prev];
          if (newStats[i] < target) {
            newStats[i] = Math.min(newStats[i] + stepValue, target);
          }
          return newStats;
        });
      }, duration / steps);
    });
    return () => intervals.forEach(clearInterval);
  }, []);

  return (
    <div className={`min-h-screen ${dark ? 'bg-gray-950' : 'bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900'}`}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-30 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)',
            left: mousePos.x - 300,
            top: mousePos.y - 300,
            transform: 'translate(0, 0)',
            transition: 'all 0.3s ease-out'
          }}
        />
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <span className="text-white text-sm font-extrabold">CP</span>
          </div>
          <span className="text-white text-xl font-bold">CryptoPilot AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Features</a>
          <a href="#stats" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Statistics</a>
          <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Reviews</a>
          <button onClick={() => navigate('/blog')} className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Blog</button>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2.5 bg-white text-slate-900 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-all hover:scale-105"
          >
            Launch App →
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white text-sm font-medium">🚀 Now in Public Beta — No Waitlist Required</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
          Trade Smarter with
          <span className="block mt-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
            Intelligent AI
          </span>
        </h1>
        
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          CryptoPilot AI combines advanced machine learning with real-time market analysis to execute 
          profitable trades while managing risk automatically.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl text-lg font-semibold hover:shadow-2xl hover:shadow-indigo-500/30 transition-all hover:scale-105 hover:-translate-y-1"
          >
            Start Trading Free
          </button>
          <button className="px-8 py-4 bg-white/10 border border-white/20 text-white rounded-2xl text-lg font-semibold hover:bg-white/20 transition-all">
            Watch Demo
          </button>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-12">
          {TRUST_BADGES.map((badge, i) => (
            <div key={i} className="flex items-center gap-2 text-gray-400 text-sm">
              <span className="text-xl">{badge.icon}</span>
              <span>{badge.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="relative z-10 py-16 bg-white/5 backdrop-blur-sm border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {i === 0 ? '$' : ''}{animatedStats[i].toLocaleString()}{i === 2 ? '%' : '+'}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Powerful Features</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Everything you need to trade crypto with confidence
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, i) => (
            <div 
              key={i}
              className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-all hover:scale-105 hover:bg-white/10"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-white text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-12 md:p-16 text-center">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9nPjwvc3ZnPg==')] opacity-30" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Trading?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of traders using AI to maximize their crypto potential
            </p>
            <button 
              onClick={() => navigate('/')}
              className="px-10 py-4 bg-white text-indigo-600 rounded-2xl text-lg font-bold hover:shadow-2xl transition-all hover:scale-105"
            >
              Get Started Now — It's Free
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/20 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <span className="text-white text-xs font-extrabold">CP</span>
              </div>
              <span className="text-gray-400 text-sm">© 2026 CryptoPilot AI. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}