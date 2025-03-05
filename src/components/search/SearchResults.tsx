
import React from 'react';
import { Wine, X } from 'lucide-react';
import { Cocktail } from '@/utils/api';
import CocktailCard from '@/components/ui/CocktailCard';
import { Button } from '@/components/ui/button';

interface SearchResultsProps {
  loading: boolean;
  cocktails: Cocktail[];
  initialQuery: string;
  selectedCategory: string;
  selectedAlcoholic: 'Alcoholic' | 'Non_Alcoholic' | '';
  clearFilters: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  loading,
  cocktails,
  initialQuery,
  selectedCategory,
  selectedAlcoholic,
  clearFilters
}) => {
  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
        <div className="text-center text-muted-foreground">Loading cocktails...</div>
      </div>
    );
  }

  if (cocktails.length > 0) {
    return (
      <>
        <div className="mb-8">
          <h2 className="text-xl font-medium">
            Found {cocktails.length} {cocktails.length === 1 ? 'cocktail' : 'cocktails'}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cocktails.map((cocktail) => (
            <CocktailCard 
              key={cocktail.idDrink}
              cocktail={cocktail}
              className="animate-fade-up"
            />
          ))}
        </div>
      </>
    );
  }

  if (initialQuery || selectedCategory || selectedAlcoholic) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <Wine className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-medium mb-2">No cocktails found</h2>
        <p className="text-muted-foreground mb-8">
          Try using different search terms or filters
        </p>
        <Button variant="outline" onClick={clearFilters}>
          Clear Search
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center py-20">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
        <Wine className="h-8 w-8 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-medium mb-2">Start your search</h2>
      <p className="text-muted-foreground">
        Use the search bar above to find cocktails
      </p>
    </div>
  );
};

export default SearchResults;
