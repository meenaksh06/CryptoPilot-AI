import { useEffect, useState } from 'react';
import { Quote, Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Marcus Chen',
    role: 'Crypto Trader',
    avatar: 'MC',
    text: 'CryptoPilot AI has completely transformed my trading strategy. The AI signals have been incredibly accurate, and I have seen a 40% increase in my simulated portfolio.',
    platform: 'Trustpilot',
    date: 'Apr 15, 2026',
  },
  {
    id: 2,
    name: 'Sarah Williams',
    role: 'DeFi Investor',
    avatar: 'SW',
    text: 'The risk management features are top-notch. I sleep better knowing my portfolio is protected by automated stop-losses.',
    platform: 'Product Hunt',
    date: 'Apr 12, 2026',
  },
  {
    id: 3,
    name: 'James Rodriguez',
    role: 'Day Trader',
    avatar: 'JR',
    text: 'The real-time analytics are game-changing. I can make informed decisions faster than ever before.',
    platform: 'G2',
    date: 'Apr 10, 2026',
  },
  {
    id: 4,
    name: 'Emily Zhang',
    role: 'Portfolio Manager',
    avatar: 'EZ',
    text: 'As a portfolio manager, I am impressed by the sophistication of the AI engine. It feels like a tireless research desk.',
    platform: 'Trustpilot',
    date: 'Apr 8, 2026',
  },
  {
    id: 5,
    name: 'David Park',
    role: 'Hedge Fund Analyst',
    avatar: 'DP',
    text: 'The neural network predictions have been remarkably sharp. I have recommended CryptoPilot to my entire team.',
    platform: 'Capterra',
    date: 'Apr 5, 2026',
  },
  {
    id: 6,
    name: 'Lisa Thompson',
    role: 'Crypto Educator',
    avatar: 'LT',
    text: 'I recommend CryptoPilot to my students because the educational insights sit right next to the AI-powered trading context.',
    platform: 'Trustpilot',
    date: 'Apr 3, 2026',
  },
];

const STATS = [
  { value: '4.9/5', label: 'average rating' },
  { value: '12K+', label: 'reviews' },
  { value: '98%', label: 'recommend' },
  { value: '50K+', label: 'trades simulated' },
];

const TRUST_LOGOS = ['CoinDesk', 'CryptoSlate', 'The Block', 'Bloomberg', 'Reuters', 'CoinTelegraph'];

const Stars = () => (
  <span className="flex gap-1 text-amber-200">
    {Array.from({ length: 5 }).map((_, index) => <Star key={index} size={14} fill="currentColor" />)}
  </span>
);

export default function TestimonialsPage() {
  const [activeReview, setActiveReview] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveReview((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const featured = TESTIMONIALS[activeReview];

  return (
    <main className="min-h-screen bg-[#080808] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <section className="mb-12 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-white/35">trusted by disciplined traders</p>
          <h1 className="mx-auto mt-5 max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.04em] text-white md:text-6xl">
            the proof writes itself.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/45">
            Traders use CryptoPilot to keep strategy, risk, and signal confidence in one premium command surface.
          </p>
        </section>

        <section className="mb-12 grid grid-cols-2 gap-px bg-white/10 md:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="bg-[#101010] p-6 text-center">
              <p className="text-3xl font-black text-white">{stat.value}</p>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">{stat.label}</p>
            </div>
          ))}
        </section>

        <section className="premium-panel mb-12 p-8 md:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <Quote className="mx-auto mb-8 text-white/25" size={40} />
            <p className="text-2xl font-bold leading-10 tracking-[-0.02em] text-white md:text-3xl">
              "{featured.text}"
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center bg-white text-sm font-black text-black">
                {featured.avatar}
              </div>
              <div className="text-left">
                <p className="font-bold text-white">{featured.name}</p>
                <p className="text-sm text-white/40">{featured.role}</p>
              </div>
            </div>
            <div className="mt-5 flex justify-center"><Stars /></div>
            <p className="mt-3 text-xs uppercase tracking-[0.18em] text-white/30">{featured.platform} · {featured.date}</p>
            <div className="mt-8 flex justify-center gap-2">
              {TESTIMONIALS.map((testimonial, index) => (
                <button
                  key={testimonial.id}
                  onClick={() => setActiveReview(index)}
                  className={`h-2 transition-all ${index === activeReview ? 'w-8 bg-white' : 'w-2 bg-white/25 hover:bg-white/50'}`}
                  title={testimonial.name}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="mb-12 grid gap-px bg-white/10 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <article key={testimonial.id} className="bg-[#0c0c0c] p-6 transition-colors hover:bg-[#111]">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center border border-white/10 bg-white/[0.04] text-xs font-black text-white">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-white">{testimonial.name}</p>
                    <p className="text-xs text-white/35">{testimonial.role}</p>
                  </div>
                </div>
                <Stars />
              </div>
              <p className="min-h-28 text-sm leading-6 text-white/48">{testimonial.text}</p>
              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-xs uppercase tracking-[0.16em] text-white/28">
                <span>{testimonial.platform}</span>
                <span>{testimonial.date}</span>
              </div>
            </article>
          ))}
        </section>

        <section className="premium-panel p-8 text-center">
          <p className="mb-6 text-xs font-bold uppercase tracking-[0.3em] text-white/35">featured in</p>
          <div className="flex flex-wrap justify-center gap-4">
            {TRUST_LOGOS.map((name) => (
              <span key={name} className="border border-white/10 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white/45">
                {name}
              </span>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
