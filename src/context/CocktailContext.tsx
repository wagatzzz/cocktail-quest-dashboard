
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cocktail } from '../utils/api';
import { toast } from 'sonner';

// Define rating properties for cocktails
export interface CocktailRating {
  sweet: number;
  sour: number;
  bitter: number;
  strong: number;
  overall: number;
  count: number;
}

// Define cocktail with added dashboard properties
export interface DashboardCocktail extends Cocktail {
  isFavorite: boolean;
  ratings: CocktailRating;
  addedAt: Date;
}

interface CocktailContextType {
  favorites: DashboardCocktail[];
  addToFavorites: (cocktail: Cocktail) => void;
  removeFromFavorites: (id: string) => void;
  isFavorite: (id: string) => boolean;
  rateCocktail: (id: string, ratings: Partial<Omit<CocktailRating, 'count'>>) => void;
  getTopRatedCocktails: (limit?: number) => DashboardCocktail[];
  getCocktailById: (id: string) => DashboardCocktail | undefined;
}

const CocktailContext = createContext<CocktailContextType | undefined>(undefined);

// Custom hook to use the cocktail context
export const useCocktails = () => {
  const context = useContext(CocktailContext);
  if (!context) {
    throw new Error('useCocktails must be used within a CocktailProvider');
  }
  return context;
};

// Provider component
export const CocktailProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<DashboardCocktail[]>([]);

  // Load favorites from localStorage on initial render
  useEffect(() => {
    const savedFavorites = localStorage.getItem('cocktailFavorites');
    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites);
        // Convert string dates back to Date objects
        const formattedFavorites = parsedFavorites.map((fav: any) => ({
          ...fav,
          addedAt: new Date(fav.addedAt),
        }));
        setFavorites(formattedFavorites);
      } catch (error) {
        console.error('Error parsing saved favorites:', error);
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cocktailFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Add a cocktail to favorites
  const addToFavorites = (cocktail: Cocktail) => {
    if (isFavorite(cocktail.idDrink)) {
      toast.info('Cocktail already in your collection');
      return;
    }

    const dashboardCocktail: DashboardCocktail = {
      ...cocktail,
      isFavorite: true,
      ratings: {
        sweet: 0,
        sour: 0,
        bitter: 0,
        strong: 0,
        overall: 0,
        count: 0,
      },
      addedAt: new Date(),
    };

    setFavorites(prev => [...prev, dashboardCocktail]);
    toast.success('Cocktail added to your collection');
  };

  // Remove a cocktail from favorites
  const removeFromFavorites = (id: string) => {
    setFavorites(prev => prev.filter(cocktail => cocktail.idDrink !== id));
    toast.success('Cocktail removed from your collection');
  };

  // Check if a cocktail is in favorites
  const isFavorite = (id: string) => {
    return favorites.some(cocktail => cocktail.idDrink === id);
  };

  // Rate a cocktail
  const rateCocktail = (id: string, ratings: Partial<Omit<CocktailRating, 'count'>>) => {
    setFavorites(prev => prev.map(cocktail => {
      if (cocktail.idDrink === id) {
        const newCount = cocktail.ratings.count + 1;
        const newRatings = {
          sweet: ratings.sweet !== undefined 
            ? (cocktail.ratings.sweet * cocktail.ratings.count + ratings.sweet) / newCount
            : cocktail.ratings.sweet,
          sour: ratings.sour !== undefined 
            ? (cocktail.ratings.sour * cocktail.ratings.count + ratings.sour) / newCount
            : cocktail.ratings.sour,
          bitter: ratings.bitter !== undefined 
            ? (cocktail.ratings.bitter * cocktail.ratings.count + ratings.bitter) / newCount
            : cocktail.ratings.bitter,
          strong: ratings.strong !== undefined 
            ? (cocktail.ratings.strong * cocktail.ratings.count + ratings.strong) / newCount
            : cocktail.ratings.strong,
          overall: ratings.overall !== undefined 
            ? (cocktail.ratings.overall * cocktail.ratings.count + ratings.overall) / newCount
            : cocktail.ratings.overall,
          count: newCount,
        };
        
        return {
          ...cocktail,
          ratings: newRatings,
        };
      }
      return cocktail;
    }));
    
    toast.success('Rating submitted!');
  };

  // Get top rated cocktails
  const getTopRatedCocktails = (limit = 10) => {
    return [...favorites]
      .filter(cocktail => cocktail.ratings.count > 0)
      .sort((a, b) => b.ratings.overall - a.ratings.overall)
      .slice(0, limit);
  };

  // Get cocktail by ID
  const getCocktailById = (id: string) => {
    return favorites.find(cocktail => cocktail.idDrink === id);
  };

  return (
    <CocktailContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        rateCocktail,
        getTopRatedCocktails,
        getCocktailById,
      }}
    >
      {children}
    </CocktailContext.Provider>
  );
};
