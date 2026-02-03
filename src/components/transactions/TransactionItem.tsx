import { Transaction } from '@/types/transaction';
import { CategoryBadge } from './CategoryBadge';
import { format, differenceInHours } from 'date-fns';
import { cn } from '@/lib/utils';
import { Pencil, Trash2, Clock, ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TransactionItemProps {
  transaction: Transaction;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: string) => void;
  canEdit: boolean;
}

export function TransactionItem({ transaction, onEdit, onDelete, canEdit }: TransactionItemProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const hoursRemaining = Math.max(0, 12 - differenceInHours(new Date(), new Date(transaction.createdAt)));

  return (
    <div className="transaction-item group animate-fade-in">
      {/* Category Icon */}
      <CategoryBadge category={transaction.category} showLabel={false} size="md" />

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-foreground truncate">{transaction.description}</p>
          {transaction.type === 'transfer' && (
            <ArrowRightLeft className="h-4 w-4 text-transfer" />
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{format(new Date(transaction.date), 'MMM d, yyyy • h:mm a')}</span>
          <span className={cn(
            'division-badge',
            transaction.division === 'office' ? 'division-office' : 'division-personal'
          )}>
            {transaction.division}
          </span>
        </div>
      </div>

      {/* Amount */}
      <div className="text-right">
        <p
          className={cn(
            'font-semibold',
            transaction.type === 'income' && 'text-income',
            transaction.type === 'expense' && 'text-expense',
            transaction.type === 'transfer' && 'text-transfer'
          )}
        >
          {transaction.type === 'income' ? '+' : '-'}
          {formatCurrency(transaction.amount)}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {canEdit ? (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit?.(transaction)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-expense hover:text-expense"
              onClick={() => onDelete?.(transaction.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1 text-xs text-muted-foreground ml-2">
              <Clock className="h-3 w-3" />
              {hoursRemaining}h left
            </div>
          </>
        ) : (
          <span className="text-xs text-muted-foreground">Locked</span>
        )}
      </div>
    </div>
  );
}
