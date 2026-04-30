import { insights } from '../../data/mockData';
import { ActionBadge } from '../ui/Badge';
import { SectionHeader } from '../ui/Badge';

const colorMap = {
  green:  { card: 'border-emerald-100 bg-emerald-50/50', val: 'text-emerald-600' },
  red:    { card: 'border-red-100 bg-red-50/40',          val: 'text-red-500' },
  yellow: { card: 'border-amber-100 bg-amber-50/50',      val: 'text-amber-600' },
  blue:   { card: 'border-blue-100 bg-blue-50/40',        val: 'text-blue-600' },
};

export const AIInsights = () => (
  <section>
    <SectionHeader title="AI Insights" subtitle="Smart signals updated every 2 seconds" />
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {insights.map((item) => {
        const c = colorMap[item.color] || colorMap.blue;
        return (
          <div
            key={item.id}
            className={`rounded-2xl border p-4 card-hover cursor-pointer ${c.card}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xl">{item.icon}</span>
              <ActionBadge action={item.action} />
            </div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              {item.title}
            </p>
            <p className={`text-xl font-extrabold ${c.val}`}>{item.value}</p>
            <p className="text-xs text-gray-500 mt-1 leading-snug">{item.subtitle}</p>
            <p className="text-xs font-bold text-gray-400 mt-2">{item.asset}</p>
          </div>
        );
      })}
    </div>
  </section>
);
