import { aiDecision } from '../../data/mockData';
import { ActionBadge } from '../ui/Badge';

export const AIDecisionPanel = () => {
  const isUp = aiDecision.action === 'BUY';
  const isDown = aiDecision.action === 'SELL';

  const actionColor = isUp
    ? 'from-emerald-500 to-teal-500'
    : isDown
    ? 'from-red-500 to-rose-500'
    : 'from-gray-400 to-gray-500';

  const bgTint = isUp
    ? 'bg-emerald-50 border-emerald-100'
    : isDown
    ? 'bg-red-50 border-red-100'
    : 'bg-gray-50 border-gray-200';

  return (
    <div className={`rounded-2xl border p-6 card-hover ${bgTint}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="text-lg">🤖</span>
          <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
            AI Decision
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 live-dot" />
          <span className="text-xs text-gray-400">{aiDecision.updatedAgo}</span>
        </div>
      </div>

      {/* Main decision block */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-5">
        {/* Action pill — big */}
        <div
          className={`bg-gradient-to-br ${actionColor} text-white rounded-2xl px-8 py-5 text-center min-w-[120px] shadow-md`}
        >
          <p className="text-xs font-semibold uppercase tracking-widest opacity-80 mb-1">
            Action
          </p>
          <p className="text-3xl font-extrabold leading-none">{aiDecision.action}</p>
          <p className="text-sm font-semibold opacity-90 mt-1">{aiDecision.asset}</p>
        </div>

        {/* Details */}
        <div className="flex-1 space-y-3">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {aiDecision.assetName}
              <span className="text-base font-normal text-gray-400 ml-2">
                @ ${aiDecision.price.toLocaleString()}
              </span>
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Strategy: {aiDecision.strategy}</p>
          </div>

          {/* Confidence bar */}
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="text-xs font-medium text-gray-500">AI Confidence</span>
              <span className={`text-xs font-bold ${isUp ? 'text-emerald-600' : isDown ? 'text-red-500' : 'text-gray-500'}`}>
                {aiDecision.confidence}%
              </span>
            </div>
            <div className="h-2 bg-white bg-opacity-60 rounded-full overflow-hidden border border-white">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${actionColor} confidence-bar-fill`}
                style={{ '--fill': `${aiDecision.confidence}%`, width: `${aiDecision.confidence}%` }}
              />
            </div>
          </div>

          {/* Reason */}
          <p className="text-sm text-gray-600 leading-relaxed bg-white bg-opacity-60 rounded-xl p-3 border border-white">
            💡 {aiDecision.reason}
          </p>
        </div>
      </div>
    </div>
  );
};
