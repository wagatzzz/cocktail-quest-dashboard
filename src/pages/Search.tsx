
import React, { useEffect } from 'react';
import { getCategories } from '@/utils/api';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SearchHeader from '@/components/search/SearchHeader';
import SearchResults from '@/components/search/SearchResults';
import { useSearchCocktails } from '@/hooks/useSearchCocktails';

const Search = () => {
  const {
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
  } = useSearchCocktails();

  // Fetch categories once when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, [setCategories]);

  // Perform initial search if there's a query in the URL
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery, performSearch]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <SearchHeader 
        initialQuery={initialQuery}
        performSearch={performSearch}
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
      
      <section className="py-12 px-6 flex-grow">
        <div className="container mx-auto max-w-7xl">
          <SearchResults 
            loading={loading}
            cocktails={cocktails}
            initialQuery={initialQuery}
            selectedCategory={selectedCategory}
            selectedAlcoholic={selectedAlcoholic}
            clearFilters={clearFilters}
          />
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Search;
