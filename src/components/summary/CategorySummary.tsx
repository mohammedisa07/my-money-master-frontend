import { CATEGORY_CONFIG, Category } from '@/types/transaction';
import { CategoryBadge } from '@/components/transactions/CategoryBadge';
import { cn } from '@/lib/utils';

interface CategorySummaryProps {
  data: { category: string; amount: number; count: number }[];
  totalAmount: number;
}

export function CategorySummary({ data, totalAmount }: CategorySummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (data.length === 0) {
    return (
      <div className="stat-card">
        <h3 className="mb-4 text-lg font-semibold">Category Summary</h3>
        <p className="text-muted-foreground text-center py-8">
          No transactions in this period
        </p>
      </div>
    );
  }

  return (
    <div className="stat-card">
      <h3 className="mb-6 text-lg font-semibold">Category Summary</h3>
      <div className="space-y-4">
        {data.map((item) => {
          const percentage = totalAmount > 0 ? (item.amount / totalAmount) * 100 : 0;
          
          return (
            <div key={item.category} className="space-y-2">
              <div className="flex items-center justify-between">
                <CategoryBadge category={item.category as Category} size="sm" />
                <div className="text-right">
                  <p className="font-medium text-foreground">{formatCurrency(item.amount)}</p>
                  <p className="text-xs text-muted-foreground">{item.count} transactions</p>
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    CATEGORY_CONFIG[item.category as Category]?.color || 'bg-primary'
                  )}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
