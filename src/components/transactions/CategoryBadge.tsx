import { Category, CATEGORY_CONFIG } from '@/types/transaction';
import { 
  Fuel, 
  UtensilsCrossed, 
  Film, 
  Landmark, 
  Heart, 
  ShoppingBag, 
  Plane, 
  Wallet, 
  TrendingUp, 
  Gamepad2, 
  Zap, 
  Home, 
  Briefcase, 
  Gift, 
  MoreHorizontal 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Fuel,
  UtensilsCrossed,
  Film,
  Landmark,
  Heart,
  ShoppingBag,
  Plane,
  Wallet,
  TrendingUp,
  Gamepad2,
  Zap,
  Home,
  Briefcase,
  Gift,
  MoreHorizontal,
};

interface CategoryBadgeProps {
  category: Category;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function CategoryBadge({ category, showLabel = true, size = 'md' }: CategoryBadgeProps) {
  const config = CATEGORY_CONFIG[category];
  const Icon = iconMap[config.icon] || MoreHorizontal;

  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-sm',
    lg: 'h-10 w-10 text-base',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          'flex items-center justify-center rounded-lg text-white',
          config.color,
          sizeClasses[size]
        )}
      >
        <Icon className={iconSizes[size]} />
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-foreground">{config.label}</span>
      )}
    </div>
  );
}
