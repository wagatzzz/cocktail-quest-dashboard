
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Cocktail } from '@/utils/api';
import { useCocktails } from '@/context/CocktailContext';

interface CocktailCardImageProps {
  cocktail: Cocktail;
  showActions?: boolean;
  className?: string;
}

const CocktailCardImage: React.FC<CocktailCardImageProps> = ({
  cocktail,
  showActions = true,
  className,
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

  return (
    <div className={cn("relative overflow-hidden", className)}>
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
  );
};

export default CocktailCardImage;
