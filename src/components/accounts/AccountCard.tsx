import { Account } from '@/types/transaction';
import { cn } from '@/lib/utils';
import { Wallet, Building2, CreditCard, PiggyBank } from 'lucide-react';

interface AccountCardProps {
  account: Account;
}

const iconMap = {
  cash: Wallet,
  bank: Building2,
  credit: CreditCard,
  savings: PiggyBank,
};

export function AccountCard({ account }: AccountCardProps) {
  const Icon = iconMap[account.type];
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="stat-card flex items-center gap-4">
      <div
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-xl',
          account.type === 'cash' && 'bg-income/10 text-income',
          account.type === 'bank' && 'bg-primary/10 text-primary',
          account.type === 'credit' && 'bg-expense/10 text-expense',
          account.type === 'savings' && 'bg-accent/10 text-accent'
        )}
      >
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{account.name}</p>
        <p
          className={cn(
            'text-xl font-bold',
            account.balance >= 0 ? 'text-foreground' : 'text-expense'
          )}
        >
          {formatCurrency(account.balance)}
        </p>
      </div>
    </div>
  );
}
