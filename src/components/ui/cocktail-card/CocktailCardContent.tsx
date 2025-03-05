
import React from 'react';
import { cn } from '@/lib/utils';
import { Cocktail } from '@/utils/api';

interface CocktailCardContentProps {
  cocktail: Cocktail;
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
}

const CocktailCardContent: React.FC<CocktailCardContentProps> = ({
  cocktail,
  variant = 'default',
  className,
}) => {
  return (
    <div className={cn("p-4", className)}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-lg line-clamp-1">{cocktail.strDrink}</h3>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
          {cocktail.strCategory || 'Uncategorized'}
        </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
          {cocktail.strAlcoholic || 'Unknown'}
        </span>
      </div>
      
      {variant !== 'compact' && (
        <p className="text-sm text-muted-foreground line-clamp-2">
          {cocktail.strInstructions || 'No instructions available.'}
        </p>
      )}
    </div>
  );
};

export default CocktailCardContent;
