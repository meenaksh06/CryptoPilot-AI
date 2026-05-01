import { Activity, AlertTriangle, Brain, TrendingUp } from 'lucide-react';
import { insights } from '../../data/mockData';
import { ActionBadge, SectionHeader } from '../ui/Badge';

const iconMap = [TrendingUp, AlertTriangle, Brain, Activity];

const colorMap = {
  green: 'text-emerald-200',
  red: 'text-red-200',
  yellow: 'text-amber-200',
  blue: 'text-sky-200',
};

export const AIInsights = () => (
  <section>
    <SectionHeader title="AI Insights" subtitle="Smart signals updated every 2 seconds" />
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {insights.map((item, index) => {
        const Icon = iconMap[index] || Activity;
        const color = colorMap[item.color] || colorMap.blue;
        return (
          <div key={item.id} className="premium-panel card-hover p-4">
            <div className="mb-5 flex items-center justify-between">
              <Icon size={20} className="text-white/40" />
              <ActionBadge action={item.action} />
            </div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">{item.title}</p>
            <p className={`text-2xl font-black tracking-tight ${color}`}>{item.value}</p>
            <p className="mt-2 text-xs leading-5 text-white/45">{item.subtitle}</p>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-white/30">{item.asset}</p>
          </div>
        );
      })}
    </div>
  </section>
);
