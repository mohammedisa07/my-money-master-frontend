import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { StatCard } from '@/components/dashboard/StatCard';
import { TimePeriodSelector } from '@/components/dashboard/TimePeriodSelector';
import { OverviewChart } from '@/components/dashboard/OverviewChart';
import { CategoryChart } from '@/components/dashboard/CategoryChart';
import { TransactionList } from '@/components/transactions/TransactionList';
import { FilterPanel } from '@/components/transactions/FilterPanel';
import { AddTransactionModal } from '@/components/transactions/AddTransactionModal';
import { AccountCard } from '@/components/accounts/AccountCard';
import { CategorySummary } from '@/components/summary/CategorySummary';
import { useTransactions } from '@/hooks/useTransactions';
import { useAccounts } from '@/hooks/useAccounts';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, TrendingDown, Wallet, ArrowUpDown } from 'lucide-react';
import { Transaction } from '@/types/transaction';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const { toast } = useToast();

  const {
    transactions,
    allTransactions,
    stats,
    categoryBreakdown,
    filters,
    setFilters,
    timePeriod,
    setTimePeriod,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    canEdit,
    getDateRange,
    loading: transactionsLoading,
    error: transactionsError,
  } = useTransactions();

  const {
    accounts,
    loading: accountsLoading,
    error: accountsError,
  } = useAccounts();

  const handleAddTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, transaction);
      toast({
        title: 'Transaction updated',
        description: 'Your transaction has been updated successfully.',
      });
    } else {
      addTransaction(transaction);
      toast({
        title: 'Transaction added',
        description: 'Your transaction has been recorded.',
      });
    }
    setEditingTransaction(null);
  };

  const handleEdit = (transaction: Transaction) => {
    if (!canEdit(transaction)) {
      toast({
        title: 'Cannot edit',
        description: 'Transactions can only be edited within 12 hours of creation.',
        variant: 'destructive',
      });
      return;
    }
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const success = deleteTransaction(id);
    if (success) {
      toast({
        title: 'Transaction deleted',
        description: 'Your transaction has been removed.',
      });
    } else {
      toast({
        title: 'Cannot delete',
        description: 'Transactions can only be deleted within 12 hours of creation.',
        variant: 'destructive',
      });
    }
  };

  const dateRange = getDateRange(timePeriod);
  const periodLabel = `${format(dateRange.start, 'MMM d')} - ${format(dateRange.end, 'MMM d, yyyy')}`;

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className="min-h-[calc(100vh-4rem)] md:ml-64">
        <div className="container max-w-7xl py-6 px-4 md:px-6">
          {/* Page Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                {activeTab === 'dashboard' && 'Dashboard'}
                {activeTab === 'transactions' && 'Transactions'}
                {activeTab === 'accounts' && 'Accounts'}
                {activeTab === 'summary' && 'Summary'}
                {activeTab === 'budget' && 'Budget'}
                {activeTab === 'settings' && 'Settings'}
                {activeTab === 'help' && 'Help'}
              </h1>
              <p className="text-muted-foreground">{periodLabel}</p>
            </div>
            <div className="flex items-center gap-3">
              <TimePeriodSelector value={timePeriod} onChange={setTimePeriod} />
              <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Transaction</span>
              </Button>
            </div>
          </div>

          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  title="Total Income"
                  value={stats.income}
                  type="income"
                  icon={<TrendingUp className="h-5 w-5" />}
                  trend={12}
                />
                <StatCard
                  title="Total Expenses"
                  value={stats.expense}
                  type="expense"
                  icon={<TrendingDown className="h-5 w-5" />}
                  trend={-5}
                />
                <StatCard
                  title="Balance"
                  value={stats.balance}
                  type="balance"
                  icon={<Wallet className="h-5 w-5" />}
                />
                <StatCard
                  title="Transactions"
                  value={stats.transactionCount}
                  type="balance"
                  icon={<ArrowUpDown className="h-5 w-5" />}
                />
              </div>

              {/* Charts */}
              <div className="grid gap-6 lg:grid-cols-2">
                <OverviewChart transactions={allTransactions} timePeriod={timePeriod} />
                <CategoryChart data={categoryBreakdown} />
              </div>

              {/* Recent Transactions */}
              <div className="stat-card">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Recent Transactions</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab('transactions')}
                  >
                    View all
                  </Button>
                </div>
                <TransactionList
                  transactions={transactions.slice(0, 5)}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  canEdit={canEdit}
                />
              </div>
            </div>
          )}

          {/* Transactions View */}
          {activeTab === 'transactions' && (
            <div className="space-y-6">
              <FilterPanel filters={filters} onFiltersChange={setFilters} />
              <div className="stat-card">
                <TransactionList
                  transactions={transactions}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  canEdit={canEdit}
                />
              </div>
            </div>
          )}

          {/* Accounts View */}
          {activeTab === 'accounts' && (
            <div className="space-y-6">
              {accountsLoading ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 animate-pulse rounded-xl bg-card/50" />
                  ))}
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {accounts.map((account) => (
                    <AccountCard key={account.id} account={account} />
                  ))}
                </div>
              )}
              <div className="stat-card">
                <h3 className="mb-4 text-lg font-semibold">Account Transactions</h3>
                <TransactionList
                  transactions={allTransactions.filter((t) => t.type === 'transfer')}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  canEdit={canEdit}
                />
              </div>
            </div>
          )}

          {/* Summary View */}
          {
            activeTab === 'summary' && (
              <div className="grid gap-6 lg:grid-cols-2">
                <CategorySummary data={categoryBreakdown} totalAmount={stats.expense + stats.income} />
                <CategoryChart data={categoryBreakdown} />
              </div>
            )
          }

          {/* Budget View */}
          {
            activeTab === 'budget' && (
              <div className="stat-card flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-3xl">🎯</span>
                  </div>
                  <h3 className="text-lg font-semibold">Budget Planner</h3>
                  <p className="text-muted-foreground">Coming soon! Set spending limits and track your goals.</p>
                </div>
              </div>
            )
          }

          {/* Settings View */}
          {
            activeTab === 'settings' && (
              <div className="stat-card flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-3xl">⚙️</span>
                  </div>
                  <h3 className="text-lg font-semibold">Settings</h3>
                  <p className="text-muted-foreground">Customize your Money Manager experience.</p>
                </div>
              </div>
            )
          }

          {/* Help View */}
          {
            activeTab === 'help' && (
              <div className="stat-card flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-3xl">❓</span>
                  </div>
                  <h3 className="text-lg font-semibold">Help & Support</h3>
                  <p className="text-muted-foreground">Get help with using Money Manager.</p>
                </div>
              </div>
            )
          }
        </div >
      </main >

      {/* Add/Edit Transaction Modal */}
      < AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
        }}
        onAdd={handleAddTransaction}
        editTransaction={editingTransaction}
      />
    </div >
  );
};

export default Index;
