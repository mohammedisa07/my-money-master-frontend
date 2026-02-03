import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Transaction, 
  TransactionType, 
  Category, 
  Division, 
  INCOME_CATEGORIES, 
  EXPENSE_CATEGORIES, 
  CATEGORY_CONFIG 
} from '@/types/transaction';
import { format } from 'date-fns';
import { CalendarIcon, TrendingUp, TrendingDown, ArrowRightLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockAccounts } from '@/data/mockData';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  editTransaction?: Transaction | null;
}

export function AddTransactionModal({ isOpen, onClose, onAdd, editTransaction }: AddTransactionModalProps) {
  const [type, setType] = useState<TransactionType>(editTransaction?.type || 'expense');
  const [amount, setAmount] = useState(editTransaction?.amount?.toString() || '');
  const [description, setDescription] = useState(editTransaction?.description || '');
  const [category, setCategory] = useState<Category>(editTransaction?.category || 'other');
  const [division, setDivision] = useState<Division>(editTransaction?.division || 'personal');
  const [date, setDate] = useState<Date>(editTransaction?.date ? new Date(editTransaction.date) : new Date());
  const [fromAccount, setFromAccount] = useState(editTransaction?.fromAccount || '');
  const [toAccount, setToAccount] = useState(editTransaction?.toAccount || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description || !category) return;

    onAdd({
      type,
      amount: parseFloat(amount),
      description,
      category,
      division,
      date,
      fromAccount: type === 'transfer' ? fromAccount : undefined,
      toAccount: type === 'transfer' ? toAccount : undefined,
    });

    // Reset form
    setAmount('');
    setDescription('');
    setCategory('other');
    setDivision('personal');
    setDate(new Date());
    setFromAccount('');
    setToAccount('');
    onClose();
  };

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editTransaction ? 'Edit Transaction' : 'Add Transaction'}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={type} onValueChange={(v) => setType(v as TransactionType)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="income" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Income
            </TabsTrigger>
            <TabsTrigger value="expense" className="gap-2">
              <TrendingDown className="h-4 w-4" />
              Expense
            </TabsTrigger>
            <TabsTrigger value="transfer" className="gap-2">
              <ArrowRightLeft className="h-4 w-4" />
              Transfer
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="What was this for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={100}
                required
              />
            </div>

            {/* Transfer accounts */}
            {type === 'transfer' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>From Account</Label>
                  <Select value={fromAccount} onValueChange={setFromAccount}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockAccounts.map((acc) => (
                        <SelectItem key={acc.id} value={acc.type}>
                          {acc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>To Account</Label>
                  <Select value={toAccount} onValueChange={setToAccount}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockAccounts.map((acc) => (
                        <SelectItem key={acc.id} value={acc.type}>
                          {acc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Category */}
            {type !== 'transfer' && (
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {CATEGORY_CONFIG[cat].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Division */}
            <div className="space-y-2">
              <Label>Division</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={division === 'personal' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDivision('personal')}
                  className="flex-1"
                >
                  Personal
                </Button>
                <Button
                  type="button"
                  variant={division === 'office' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDivision('office')}
                  className="flex-1"
                >
                  Office
                </Button>
              </div>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label>Date & Time</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP p') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button
                type="submit"
                className={cn(
                  'flex-1',
                  type === 'income' && 'bg-income hover:bg-income/90 text-income-foreground',
                  type === 'expense' && 'bg-expense hover:bg-expense/90 text-expense-foreground',
                  type === 'transfer' && 'bg-transfer hover:bg-transfer/90 text-transfer-foreground'
                )}
              >
                {editTransaction ? 'Update' : 'Add'} {type}
              </Button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
