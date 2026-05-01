import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const formatXAxis = (value) => {
  const date = new Date(value);
  return `${date.getUTCDate()}/${date.getUTCMonth() + 1}`;
};

export const PriceChart = ({ points = [], color = '#9ae6b4', height = 260 }) => (
  <div style={{ height }}>
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={points}>
        <defs>
          <linearGradient id="priceFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.28} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
        <XAxis
          dataKey="timestamp"
          tickFormatter={formatXAxis}
          tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={['auto', 'auto']}
          tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={72}
          tickFormatter={(value) => `$${Math.round(value).toLocaleString()}`}
        />
        <Tooltip
          contentStyle={{
            background: '#111',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#fff',
          }}
          formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Price']}
          labelFormatter={(value) => new Date(value).toUTCString()}
        />
        <Area type="monotone" dataKey="price" stroke={color} fill="url(#priceFill)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);
