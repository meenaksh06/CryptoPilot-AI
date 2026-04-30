import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function ProfilePage() {
  const { darkMode: dark } = useApp();
  const navigate = useNavigate();
  const card  = dark ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-100 text-gray-900';
  const muted = dark ? 'text-gray-400' : 'text-gray-500';
  const sub   = dark ? 'bg-gray-800' : 'bg-gray-50';

  const STATS = [
    { label: 'Total Trades',   value: '10' },
    { label: 'Win Rate',       value: '78%' },
    { label: 'Total P&L',      value: '+$730' },
    { label: 'Best Trade',     value: '+$227' },
    { label: 'Days Active',    value: '28' },
    { label: 'Strategies Used', value: '3' },
  ];

  const BADGES = [
    { icon: '🚀', label: 'First Trade',    earned: true  },
    { icon: '🏆', label: '10 Wins',        earned: true  },
    { icon: '💎', label: 'Diamond Hands',  earned: true  },
    { icon: '📈', label: '50% ROI',        earned: false },
    { icon: '🤖', label: 'AI Enthusiast',  earned: true  },
    { icon: '⚡', label: 'Speed Trader',   earned: false },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Profile card */}
      <div className={`rounded-2xl border p-8 ${card}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-lg">
            M
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className={`text-2xl font-extrabold ${dark ? 'text-white' : 'text-gray-900'}`}>Meenaksh Singhania</h1>
              <span className="text-xs bg-indigo-50 text-indigo-600 font-bold px-3 py-1 rounded-full border border-indigo-100">Pro Trader</span>
            </div>
            <p className={`text-sm mt-1 ${muted}`}>meenaksh@cryptopilot.ai</p>
            <p className={`text-xs mt-2 ${muted}`}>📍 Mumbai, India · Member since April 2026</p>
          </div>
          <button
            onClick={() => navigate('/settings')}
            className="px-4 py-2 rounded-xl text-sm font-semibold border transition-all hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200"
            style={{ borderColor: dark ? '#374151' : '#e5e7eb', color: dark ? '#9ca3af' : '#6b7280' }}
          >
            ✏️ Edit Profile
          </button>
        </div>
      </div>

      {/* Performance stats */}
      <div className={`rounded-2xl border p-6 ${card}`}>
        <h2 className="font-bold text-lg mb-5">📊 Performance Stats</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {STATS.map(s => (
            <div key={s.label} className={`p-4 rounded-xl ${sub}`}>
              <p className={`text-xs uppercase tracking-wider mb-1 ${muted}`}>{s.label}</p>
              <p className="text-xl font-extrabold">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className={`rounded-2xl border p-6 ${card}`}>
        <h2 className="font-bold text-lg mb-5">🏅 Achievements</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {BADGES.map(b => (
            <div key={b.label} className={`p-4 rounded-xl flex items-center gap-3 transition-all ${b.earned ? sub : dark ? 'bg-gray-900 opacity-40' : 'bg-gray-50 opacity-40'}`}>
              <span className="text-2xl">{b.icon}</span>
              <div>
                <p className={`text-sm font-semibold ${b.earned ? '' : muted}`}>{b.label}</p>
                <p className={`text-xs ${muted}`}>{b.earned ? 'Earned' : 'Locked'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className={`rounded-2xl border p-6 ${card}`}>
        <h2 className="font-bold text-lg mb-5">⚡ Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'View Portfolio',  icon: '📊', action: () => navigate('/portfolio') },
            { label: 'Full Trade History', icon: '🕓', action: () => navigate('/history')   },
            { label: 'Agent Settings',  icon: '⚙️', action: () => navigate('/settings')  },
            { label: 'Market Overview', icon: '📈', action: () => navigate('/markets')   },
          ].map(item => (
            <button key={item.label} onClick={item.action}
              className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all card-hover
                ${dark ? 'border-gray-700 text-gray-300 hover:border-indigo-500 hover:text-indigo-300' : 'border-gray-100 text-gray-700 hover:border-indigo-200 hover:text-indigo-700'}`}>
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm font-semibold">{item.label}</span>
              <span className="ml-auto text-gray-400">→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
