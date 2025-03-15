
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  searchCocktailsByName, 
  Cocktail,
  filterByCategory,
  filterByAlcoholic 
} from '@/utils/api';
import { useToast } from '@/hooks/use-toast';

export const useSearchCocktails = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedAlcoholic, setSelectedAlcoholic] = useState<'Alcoholic' | 'Non_Alcoholic' | ''>('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { toast } = useToast();

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setCocktails([]);
      return;
    }
    
    setLoading(true);
    try {
      const data = await searchCocktailsByName(query);
      setCocktails(data);
      
      // Update URL params
      setSearchParams(prev => {
        if (query) {
          prev.set('q', query);
        } else {
          prev.delete('q');
        }
        return prev;
      });
    } catch (error) {
      console.error('Error searching cocktails:', error);
      toast({
        title: "Search failed",
        description: "There was a problem with your search. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [setSearchParams, toast]);

  const filterBySelectedCategory = async () => {
    if (!selectedCategory) return;
    
    setLoading(true);
    try {
      const data = await filterByCategory(selectedCategory);
      setCocktails(data);
    } catch (error) {
      console.error('Error filtering by category:', error);
      toast({
        title: "Filter failed",
        description: "There was a problem applying the category filter.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterBySelectedAlcoholic = async () => {
    if (!selectedAlcoholic) return;
    
    setLoading(true);
    try {
      const data = await filterByAlcoholic(selectedAlcoholic as 'Alcoholic' | 'Non_Alcoholic');
      setCocktails(data);
    } catch (error) {
      console.error('Error filtering by alcoholic:', error);
      toast({
        title: "Filter failed",
        description: "There was a problem applying the type filter.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    if (selectedCategory) {
      filterBySelectedCategory();
    } else if (selectedAlcoholic) {
      filterBySelectedAlcoholic();
    } else {
      if (initialQuery) {
        performSearch(initialQuery);
      } else {
        setCocktails([]);
      }
    }
    
    setFiltersOpen(false);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedAlcoholic('');
    
    if (initialQuery) {
      performSearch(initialQuery);
    } else {
      setCocktails([]);
    }
    
    setFiltersOpen(false);
  };

  return {
    initialQuery,
    cocktails,
    loading,
    categories,
    setCategories,
    selectedCategory,
    setSelectedCategory,
    selectedAlcoholic,
    setSelectedAlcoholic,
    filtersOpen,
    setFiltersOpen,
    performSearch,
    applyFilters,
    clearFilters
  };
};
