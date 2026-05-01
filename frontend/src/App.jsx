import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/dashboard/Navbar';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { getApiBaseUrl, marketsApi } from './lib/api';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import MarketsPage from './pages/MarketsPage';
import PortfolioPage from './pages/PortfolioPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import InsightsPage from './pages/InsightsPage';

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
            An authenticated AI trading cockpit with live market intelligence, strategy memory, and premium portfolio analytics.
          </p>
        </div>
        {[
          ['PRODUCT', 'Dashboard', 'Markets', 'Portfolio', 'Insights'],
          ['STACK', 'FastAPI', 'Firebase Auth', 'Firestore', 'CoinGecko'],
          ['MODE', 'Simulation', 'Protected routes', 'Live charts', 'Strategy scoring'],
        ].map(([title, ...links]) => (
          <div key={title}>
            <h4 className="mb-4 text-[11px] font-bold tracking-[0.28em] text-white/80">{title}</h4>
            <ul className="space-y-3 text-sm text-white/40">
              {links.map((link) => (
                <li key={link}><span>{link}</span></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3 pt-8 text-xs uppercase tracking-[0.2em] text-white/30 sm:flex-row sm:items-center sm:justify-between">
        <span>Copyright 2026 CryptoPilot AI</span>
        <span>Simulation workspace only</span>
      </div>
    </div>
  </footer>
);

const TickerBar = () => {
  const { token } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    let active = true;
    const loadTicker = async () => {
      try {
        const payload = await marketsApi.list({ token, limit: 12 });
        if (active) {
          setItems(payload.assets || []);
        }
      } catch {
        if (active) {
          setItems([]);
        }
      }
    };
    loadTicker();
    const timer = setInterval(loadTicker, 45000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [token]);

  return (
    <div className="border-b border-white/10 bg-[#050505] py-3 text-[11px] font-medium uppercase tracking-[0.24em] text-white/45 overflow-hidden">
      <div className="ticker-scroll flex gap-10" style={{ width: 'max-content' }}>
        {[...items, ...items].map((item, index) => (
          <span key={`${item.id}-${index}`} className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-white">{item.symbol}</span>
            <span>${Number(item.price).toLocaleString()}</span>
            <span className={item.change_24h >= 0 ? 'text-emerald-300' : 'text-red-300'}>
              {item.change_24h >= 0 ? '+' : ''}{Number(item.change_24h).toFixed(2)}%
            </span>
          </span>
        ))}
        {!items.length ? <span className="text-white/40">API: {getApiBaseUrl()}</span> : null}
      </div>
    </div>
  );
};

const AppShell = ({ children }) => (
  <>
    <TickerBar />
    <Navbar />
    {children}
    <Footer />
  </>
);

const ProtectedShell = ({ children }) => (
  <ProtectedRoute>
    <AppShell>{children}</AppShell>
  </ProtectedRoute>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/sign-in" element={<AuthPage mode="sign-in" />} />
            <Route path="/sign-up" element={<AuthPage mode="sign-up" />} />
            <Route path="/dashboard" element={<ProtectedShell><DashboardPage /></ProtectedShell>} />
            <Route path="/markets" element={<ProtectedShell><MarketsPage /></ProtectedShell>} />
            <Route path="/portfolio" element={<ProtectedShell><PortfolioPage /></ProtectedShell>} />
            <Route path="/history" element={<Navigate to="/portfolio?tab=history" replace />} />
            <Route path="/settings" element={<ProtectedShell><SettingsPage /></ProtectedShell>} />
            <Route path="/profile" element={<ProtectedShell><ProfilePage /></ProtectedShell>} />
            <Route path="/insights" element={<ProtectedShell><InsightsPage /></ProtectedShell>} />
          </Routes>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
