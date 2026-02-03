import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CATEGORY_CONFIG, Category } from '@/types/transaction';

interface CategoryChartProps {
  data: { category: string; amount: number; count: number }[];
}

const COLORS = [
  'hsl(160, 84%, 25%)',
  'hsl(45, 93%, 47%)',
  'hsl(0, 72%, 51%)',
  'hsl(200, 80%, 50%)',
  'hsl(280, 70%, 55%)',
  'hsl(25, 95%, 53%)',
  'hsl(175, 70%, 45%)',
  'hsl(340, 75%, 55%)',
];

export function CategoryChart({ data }: CategoryChartProps) {
  const chartData = data.slice(0, 8).map((item) => ({
    name: CATEGORY_CONFIG[item.category as Category]?.label || item.category,
    value: item.amount,
    count: item.count,
  }));

  if (chartData.length === 0) {
    return (
      <div className="stat-card flex h-[350px] items-center justify-center">
        <p className="text-muted-foreground">No data for this period</p>
      </div>
    );
  }

  return (
    <div className="stat-card">
      <h3 className="mb-4 text-lg font-semibold">Category Breakdown</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
            />
            <Legend 
              layout="vertical"
              align="right"
              verticalAlign="middle"
              formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
