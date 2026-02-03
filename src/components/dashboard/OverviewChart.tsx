import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Transaction, TimePeriod } from '@/types/transaction';
import { format, startOfWeek, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, startOfMonth, startOfYear, endOfYear, endOfMonth, endOfWeek } from 'date-fns';

interface OverviewChartProps {
  transactions: Transaction[];
  timePeriod: TimePeriod;
}

export function OverviewChart({ transactions, timePeriod }: OverviewChartProps) {
  const chartData = useMemo(() => {
    const now = new Date();
    let intervals: Date[];
    let formatStr: string;

    switch (timePeriod) {
      case 'weekly':
        intervals = eachDayOfInterval({
          start: startOfWeek(now, { weekStartsOn: 1 }),
          end: endOfWeek(now, { weekStartsOn: 1 }),
        });
        formatStr = 'EEE';
        break;
      case 'monthly':
        intervals = eachWeekOfInterval({
          start: startOfMonth(now),
          end: endOfMonth(now),
        }, { weekStartsOn: 1 });
        formatStr = "'Week' w";
        break;
      case 'yearly':
        intervals = eachMonthOfInterval({
          start: startOfYear(now),
          end: endOfYear(now),
        });
        formatStr = 'MMM';
        break;
    }

    return intervals.map((date) => {
      const income = transactions
        .filter((t) => {
          const tDate = new Date(t.date);
          if (timePeriod === 'weekly') {
            return format(tDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') && t.type === 'income';
          }
          if (timePeriod === 'monthly') {
            return format(tDate, 'yyyy-ww') === format(date, 'yyyy-ww') && t.type === 'income';
          }
          return format(tDate, 'yyyy-MM') === format(date, 'yyyy-MM') && t.type === 'income';
        })
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = transactions
        .filter((t) => {
          const tDate = new Date(t.date);
          if (timePeriod === 'weekly') {
            return format(tDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') && t.type === 'expense';
          }
          if (timePeriod === 'monthly') {
            return format(tDate, 'yyyy-ww') === format(date, 'yyyy-ww') && t.type === 'expense';
          }
          return format(tDate, 'yyyy-MM') === format(date, 'yyyy-MM') && t.type === 'expense';
        })
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        name: format(date, formatStr),
        income,
        expense,
      };
    });
  }, [transactions, timePeriod]);

  return (
    <div className="stat-card">
      <h3 className="mb-6 text-lg font-semibold">Income vs Expenses</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(45, 93%, 47%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(45, 93%, 47%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke="hsl(45, 93%, 47%)"
              strokeWidth={2}
              fill="url(#incomeGradient)"
              name="Income"
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="hsl(0, 72%, 51%)"
              strokeWidth={2}
              fill="url(#expenseGradient)"
              name="Expense"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
