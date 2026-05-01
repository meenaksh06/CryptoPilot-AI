import { BrainCircuit } from 'lucide-react';
import { aiDecision } from '../../data/mockData';

export const AIDecisionPanel = () => {
  const isUp = aiDecision.action === 'BUY';
  const isDown = aiDecision.action === 'SELL';
  const accent = isUp ? 'text-emerald-200' : isDown ? 'text-red-200' : 'text-white/60';
  const bar = isUp ? 'bg-emerald-300' : isDown ? 'bg-red-300' : 'bg-white/45';

  return (
    <div className="premium-panel p-6 lg:p-7">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center border border-white/10 bg-white/[0.04] text-white/60">
            <BrainCircuit size={18} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/35">AI decision</p>
            <p className="text-sm text-white/45">{aiDecision.updatedAgo}</p>
          </div>
        </div>
        <span className="h-2 w-2 rounded-full bg-emerald-300 live-dot" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[180px_1fr]">
        <div className="border border-white/10 bg-white/[0.04] p-5 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/35">Action</p>
          <p className={`mt-4 text-5xl font-black tracking-[-0.04em] ${accent}`}>{aiDecision.action}</p>
          <p className="mt-2 text-sm font-bold uppercase tracking-[0.2em] text-white/45">{aiDecision.asset}</p>
        </div>

        <div className="min-w-0">
          <h3 className="text-3xl font-black tracking-[-0.03em] text-white">
            {aiDecision.assetName}
            <span className="ml-3 text-base font-medium text-white/38">@ ${aiDecision.price.toLocaleString()}</span>
          </h3>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.22em] text-white/35">
            Strategy: {aiDecision.strategy}
          </p>

          <div className="mt-6">
            <div className="mb-2 flex justify-between text-xs font-bold uppercase tracking-[0.2em]">
              <span className="text-white/35">Confidence</span>
              <span className={accent}>{aiDecision.confidence}%</span>
            </div>
            <div className="h-2 overflow-hidden bg-white/10">
              <div className={`h-full ${bar} confidence-bar-fill`} style={{ '--fill': `${aiDecision.confidence}%`, width: `${aiDecision.confidence}%` }} />
            </div>
          </div>

          <p className="mt-5 border border-white/10 bg-black/20 p-4 text-sm leading-6 text-white/58">
            {aiDecision.reason}
          </p>
        </div>
      </div>
    </div>
  );
};
