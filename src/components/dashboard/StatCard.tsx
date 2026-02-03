import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  type: 'income' | 'expense' | 'balance';
  trend?: number;
  icon?: React.ReactNode;
}

export function StatCard({ title, value, type, trend, icon }: StatCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getTrendIcon = () => {
    if (!trend) return <Minus className="h-4 w-4 text-muted-foreground" />;
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-income" />;
    return <TrendingDown className="h-4 w-4 text-expense" />;
  };

  return (
    <div
      className={cn(
        'stat-card animate-fade-in',
        type === 'income' && 'stat-card-income',
        type === 'expense' && 'stat-card-expense',
        type === 'balance' && 'stat-card-balance'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p
            className={cn(
              'text-2xl font-bold tracking-tight',
              type === 'income' && 'text-income',
              type === 'expense' && 'text-expense',
              type === 'balance' && 'text-primary'
            )}
          >
            {type === 'expense' && value > 0 ? '-' : ''}
            {formatCurrency(Math.abs(value))}
          </p>
        </div>
        
        {icon && (
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg',
              type === 'income' && 'bg-income/10 text-income',
              type === 'expense' && 'bg-expense/10 text-expense',
              type === 'balance' && 'bg-primary/10 text-primary'
            )}
          >
            {icon}
          </div>
        )}
      </div>

      {trend !== undefined && (
        <div className="mt-4 flex items-center gap-1 text-sm">
          {getTrendIcon()}
          <span
            className={cn(
              'font-medium',
              trend > 0 ? 'text-income' : trend < 0 ? 'text-expense' : 'text-muted-foreground'
            )}
          >
            {Math.abs(trend)}%
          </span>
          <span className="text-muted-foreground">vs last period</span>
        </div>
      )}
    </div>
  );
}
