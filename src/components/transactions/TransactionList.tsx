import { Transaction } from '@/types/transaction';
import { TransactionItem } from './TransactionItem';
import { format, isToday, isYesterday, isSameDay } from 'date-fns';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: string) => void;
  canEdit: (transaction: Transaction) => boolean;
}

export function TransactionList({ transactions, onEdit, onDelete, canEdit }: TransactionListProps) {
  // Group transactions by date
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const date = new Date(transaction.date);
    const dateKey = format(date, 'yyyy-MM-dd');
    
    if (!groups[dateKey]) {
      groups[dateKey] = {
        date,
        transactions: [],
      };
    }
    groups[dateKey].transactions.push(transaction);
    return groups;
  }, {} as Record<string, { date: Date; transactions: Transaction[] }>);

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'EEEE, MMMM d');
  };

  const sortedGroups = Object.entries(groupedTransactions).sort(
    ([, a], [, b]) => b.date.getTime() - a.date.getTime()
  );

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <span className="text-2xl">📊</span>
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No transactions found</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Start adding your income and expenses to see them here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sortedGroups.map(([dateKey, group]) => (
        <div key={dateKey}>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 px-1">
            {getDateLabel(group.date)}
          </h3>
          <div className="space-y-2">
            {group.transactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onEdit={onEdit}
                onDelete={onDelete}
                canEdit={canEdit(transaction)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
