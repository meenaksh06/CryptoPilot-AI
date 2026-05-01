import { useEffect, useState } from 'react';
import { BellRing, ShieldCheck, SlidersHorizontal, UserRound } from 'lucide-react';
import { settingsApi } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

const strategyOptions = ['RSI', 'DCA', 'MOMENTUM', 'HYBRID', 'HOLD'];

const qualityTone = (key, value) => {
  if (key === 'rsi_buy_below') {
    return value <= 35 ? 'text-emerald-200' : 'text-red-200';
  }
  if (key === 'rsi_sell_above') {
    return value >= 65 ? 'text-emerald-200' : 'text-red-200';
  }
  if (key === 'dca_interval_hours') {
    return value >= 12 && value <= 48 ? 'text-emerald-200' : 'text-red-200';
  }
  if (key === 'stop_loss_pct') {
    return value >= 3 && value <= 8 ? 'text-emerald-200' : 'text-red-200';
  }
  if (key === 'take_profit_pct') {
    return value >= 10 && value <= 25 ? 'text-emerald-200' : 'text-red-200';
  }
  return 'text-white';
};

const Toggle = ({ checked, onChange }) => (
  <button
    onClick={onChange}
    className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-emerald-400' : 'bg-white/12'}`}
    type="button"
  >
    <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

const SliderField = ({ label, value, min, max, onChange, field, unit = '' }) => (
  <div className="border border-white/10 bg-black/20 p-4">
    <div className="mb-3 flex items-center justify-between">
      <span className="text-sm font-semibold text-white">{label}</span>
      <span className={`text-sm font-black ${qualityTone(field, value)}`}>{value}{unit}</span>
    </div>
    <input
      className="w-full accent-emerald-300"
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
    />
    <div className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.16em] text-white/28">
      <span>{min}{unit}</span>
      <span>{max}{unit}</span>
    </div>
  </div>
);

