import { insights } from '../../data/mockData';
import { ActionBadge, SectionHeader } from '../ui/Badge';
import { useApp } from '../../context/AppContext';

const colorMap = {
  green:  { light: 'border-emerald-100 bg-emerald-50/50', dark: 'border-emerald-800/30 bg-emerald-950/30', val: 'text-emerald-500' },
  red:    { light: 'border-red-100 bg-red-50/40',          dark: 'border-red-800/30 bg-red-950/30',         val: 'text-red-500'     },
  yellow: { light: 'border-amber-100 bg-amber-50/50',      dark: 'border-amber-800/30 bg-amber-950/30',     val: 'text-amber-500'   },
  blue:   { light: 'border-blue-100 bg-blue-50/40',        dark: 'border-blue-800/30 bg-blue-950/30',       val: 'text-blue-400'    },
};

export const AIInsights = () => {
  const { darkMode: dark } = useApp();
  return (
    <section>
      <SectionHeader title="AI Insights" subtitle="Smart signals updated every 2 seconds" dark={dark} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((item) => {
          const c = colorMap[item.color] || colorMap.blue;
          const bg = dark ? c.dark : c.light;
          return (
            <div key={item.id} className={`rounded-2xl border p-4 card-hover cursor-pointer ${bg}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xl">{item.icon}</span>
                <ActionBadge action={item.action} />
              </div>
              <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                {item.title}
              </p>
              <p className={`text-xl font-extrabold ${c.val}`}>{item.value}</p>
              <p className={`text-xs mt-1 leading-snug ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{item.subtitle}</p>
              <p className={`text-xs font-bold mt-2 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{item.asset}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
