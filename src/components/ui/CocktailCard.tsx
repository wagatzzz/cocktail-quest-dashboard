
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Cocktail } from '@/utils/api';
import { Button } from '@/components/ui/button';
import { useCocktails } from '@/context/CocktailContext';
import { toast } from 'sonner';

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
  const { addToFavorites, removeFromFavorites, isFavorite } = useCocktails();
  
  const isInFavorites = isFavorite(cocktail.idDrink);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInFavorites) {
      removeFromFavorites(cocktail.idDrink);
    } else {
      addToFavorites(cocktail);
    }
  };

  const variants = {
    default: 'cocktail-card max-w-sm',
    compact: 'cocktail-card max-w-xs',
    featured: 'cocktail-card max-w-2xl',
  };

  return (
    <div className={cn(variants[variant], className, 'group')}>
      <div className="relative overflow-hidden">
        <img 
          src={cocktail.strDrinkThumb} 
          alt={cocktail.strDrink}
          className="cocktail-card-image"
        />
        
        {showActions && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center justify-between">
                <Link 
                  to={`/cocktail/${cocktail.idDrink}`}
                  className="text-white hover:underline flex items-center gap-1 text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View Details</span>
                </Link>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "rounded-full text-white hover:text-white",
                    isInFavorites ? "hover:text-white" : "hover:text-white"
                  )}
                  onClick={handleFavoriteToggle}
                >
                  <Heart className={cn("w-5 h-5", isInFavorites ? "fill-primary text-primary" : "text-white")} />
                  <span className="sr-only">
                    {isInFavorites ? "Remove from favorites" : "Add to favorites"}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4">
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
    </div>
  );
};

export default CocktailCard;