export default function SettingsPage() {
  const { token, user, signOutUser, demoMode } = useAuth();
  const { darkMode, setDarkMode } = useApp();
  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let active = true;
    settingsApi.get(token).then((payload) => {
      if (active) {
        setForm(payload);
      }
    }).catch(() => {
      if (active) {
        setForm(null);
      }
    });
    return () => {
      active = false;
    };
  }, [token]);

  if (!form) {
    return (
      <main className="min-h-screen bg-[#080808] px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="premium-panel p-8 text-sm text-white/45">Loading settings...</div>
        </div>
      </main>
    );
  }

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const updateNotification = (key) => setForm((current) => ({
    ...current,
    notifications: { ...current.notifications, [key]: !current.notifications[key] },
  }));

  const saveSettings = async () => {
    await settingsApi.update(token, form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <main className="min-h-screen bg-[#080808] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="premium-panel p-6 lg:p-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/34">Settings and controls</p>
          <h1 className="mt-4 text-5xl font-black leading-[0.92] tracking-[-0.04em] text-white sm:text-6xl">
            Tune the strategy stack without leaving the premium workspace.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/46">
            Every threshold is color-scored so you can instantly see whether the current RSI, DCA, stop-loss, and take-profit values are disciplined or risky.
          </p>
        </section>

        <section className="grid gap-8 xl:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            <div className="premium-panel p-5">
              <div className="mb-5 flex items-center gap-3">
                <SlidersHorizontal className="text-white/35" size={18} />
                <p className="text-sm font-black text-white">Strategy configuration</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {strategyOptions.map((strategy) => (
                  <button
                    key={strategy}
                    onClick={() => updateField('active_strategy', strategy)}
                    className={`border px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] ${
                      form.active_strategy === strategy ? 'border-white bg-white text-black' : 'border-white/10 text-white/45'
                    }`}
                    type="button"
                  >
                    {strategy}
                  </button>
                ))}
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <SliderField label="RSI buy below" value={form.rsi_buy_below} min={10} max={45} onChange={(value) => updateField('rsi_buy_below', value)} field="rsi_buy_below" />
                <SliderField label="RSI sell above" value={form.rsi_sell_above} min={55} max={90} onChange={(value) => updateField('rsi_sell_above', value)} field="rsi_sell_above" />
                <SliderField label="DCA interval" value={form.dca_interval_hours} min={1} max={168} onChange={(value) => updateField('dca_interval_hours', value)} field="dca_interval_hours" unit="h" />
                <SliderField label="Stop loss" value={form.stop_loss_pct} min={1} max={20} onChange={(value) => updateField('stop_loss_pct', value)} field="stop_loss_pct" unit="%" />
                <SliderField label="Take profit" value={form.take_profit_pct} min={5} max={50} onChange={(value) => updateField('take_profit_pct', value)} field="take_profit_pct" unit="%" />
              </div>
            </div>

            <div className="premium-panel p-5">
              <div className="mb-5 flex items-center gap-3">
                <ShieldCheck className="text-white/35" size={18} />
                <p className="text-sm font-black text-white">Risk controls</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {['Conservative', 'Moderate', 'Aggressive'].map((level) => (
                  <button
                    key={level}
                    onClick={() => updateField('risk_level', level)}
                    className={`border p-4 text-left ${
                      form.risk_level === level ? 'border-white bg-white text-black' : 'border-white/10 bg-white/[0.03] text-white/60'
                    }`}
                    type="button"
                  >
                    <p className="text-sm font-black">{level}</p>
                    <p className="mt-2 text-xs opacity-70">
                      {level === 'Conservative' ? 'Tighter risk bounds and slower entries.' :
                        level === 'Moderate' ? 'Balanced entries and exits.' :
                        'Faster reactions with wider tolerance.'}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="premium-panel p-5">
              <div className="mb-5 flex items-center gap-3">
                <BellRing className="text-white/35" size={18} />
                <p className="text-sm font-black text-white">Notifications</p>
              </div>
              <div className="space-y-4">
                {[
                  ['trades', 'Trade executions'],
                  ['alerts', 'Risk alerts'],
                  ['daily', 'Daily summary'],
                  ['weekly', 'Weekly report'],
                ].map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between border border-white/10 bg-white/[0.03] px-4 py-4">
                    <div>
                      <p className="text-sm font-semibold text-white">{label}</p>
                      <p className="text-xs text-white/38">Delivery preference is stored with your workspace profile.</p>
                    </div>
                    <Toggle checked={form.notifications[key]} onChange={() => updateNotification(key)} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="premium-panel p-5">
              <div className="mb-5 flex items-center gap-3">
                <UserRound className="text-white/35" size={18} />
                <p className="text-sm font-black text-white">Account</p>
              </div>
              <div className="space-y-4">
                <div className="border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-sm font-black text-white">{user?.displayName || 'Trader'}</p>
                  <p className="mt-1 text-xs text-white/35">{user?.email || 'demo@cryptopilot.ai'}</p>
                  <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/28">
                    {demoMode ? 'Demo mode' : 'Firebase authenticated'}
                  </p>
                </div>

                <div className="border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-black text-white">Appearance</p>
                      <p className="mt-1 text-xs text-white/35">Keep the workspace in the premium dark command theme.</p>
                    </div>
                    <Toggle checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={saveSettings}
              className={`w-full px-6 py-4 text-xs font-bold uppercase tracking-[0.18em] ${
                saved ? 'bg-emerald-300 text-black' : 'bg-white text-black hover:bg-white/85'
              }`}
              type="button"
            >
              {saved ? 'Settings saved' : 'Save settings'}
            </button>

            <button
              onClick={signOutUser}
              className="w-full border border-red-300/20 bg-red-300/10 px-6 py-4 text-xs font-bold uppercase tracking-[0.18em] text-red-100"
              type="button"
            >
              Sign out
            </button>
          </aside>
        </section>
      </div>
    </main>
  );
}
