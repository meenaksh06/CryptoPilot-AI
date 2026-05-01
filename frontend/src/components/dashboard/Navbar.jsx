import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, Settings, User, WalletCards, X, LogOut } from 'lucide-react';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/markets', label: 'Markets' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/history', label: 'History' },
  { to: '/blog', label: 'Blog' },
  { to: '/testimonials', label: 'Reviews' },
  { to: '/settings', label: 'Settings' },
];

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#080808]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <button onClick={() => navigate('/')} className="flex flex-shrink-0 items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center border border-white/20 bg-white text-[11px] font-black text-black shadow-[0_0_30px_rgba(255,255,255,0.16)]">
            CP
          </div>
          <span className="hidden text-sm font-bold uppercase tracking-[0.26em] text-white sm:block">
            CryptoPilot
          </span>
        </button>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard'}
              className={({ isActive }) =>
                `px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition-all ${
                  isActive
                    ? 'bg-white text-black'
                    : 'text-white/45 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 border border-white/10 px-3 py-2 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 live-dot" />
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">Live</span>
          </div>

          <button
            onClick={() => navigate('/settings')}
            className="flex h-9 w-9 items-center justify-center border border-white/10 bg-white/5 text-white/60 transition-all hover:border-white/30 hover:text-white"
            title="Settings"
          >
            <Settings size={16} />
          </button>

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((open) => !open)}
              className="flex h-9 w-9 items-center justify-center bg-white text-sm font-black text-black transition-colors hover:bg-white/85"
            >
              M
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-12 z-50 w-72 overflow-hidden border border-white/10 bg-[#111] shadow-2xl">
                <div className="border-b border-white/10 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center bg-white font-black text-black">M</div>
                    <div>
                      <p className="text-sm font-semibold text-white">Meenaksh Singhania</p>
                      <p className="text-xs text-white/40">meenaksh@cryptopilot.ai</p>
                    </div>
                  </div>
                </div>
                {[
                  { icon: User, label: 'My Profile', action: () => navigate('/profile') },
                  { icon: WalletCards, label: 'My Portfolio', action: () => navigate('/portfolio') },
                  { icon: Settings, label: 'Settings', action: () => navigate('/settings') },
                  { icon: LogOut, label: 'Sign Out', action: () => {}, danger: true },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        item.action();
                        setProfileOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium transition-colors ${
                        item.danger ? 'text-red-300 hover:bg-red-500/10' : 'text-white/65 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon size={16} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-9 w-9 items-center justify-center border border-white/10 text-white/70 md:hidden"
            title="Menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 bg-[#080808] px-4 py-3 md:hidden">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard'}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition-all ${
                  isActive ? 'bg-white text-black' : 'text-white/50 hover:bg-white/10 hover:text-white'
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
