import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const NAV_LINKS = [
  { to: '/',         label: 'Dashboard' },
  { to: '/markets',  label: 'Markets'   },
  { to: '/portfolio',label: 'Portfolio' },
  { to: '/history',  label: 'History'   },
  { to: '/settings', label: 'Settings'  },
];

export const Navbar = () => {
  const { darkMode, setDarkMode } = useApp();
  const [menuOpen, setMenuOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate   = useNavigate();

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const dark = darkMode;
  const navBase   = dark ? 'bg-gray-900 border-gray-800' : 'bg-white/90 border-gray-100';
  const textMuted = dark ? 'text-gray-400' : 'text-gray-500';
  const cardBg    = dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100';

  return (
    <nav className={`sticky top-0 z-50 border-b backdrop-blur-md ${navBase}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <button onClick={() => navigate('/')} className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm shadow-indigo-300">
            <span className="text-white text-sm font-extrabold">CP</span>
          </div>
          <span className={`hidden sm:block text-base font-extrabold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
            CryptoPilot
          </span>
          <span className="hidden sm:inline-block ml-0.5 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md">AI</span>
        </button>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : `${textMuted} hover:${dark ? 'text-white' : 'text-gray-800'} hover:bg-gray-100`
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Live badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 live-dot" />
            <span className="text-xs font-semibold text-emerald-700">Live</span>
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${dark ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            title="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          {/* Profile avatar with dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:bg-indigo-700 transition-colors"
            >
              M
            </button>

            {profileOpen && (
              <div className={`absolute right-0 top-12 w-64 rounded-2xl border shadow-xl z-50 overflow-hidden ${cardBg}`}>
                {/* Profile header */}
                <div className={`p-4 border-b ${dark ? 'border-gray-700' : 'border-gray-100'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">M</div>
                    <div>
                      <p className={`font-bold text-sm ${dark ? 'text-white' : 'text-gray-900'}`}>Meenaksh Singhania</p>
                      <p className={`text-xs ${textMuted}`}>meenaksh@cryptopilot.ai</p>
                      <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-semibold">Pro Trader</span>
                    </div>
                  </div>
                </div>
                {/* Menu items */}
                {[
                  { icon: '👤', label: 'My Profile',       action: () => { navigate('/profile'); setProfileOpen(false); } },
                  { icon: '📊', label: 'My Portfolio',     action: () => { navigate('/portfolio'); setProfileOpen(false); } },
                  { icon: '⚙️', label: 'Settings',          action: () => { navigate('/settings'); setProfileOpen(false); } },
                  { icon: '🌙', label: darkMode ? 'Light Mode' : 'Dark Mode', action: () => setDarkMode(!darkMode) },
                  { icon: '🚪', label: 'Sign Out',          action: () => setProfileOpen(false), danger: true },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-left
                      ${item.danger
                        ? 'text-red-500 hover:bg-red-50'
                        : dark
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-all ${dark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-500'}`}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {menuOpen && (
        <div className={`md:hidden border-t px-4 py-3 space-y-1 ${dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive ? 'bg-indigo-600 text-white' : `${textMuted} hover:bg-gray-50`
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
};
