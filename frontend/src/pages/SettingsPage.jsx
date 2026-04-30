import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function SettingsPage() {
  const { darkMode, setDarkMode } = useApp();
  const dark = darkMode;

  const [rsi,        setRsi]        = useState(30);
  const [rsiSell,    setRsiSell]    = useState(70);
  const [stopLoss,   setStopLoss]   = useState(5);
  const [takeProfit, setTakeProfit] = useState(15);
  const [strategy,   setStrategy]   = useState('RSI');
  const [dca,        setDca]        = useState(24);
  const [riskLevel,  setRiskLevel]  = useState('Moderate');
  const [notif,      setNotif]      = useState({ trades: true, alerts: true, daily: false, weekly: true });
  const [saved,      setSaved]      = useState(false);

  const card   = dark ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-100 text-gray-900';
  const muted  = dark ? 'text-gray-400' : 'text-gray-500';
  const input  = dark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-800';
  const label  = `text-sm font-semibold ${dark ? 'text-gray-200' : 'text-gray-700'}`;

  const toggle = (key) => setNotif(n => ({ ...n, [key]: !n[key] }));
  const save   = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const ToggleSwitch = ({ on, onToggle }) => (
    <button onClick={onToggle} className={`relative w-11 h-6 rounded-full transition-colors ${on ? 'bg-indigo-600' : dark ? 'bg-gray-700' : 'bg-gray-200'}`}>
      <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-5' : ''}`} />
    </button>
  );

  const SliderRow = ({ label: lbl, value, setValue, min, max, unit, color }) => (
    <div>
      <div className="flex justify-between mb-2">
        <span className={label}>{lbl}</span>
        <span className={`text-sm font-bold ${color || 'text-indigo-600'}`}>{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={e => setValue(+e.target.value)}
        className="w-full accent-indigo-600 cursor-pointer" />
      <div className={`flex justify-between text-xs mt-1 ${muted}`}><span>{min}{unit}</span><span>{max}{unit}</span></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <h1 className={`text-3xl font-extrabold ${dark ? 'text-white' : 'text-gray-900'}`}>Settings</h1>
        <p className={`mt-1 text-sm ${muted}`}>Configure AI agent behaviour, risk limits, and preferences</p>
      </div>

      {/* Strategy config */}
      <div className={`rounded-2xl border p-6 space-y-6 ${card}`}>
        <h2 className="font-bold text-lg">🤖 Agent Strategy</h2>
        <div>
          <span className={`${label} block mb-3`}>Active Strategy</span>
          <div className="flex gap-3 flex-wrap">
            {['RSI', 'DCA', 'Momentum', 'Hybrid'].map(s => (
              <button key={s} onClick={() => setStrategy(s)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${strategy === s ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : `${dark ? 'border-gray-700 text-gray-300 hover:border-indigo-400' : 'border-gray-200 text-gray-600 hover:border-indigo-400'}`}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
        {strategy === 'DCA' && (
          <SliderRow label="DCA Interval (hours)" value={dca} setValue={setDca} min={1} max={168} unit="h" />
        )}
        {(strategy === 'RSI' || strategy === 'Hybrid') && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <SliderRow label="RSI Buy Below" value={rsi} setValue={setRsi} min={10} max={45} unit="" color="text-emerald-500" />
            <SliderRow label="RSI Sell Above" value={rsiSell} setValue={setRsiSell} min={55} max={90} unit="" color="text-red-500" />
          </div>
        )}
      </div>

      {/* Risk controls */}
      <div className={`rounded-2xl border p-6 space-y-6 ${card}`}>
        <h2 className="font-bold text-lg">🛡️ Risk Controls</h2>
        <div>
          <span className={`${label} block mb-3`}>Risk Appetite</span>
          <div className="flex gap-3">
            {['Conservative', 'Moderate', 'Aggressive'].map(r => (
              <button key={r} onClick={() => setRiskLevel(r)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${riskLevel === r
                  ? r === 'Conservative' ? 'bg-blue-600 text-white border-blue-600'
                  : r === 'Aggressive'   ? 'bg-red-600 text-white border-red-600'
                  :                        'bg-amber-500 text-white border-amber-500'
                  : dark ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-600'}`}>
                {r}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <SliderRow label="Stop Loss %" value={stopLoss} setValue={setStopLoss} min={1} max={20} unit="%" color="text-red-500" />
          <SliderRow label="Take Profit %" value={takeProfit} setValue={setTakeProfit} min={5} max={50} unit="%" color="text-emerald-500" />
        </div>
      </div>

      {/* Notifications */}
      <div className={`rounded-2xl border p-6 ${card}`}>
        <h2 className="font-bold text-lg mb-5">🔔 Notifications</h2>
        <div className="space-y-4">
          {[
            { key: 'trades', label: 'Trade Executions', desc: 'Notify when agent executes a trade' },
            { key: 'alerts', label: 'Risk Alerts',      desc: 'High volatility or stop-loss warnings' },
            { key: 'daily',  label: 'Daily Summary',    desc: 'End-of-day P&L and signal report' },
            { key: 'weekly', label: 'Weekly Report',    desc: 'Performance summary every Monday' },
          ].map(({ key, label: lbl, desc }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-semibold ${dark ? 'text-gray-200' : 'text-gray-800'}`}>{lbl}</p>
                <p className={`text-xs ${muted}`}>{desc}</p>
              </div>
              <ToggleSwitch on={notif[key]} onToggle={() => toggle(key)} />
            </div>
          ))}
        </div>
      </div>

      {/* Appearance */}
      <div className={`rounded-2xl border p-6 ${card}`}>
        <h2 className="font-bold text-lg mb-5">🎨 Appearance</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-semibold ${dark ? 'text-gray-200' : 'text-gray-800'}`}>Dark Mode</p>
            <p className={`text-xs ${muted}`}>Switch between light and dark theme</p>
          </div>
          <ToggleSwitch on={darkMode} onToggle={() => setDarkMode(!darkMode)} />
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button onClick={save}
          className={`px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-sm ${saved ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
          {saved ? '✅ Settings Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
