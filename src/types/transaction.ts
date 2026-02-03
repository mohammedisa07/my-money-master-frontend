export type TransactionType = 'income' | 'expense' | 'transfer';

export type Division = 'office' | 'personal';

export type Category = 
  | 'fuel'
  | 'food'
  | 'movie'
  | 'loan'
  | 'medical'
  | 'shopping'
  | 'travel'
  | 'salary'
  | 'investment'
  | 'entertainment'
  | 'utilities'
  | 'rent'
  | 'freelance'
  | 'bonus'
  | 'other';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: Category;
  division: Division;
  date: Date;
  createdAt: Date;
  fromAccount?: string;
  toAccount?: string;
}

export interface Account {
  id: string;
  name: string;
  balance: number;
  type: 'cash' | 'bank' | 'credit' | 'savings';
}

export type TimePeriod = 'weekly' | 'monthly' | 'yearly';

export interface FilterOptions {
  division?: Division;
  category?: Category;
  dateFrom?: Date;
  dateTo?: Date;
  type?: TransactionType;
}

export const CATEGORY_CONFIG: Record<Category, { label: string; color: string; icon: string }> = {
  fuel: { label: 'Fuel', color: 'bg-category-fuel', icon: 'Fuel' },
  food: { label: 'Food', color: 'bg-category-food', icon: 'UtensilsCrossed' },
  movie: { label: 'Movie', color: 'bg-category-movie', icon: 'Film' },
  loan: { label: 'Loan', color: 'bg-category-loan', icon: 'Landmark' },
  medical: { label: 'Medical', color: 'bg-category-medical', icon: 'Heart' },
  shopping: { label: 'Shopping', color: 'bg-category-shopping', icon: 'ShoppingBag' },
  travel: { label: 'Travel', color: 'bg-category-travel', icon: 'Plane' },
  salary: { label: 'Salary', color: 'bg-category-salary', icon: 'Wallet' },
  investment: { label: 'Investment', color: 'bg-category-investment', icon: 'TrendingUp' },
  entertainment: { label: 'Entertainment', color: 'bg-category-movie', icon: 'Gamepad2' },
  utilities: { label: 'Utilities', color: 'bg-category-fuel', icon: 'Zap' },
  rent: { label: 'Rent', color: 'bg-category-loan', icon: 'Home' },
  freelance: { label: 'Freelance', color: 'bg-category-salary', icon: 'Briefcase' },
  bonus: { label: 'Bonus', color: 'bg-category-investment', icon: 'Gift' },
  other: { label: 'Other', color: 'bg-category-other', icon: 'MoreHorizontal' },
};

export const INCOME_CATEGORIES: Category[] = ['salary', 'freelance', 'investment', 'bonus', 'other'];
export const EXPENSE_CATEGORIES: Category[] = ['fuel', 'food', 'movie', 'loan', 'medical', 'shopping', 'travel', 'entertainment', 'utilities', 'rent', 'other'];
