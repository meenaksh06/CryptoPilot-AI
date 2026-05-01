import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/dashboard/Navbar';
import DashboardPage from './pages/DashboardPage';
import MarketsPage from './pages/MarketsPage';
import PortfolioPage from './pages/PortfolioPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import LandingPage from './pages/LandingPage';
import BlogPage from './pages/BlogPage';
import TestimonialsPage from './pages/TestimonialsPage';

const TICKER_ITEMS = [
  { sym: 'BTC', price: 63412, change: +2.34 },
  { sym: 'ETH', price: 3128, change: -1.12 },
  { sym: 'SOL', price: 148.9, change: +5.61 },
  { sym: 'BNB', price: 584, change: +0.87 },
  { sym: 'ADA', price: 0.412, change: -3.2 },
  { sym: 'AVAX', price: 32.18, change: +4.15 },
  { sym: 'DOT', price: 6.82, change: -0.44 },
  { sym: 'MATIC', price: 0.548, change: +1.23 },
  { sym: 'DOGE', price: 0.128, change: +7.88 },
  { sym: 'LINK', price: 13.42, change: +2.9 },
];

const TickerBar = () => (
  <div className="border-b border-white/10 bg-[#050505] py-3 text-[11px] font-medium uppercase tracking-[0.24em] text-white/45 overflow-hidden">
    <div className="ticker-scroll flex gap-10" style={{ width: 'max-content' }}>
      {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
        <span key={`${item.sym}-${i}`} className="flex items-center gap-2 whitespace-nowrap">
          <span className="text-white">{item.sym}</span>
          <span>${item.price.toLocaleString()}</span>
          <span className={item.change >= 0 ? 'text-emerald-300' : 'text-red-300'}>
            {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
          </span>
        </span>
      ))}
    </div>
  </div>
);

const Footer = () => (
  <footer className="border-t border-white/10 bg-[#080808]">
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="grid gap-8 border-b border-white/10 pb-10 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center border border-white/20 bg-white text-xs font-black text-black">
              CP
            </div>
            <span className="text-sm font-semibold tracking-[0.24em]">CRYPTOPILOT</span>
          </div>
          <p className="max-w-sm text-sm leading-6 text-white/45">
            An AI trading cockpit for simulated decisions, portfolio clarity, and disciplined risk.
          </p>
        </div>
        {[
          ['PRODUCT', 'Dashboard', 'Markets', 'Portfolio', 'Signals'],
          ['RESOURCES', 'Blog', 'Docs', 'Security', 'Support'],
          ['SYSTEM', 'Simulation Mode', 'FastAPI', 'React', 'Agentic Engine'],
        ].map(([title, ...links]) => (
          <div key={title}>
            <h4 className="mb-4 text-[11px] font-bold tracking-[0.28em] text-white/80">{title}</h4>
            <ul className="space-y-3 text-sm text-white/40">
              {links.map((link) => (
                <li key={link}>
                  <a href="#" className="transition-colors hover:text-white">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3 pt-8 text-xs uppercase tracking-[0.2em] text-white/30 sm:flex-row sm:items-center sm:justify-between">
        <span>Copyright 2026 CryptoPilot AI</span>
        <span>Not financial advice</span>
      </div>
    </div>
  </footer>
);

const AppShell = ({ children }) => (
  <>
    <TickerBar />
    <Navbar />
    {children}
    <Footer />
  </>
);

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<AppShell><DashboardPage /></AppShell>} />
          <Route path="/markets" element={<AppShell><MarketsPage /></AppShell>} />
          <Route path="/portfolio" element={<AppShell><PortfolioPage /></AppShell>} />
          <Route path="/history" element={<AppShell><HistoryPage /></AppShell>} />
          <Route path="/settings" element={<AppShell><SettingsPage /></AppShell>} />
          <Route path="/profile" element={<AppShell><ProfilePage /></AppShell>} />
          <Route path="/blog" element={<AppShell><BlogPage /></AppShell>} />
          <Route path="/testimonials" element={<AppShell><TestimonialsPage /></AppShell>} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
