
import React from 'react';
import { cn } from '@/lib/utils';
import { Cocktail } from '@/utils/api';
import CocktailCardImage from './cocktail-card/CocktailCardImage';
import CocktailCardContent from './cocktail-card/CocktailCardContent';

interface CocktailCardProps {
  cocktail: Cocktail;
  className?: string;
  showActions?: boolean;
  variant?: 'default' | 'compact' | 'featured';
}

const CocktailCard: React.FC<CocktailCardProps> = ({
  cocktail,
  className,
  showActions = true,
  variant = 'default',
}) => {
  const variants = {
    default: 'cocktail-card max-w-sm',
    compact: 'cocktail-card max-w-xs',
    featured: 'cocktail-card max-w-2xl',
  };

  return (
    <div className={cn(variants[variant], className, 'group')}>
      <CocktailCardImage 
        cocktail={cocktail} 
        showActions={showActions} 
      />
      <CocktailCardContent 
        cocktail={cocktail} 
        variant={variant} 
      />
    </div>
  );
};

export default CocktailCard;
