
import React from 'react';
import SearchBar from '@/components/ui/SearchBar';
import SearchFilters from './SearchFilters';

interface SearchHeaderProps {
  initialQuery: string;
  performSearch: (query: string) => void;
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedAlcoholic: 'Alcoholic' | 'Non_Alcoholic' | '';
  setSelectedAlcoholic: (value: 'Alcoholic' | 'Non_Alcoholic' | '') => void;
  applyFilters: () => void;
  clearFilters: () => void;
  filtersOpen: boolean;
  setFiltersOpen: (open: boolean) => void;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  initialQuery,
  performSearch,
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedAlcoholic,
  setSelectedAlcoholic,
  applyFilters,
  clearFilters,
  filtersOpen,
  setFiltersOpen
}) => {
  return (
    <section className="pt-32 pb-16 px-6 bg-gradient-to-r from-primary/5 to-accent/5">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Find the Perfect Cocktail</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Search through thousands of cocktail recipes to find the perfect addition to your menu.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <SearchBar 
            onSearch={performSearch} 
            placeholder="Search by cocktail name..."
            initialValue={initialQuery}
            className="mb-4 animate-scale-in"
          />
          
          <div className="flex justify-center mt-4">
            <SearchFilters 
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedAlcoholic={selectedAlcoholic}
              setSelectedAlcoholic={setSelectedAlcoholic}
              applyFilters={applyFilters}
              clearFilters={clearFilters}
              filtersOpen={filtersOpen}
              setFiltersOpen={setFiltersOpen}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchHeader;
