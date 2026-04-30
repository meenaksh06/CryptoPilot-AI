import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/dashboard/Navbar';
import DashboardPage from './pages/DashboardPage';
import MarketsPage   from './pages/MarketsPage';
import PortfolioPage from './pages/PortfolioPage';
import HistoryPage   from './pages/HistoryPage';
import SettingsPage  from './pages/SettingsPage';
import ProfilePage   from './pages/ProfilePage';

const TICKER_ITEMS = [
  { sym: 'BTC',   price: 63412, change: +2.34 },
  { sym: 'ETH',   price: 3128,  change: -1.12 },
  { sym: 'SOL',   price: 148.9, change: +5.61 },
  { sym: 'BNB',   price: 584,   change: +0.87 },
  { sym: 'ADA',   price: 0.412, change: -3.20 },
  { sym: 'AVAX',  price: 32.18, change: +4.15 },
  { sym: 'DOT',   price: 6.82,  change: -0.44 },
  { sym: 'MATIC', price: 0.548, change: +1.23 },
  { sym: 'DOGE',  price: 0.128, change: +7.88 },
  { sym: 'LINK',  price: 13.42, change: +2.90 },
];

const TickerBar = () => (
  <div className="bg-gray-900 text-xs font-mono overflow-hidden py-2 flex-shrink-0">
    <div className="flex gap-8 ticker-scroll" style={{ width: 'max-content' }}>
      {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
        <span key={i} className="flex items-center gap-1.5 text-gray-400 whitespace-nowrap px-1">
          <span className="text-white font-bold">{item.sym}</span>
          <span>${item.price.toLocaleString()}</span>
          <span className={item.change >= 0 ? 'text-emerald-400' : 'text-red-400'}>
            {item.change >= 0 ? '▲' : '▼'} {Math.abs(item.change).toFixed(2)}%
          </span>
        </span>
      ))}
    </div>
  </div>
);

const Footer = () => (
  <footer className="border-t border-gray-100 bg-white mt-12">
    <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center">
          <span className="text-white text-[9px] font-extrabold">CP</span>
        </div>
        <span className="text-sm font-bold text-gray-700">CryptoPilot AI</span>
        <span className="text-xs text-gray-400">· Simulation Mode · Not financial advice</span>
      </div>
      <div className="flex items-center gap-4 text-xs text-gray-400">
        <span>Powered by FastAPI + React</span>
        <span>·</span>
        <span>Agentic Decision Engine v2</span>
      </div>
    </div>
  </footer>
);

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <TickerBar />
        <Navbar />
        <Routes>
          <Route path="/"          element={<DashboardPage />} />
          <Route path="/markets"   element={<MarketsPage />}   />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/history"   element={<HistoryPage />}   />
          <Route path="/settings"  element={<SettingsPage />}  />
          <Route path="/profile"   element={<ProfilePage />}   />
        </Routes>
        <Footer />
      </AppProvider>
    </BrowserRouter>
  );
}
