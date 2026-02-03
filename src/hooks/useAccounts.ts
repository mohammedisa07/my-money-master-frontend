import { useState, useEffect, useCallback } from 'react';
import { Account } from '@/types/transaction';
import { accountService } from '@/lib/api';

export function useAccounts() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAccounts = useCallback(async () => {
        try {
            setLoading(true);
            const response = await accountService.getAll();
            setAccounts(response.data);
        } catch (err) {
            setError('Failed to fetch accounts');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts]);

    return { accounts, loading, error, refreshAccounts: fetchAccounts };
}
