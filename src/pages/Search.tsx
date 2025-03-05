
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SearchIcon, X, Wine, Filter } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CocktailCard from '@/components/ui/CocktailCard';
import { searchCocktailsByName, searchCocktailsByIngredient, Cocktail } from '@/utils/api';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [searchType, setSearchType] = useState(searchParams.get('type') || 'name');
  const [results, setResults] = useState<Cocktail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const q = searchParams.get('q');
    const type = searchParams.get('type');
    
    if (q) {
      setQuery(q);
      if (type) setSearchType(type);
      performSearch(q, type || 'name');
    }
  }, [searchParams]);

  const performSearch = async (searchQuery: string, type: string) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let searchResults: Cocktail[] = [];
      
      if (type === 'name') {
        searchResults = await searchCocktailsByName(searchQuery);
      } else if (type === 'ingredient') {
        searchResults = await searchCocktailsByIngredient(searchQuery);
      }
      
      setResults(searchResults);
    } catch (err) {
      setError('An error occurred while searching. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setSearchParams({ q: query, type: searchType });
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setSearchParams({});
  };

  const handleTabChange = (value: string) => {
    setSearchType(value);
    if (query) {
      setSearchParams({ q: query, type: value });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Search Cocktails</h1>
            
            <Tabs defaultValue={searchType} onValueChange={handleTabChange} className="mb-8">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="name">Search by Name</TabsTrigger>
                <TabsTrigger value="ingredient">Search by Ingredient</TabsTrigger>
              </TabsList>
              
              <TabsContent value="name" className="space-y-4">
                <p className="text-muted-foreground">Find cocktails by their name or descriptive terms.</p>
              </TabsContent>
              
              <TabsContent value="ingredient" className="space-y-4">
                <p className="text-muted-foreground">Find cocktails that use a specific ingredient.</p>
              </TabsContent>
            </Tabs>
            
            <form onSubmit={handleSearch} className="relative mb-8">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    type="text"
                    placeholder={`Search by ${searchType === 'name' ? 'cocktail name' : 'ingredient'}...`}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10 pr-10 py-6 text-lg"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
                <Button type="submit" size="lg" className="px-6">
                  Search
                </Button>
              </div>
            </form>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[4/3] bg-muted rounded-xl mb-3"></div>
                    <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center p-8 border border-destructive/20 bg-destructive/10 rounded-lg">
                <p className="text-destructive">{error}</p>
              </div>
            ) : results.length > 0 ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-medium">
                    {results.length} {results.length === 1 ? 'Result' : 'Results'} for "{query}"
                  </h2>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {results.map((cocktail) => (
                    <CocktailCard 
                      key={cocktail.idDrink} 
                      cocktail={cocktail}
                      className="h-full"
                    />
                  ))}
                </div>
              </div>
            ) : query && !loading ? (
              <div className="text-center p-12 border border-muted rounded-lg">
                <Wine className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No cocktails found</h3>
                <p className="text-muted-foreground mb-6">
                  We couldn't find any cocktails for "{query}". Try a different search term or ingredient.
                </p>
                <Button onClick={handleClear} variant="outline">
                  Clear Search
                </Button>
              </div>
            ) : (
              <div className="text-center p-12 border border-muted rounded-lg">
                <SearchIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">Search for cocktails</h3>
                <p className="text-muted-foreground mb-6">
                  Enter a cocktail name or ingredient to find recipes
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Search;
