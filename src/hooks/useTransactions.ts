import { useState, useMemo, useCallback, useEffect } from 'react';
import { Transaction, FilterOptions, TimePeriod } from '@/types/transaction';
import { transactionService } from '@/lib/api';
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  isWithinInterval,
  differenceInHours
} from 'date-fns';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('monthly');

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await transactionService.getAll(filters);
      setTransactions(response.data);
    } catch (err) {
      setError('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const getDateRange = useCallback((period: TimePeriod) => {
    const now = new Date();
    switch (period) {
      case 'weekly':
        return { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) };
      case 'monthly':
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case 'yearly':
        return { start: startOfYear(now), end: endOfYear(now) };
    }
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      // Time period filter
      const { start, end } = getDateRange(timePeriod);
      if (!isWithinInterval(new Date(t.date), { start, end })) return false;

      // Division filter
      if (filters.division && t.division !== filters.division) return false;

      // Category filter
      if (filters.category && t.category !== filters.category) return false;

      // Type filter
      if (filters.type && t.type !== filters.type) return false;

      // Date range filter
      if (filters.dateFrom && new Date(t.date) < filters.dateFrom) return false;
      if (filters.dateTo && new Date(t.date) > filters.dateTo) return false;

      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filters, timePeriod, getDateRange]);

  const stats = useMemo(() => {
    const income = filteredTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = filteredTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income,
      expense,
      balance: income - expense,
      transactionCount: filteredTransactions.length,
    };
  }, [filteredTransactions]);

  const categoryBreakdown = useMemo(() => {
    const breakdown: Record<string, { amount: number; count: number }> = {};

    filteredTransactions.forEach((t) => {
      if (!breakdown[t.category]) {
        breakdown[t.category] = { amount: 0, count: 0 };
      }
      breakdown[t.category].amount += t.amount;
      breakdown[t.category].count += 1;
    });

    return Object.entries(breakdown)
      .map(([category, data]) => ({
        category,
        ...data,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [filteredTransactions]);

  const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    try {
      const response = await transactionService.create(transaction);
      setTransactions((prev) => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      setError('Failed to add transaction');
    }
  }, []);

  const canEdit = useCallback((transaction: Transaction) => {
    const hoursSinceCreation = differenceInHours(new Date(), new Date(transaction.createdAt));
    return hoursSinceCreation < 12;
  }, []);

  const updateTransaction = useCallback(async (id: string, updates: Partial<Transaction>) => {
    try {
      const response = await transactionService.update(id, updates);
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? response.data : t))
      );
    } catch (err) {
      setError('Failed to update transaction');
    }
  }, []);

  const deleteTransaction = useCallback(async (id: string) => {
    try {
      await transactionService.delete(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      return true;
    } catch (err) {
      setError('Failed to delete transaction');
      return false;
    }
  }, []);

  const allTransactions = useMemo(() => {
    return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions]);

  return {
    transactions: filteredTransactions,
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
    loading,
    error,
  };
}
