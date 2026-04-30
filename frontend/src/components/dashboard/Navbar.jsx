import { useState } from 'react';

export const Navbar = ({ darkMode, onToggleDark }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-sm font-extrabold">CP</span>
          </div>
          <span className="text-base font-extrabold text-gray-900 tracking-tight">
            CryptoPilot <span className="text-indigo-600">AI</span>
          </span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {['Dashboard', 'Markets', 'Strategy', 'History'].map((item, i) => (
            <button
              key={item}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                i === 0
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Live badge */}
          <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 live-dot" />
            <span className="text-xs font-semibold text-emerald-700">Live</span>
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={onToggleDark}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all text-base"
            title="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          {/* Avatar */}
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            AI
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="text-gray-600 text-lg">{menuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-1">
          {['Dashboard', 'Markets', 'Strategy', 'History'].map((item, i) => (
            <button
              key={item}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium text-left transition-colors ${
                i === 0 ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
