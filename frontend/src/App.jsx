import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/dashboard/Navbar';
import DashboardPage from './pages/DashboardPage';
import MarketsPage   from './pages/MarketsPage';
import PortfolioPage from './pages/PortfolioPage';
import HistoryPage   from './pages/HistoryPage';
import SettingsPage  from './pages/SettingsPage';
import ProfilePage   from './pages/ProfilePage';
import LandingPage   from './pages/LandingPage';
import BlogPage      from './pages/BlogPage';
import TestimonialsPage from './pages/TestimonialsPage';

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
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        <div>
          <h4 className="font-bold text-gray-900 mb-4">Product</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#" className="hover:text-indigo-600">Features</a></li>
            <li><a href="#" className="hover:text-indigo-600">Pricing</a></li>
            <li><a href="#" className="hover:text-indigo-600">Security</a></li>
            <li><a href="#" className="hover:text-indigo-600">API</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 mb-4">Resources</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#" className="hover:text-indigo-600">Documentation</a></li>
            <li><a href="#" className="hover:text-indigo-600">Blog</a></li>
            <li><a href="#" className="hover:text-indigo-600">Tutorials</a></li>
            <li><a href="#" className="hover:text-indigo-600">Support</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#" className="hover:text-indigo-600">About</a></li>
            <li><a href="#" className="hover:text-indigo-600">Careers</a></li>
            <li><a href="#" className="hover:text-indigo-600">Press</a></li>
            <li><a href="#" className="hover:text-indigo-600">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 mb-4">Legal</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#" className="hover:text-indigo-600">Privacy</a></li>
            <li><a href="#" className="hover:text-indigo-600">Terms</a></li>
            <li><a href="#" className="hover:text-indigo-600">Cookies</a></li>
            <li><a href="#" className="hover:text-indigo-600">Licenses</a></li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-gray-100 gap-4">
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
    </div>
  </footer>
);

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/"          element={<LandingPage />} />
          <Route path="/dashboard" element={<><TickerBar /><Navbar /><DashboardPage /><Footer /></>} />
          <Route path="/markets"   element={<><TickerBar /><Navbar /><MarketsPage /><Footer /></>} />
          <Route path="/portfolio" element={<><TickerBar /><Navbar /><PortfolioPage /><Footer /></>} />
          <Route path="/history"   element={<><TickerBar /><Navbar /><HistoryPage /><Footer /></>} />
          <Route path="/settings"  element={<><TickerBar /><Navbar /><SettingsPage /><Footer /></>} />
          <Route path="/profile"   element={<><TickerBar /><Navbar /><ProfilePage /><Footer /></>} />
          <Route path="/blog"      element={<><TickerBar /><Navbar /><BlogPage /><Footer /></>} />
          <Route path="/testimonials" element={<><TickerBar /><Navbar /><TestimonialsPage /><Footer /></>} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
