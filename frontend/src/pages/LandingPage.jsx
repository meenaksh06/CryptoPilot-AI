import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';

const FEATURES = [
  {
    title: 'autonomous market judgement',
    desc: 'Signals are ranked by confidence, risk, volatility, and portfolio exposure before an action is suggested.',
    number: '01',
  },
  {
    title: 'risk before return',
    desc: 'Position sizing, stop-loss context, and drawdown awareness sit next to every simulated trade.',
    number: '02',
  },
  {
    title: 'portfolio clarity',
    desc: 'Your holdings, activity, and AI rationale stay visible in one refined command surface.',
    number: '03',
  },
  {
    title: 'live signal flow',
    desc: 'A running activity rail keeps the decision engine transparent as market conditions shift.',
    number: '04',
  },
];

const STATS = [
  { value: '$2.4B+', label: 'simulated volume' },
  { value: '150K+', label: 'tracked accounts' },
  { value: '82%', label: 'top signal confidence' },
  { value: '24/7', label: 'agent monitoring' },
];

const AnimatedStat = ({ finalValue }) => {
  const [displayValue, setDisplayValue] = useState(finalValue.replace(/[0-9]/g, '0'));
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          
          let iterations = 0;
          const maxIterations = 30;
          const chars = '0123456789';
          
          const interval = setInterval(() => {
            if (iterations >= maxIterations) {
              clearInterval(interval);
              setDisplayValue(finalValue);
              return;
            }
            
            setDisplayValue(finalValue.split('').map((char, index) => {
              if (index < (iterations / maxIterations) * finalValue.length) {
                return finalValue[index];
              }
              if (/[0-9]/.test(char)) {
                 return chars[Math.floor(Math.random() * chars.length)];
              }
              return char;
            }).join(''));
            
            iterations++;
          }, 40);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [finalValue, hasAnimated]);

  return <span ref={elementRef} className="tabular-nums">{displayValue}</span>;
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 180);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden bg-[#070707] text-white noise-texture">
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-7">
        <button onClick={() => navigate('/')} className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center bg-white text-xs font-black text-black">CP</div>
          <span className="text-sm font-bold uppercase tracking-[0.28em]">CryptoPilot</span>
        </button>
        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45 hover:text-white">Features</a>
          <a href="#security" className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45 hover:text-white">Security</a>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-black transition-colors hover:bg-white/85"
          >
            Launch
          </button>
        </div>
      </nav>

      <main>
        <section className="relative mx-auto grid min-h-[calc(100vh-96px)] max-w-7xl items-center gap-12 px-6 pb-16 pt-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className={`transition-all duration-700 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="mb-8 flex items-center gap-4">
              <span className="h-px w-12 bg-white/30" />
              <span className="text-xs font-bold uppercase tracking-[0.32em] text-white/45">AI trading cockpit</span>
            </div>
            <h1 className="max-w-4xl text-6xl font-black leading-[0.9] tracking-[-0.03em] text-white sm:text-7xl lg:text-8xl">
              A clearer way to command crypto.
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-white/52">
              CryptoPilot turns market noise into a disciplined, premium command center for simulated AI decisions.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center justify-center gap-2 bg-white px-8 py-4 text-sm font-bold uppercase tracking-[0.16em] text-black transition-colors hover:bg-white/85"
              >
                Enter Dashboard <ArrowUpRight size={16} />
              </button>
              <a
                href="#features"
                className="inline-flex items-center justify-center border border-white/18 px-8 py-4 text-sm font-bold uppercase tracking-[0.16em] text-white/75 transition-colors hover:border-white/40 hover:text-white"
              >
                Explore System
              </a>
            </div>
          </div>

          <div className="relative min-h-[560px]">
            <div className="absolute inset-x-8 top-0 h-[520px] border border-white/10 bg-[#101010] shadow-[0_40px_120px_rgba(0,0,0,0.55)]" />
            <div className="absolute inset-x-0 top-12 border border-white/12 bg-[#161616]/90 p-6 backdrop-blur-xl">
              <div className="mb-12 flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/35">portfolio value</p>
                  <p className="mt-2 text-4xl font-black tracking-tight">₹2,84,531</p>
                </div>
                <span className="border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">
                  +1.37%
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ['AI ACTION', 'BUY BTC', TrendingUp],
                  ['CONFIDENCE', '82%', Sparkles],
                  ['RISK STATE', 'CONTROLLED', ShieldCheck],
                  ['MODE', 'SIMULATION', ArrowUpRight],
                ].map(([label, value, Icon]) => (
                  <div key={label} className="border border-white/10 bg-white/[0.03] p-4">
                    <Icon className="mb-8 text-white/45" size={18} />
                    <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-white/35">{label}</p>
                    <p className="mt-2 text-xl font-black">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 h-28 border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.09),rgba(255,255,255,0.01))] p-4">
                <div className="h-full w-full bg-[linear-gradient(90deg,transparent,rgba(16,185,129,0.22),transparent)]" />
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-white/10 md:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="bg-[#080808] px-6 py-10">
                <p className="text-4xl font-black tracking-tight"><AnimatedStat finalValue={stat.value} /></p>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.22em] text-white/38">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-6 py-24">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-white/35">not every signal deserves action</p>
          <h2 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-[-0.02em] md:text-6xl">
            built for traders who prefer judgement over noise.
          </h2>
          <div className="mt-16 grid gap-px bg-white/10 md:grid-cols-2">
            {FEATURES.map((feature) => (
              <div key={feature.number} className="bg-[#080808] p-8 transition-colors hover:bg-[#101010] md:p-12">
                <span className="font-mono text-sm text-white/28">{feature.number}</span>
                <h3 className="mt-8 text-2xl font-bold tracking-tight">{feature.title}</h3>
                <p className="mt-4 max-w-md leading-7 text-white/45">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="security" className="border-t border-white/10 px-6 py-24">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-white/35">complete clarity. no asterisks.</p>
              <h2 className="mt-5 max-w-2xl text-4xl font-black tracking-[-0.02em] md:text-6xl">
                your risk view stays visible.
              </h2>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-white px-8 py-4 text-sm font-bold uppercase tracking-[0.16em] text-black transition-colors hover:bg-white/85"
            >
              Open cockpit
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
