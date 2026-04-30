import { aiDecision } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export const AIDecisionPanel = () => {
  const { darkMode: dark } = useApp();
  const isUp   = aiDecision.action === 'BUY';
  const isDown = aiDecision.action === 'SELL';

  const actionGradient = isUp   ? 'from-emerald-500 to-teal-500'
                       : isDown ? 'from-red-500 to-rose-500'
                       :          'from-gray-400 to-gray-500';

  const bgTint = isUp   ? dark ? 'bg-emerald-950/40 border-emerald-800/40' : 'bg-emerald-50 border-emerald-100'
               : isDown ? dark ? 'bg-red-950/40 border-red-800/40'         : 'bg-red-50 border-red-100'
               :          dark ? 'bg-gray-800/60 border-gray-700'          : 'bg-gray-50 border-gray-200';

  const reasonBg = dark ? 'bg-white/5 border-white/10' : 'bg-white/70 border-white';
  const muted    = dark ? 'text-gray-400' : 'text-gray-400';

  return (
    <div className={`rounded-2xl border p-6 card-hover ${bgTint}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="text-lg">🤖</span>
          <span className={`text-xs font-bold uppercase tracking-widest ${muted}`}>AI Decision</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 live-dot" />
          <span className={`text-xs ${muted}`}>{aiDecision.updatedAgo}</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-5">
        {/* Big action pill */}
        <div className={`bg-gradient-to-br ${actionGradient} text-white rounded-2xl px-8 py-5 text-center min-w-[120px] shadow-md flex-shrink-0`}>
          <p className="text-xs font-semibold uppercase tracking-widest opacity-80 mb-1">Action</p>
          <p className="text-3xl font-extrabold leading-none">{aiDecision.action}</p>
          <p className="text-sm font-semibold opacity-90 mt-1">{aiDecision.asset}</p>
        </div>

        {/* Details */}
        <div className="flex-1 space-y-3">
          <div>
            <p className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
              {aiDecision.assetName}
              <span className={`text-base font-normal ml-2 ${muted}`}>@ ${aiDecision.price.toLocaleString()}</span>
            </p>
            <p className={`text-xs mt-0.5 ${muted}`}>Strategy: {aiDecision.strategy}</p>
          </div>

          {/* Confidence bar */}
          <div>
            <div className="flex justify-between mb-1.5">
              <span className={`text-xs font-medium ${muted}`}>AI Confidence</span>
              <span className={`text-xs font-bold ${isUp ? 'text-emerald-600' : isDown ? 'text-red-500' : 'text-gray-400'}`}>
                {aiDecision.confidence}%
              </span>
            </div>
            <div className={`h-2 rounded-full overflow-hidden ${dark ? 'bg-white/10' : 'bg-white/60 border border-white'}`}>
              <div
                className={`h-full rounded-full bg-gradient-to-r ${actionGradient} confidence-bar-fill`}
                style={{ '--fill': `${aiDecision.confidence}%`, width: `${aiDecision.confidence}%` }}
              />
            </div>
          </div>

          {/* Reason */}
          <p className={`text-sm leading-relaxed rounded-xl p-3 border ${reasonBg} ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
            💡 {aiDecision.reason}
          </p>
        </div>
      </div>
    </div>
  );
};
