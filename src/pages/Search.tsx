
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Cocktail as CocktailIcon, Filter, X } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SearchBar from '@/components/ui/SearchBar';
import CocktailCard from '@/components/ui/CocktailCard';
import { Button } from '@/components/ui/button';
import { 
  searchCocktailsByName, 
  Cocktail,
  getCategories,
  filterByCategory,
  filterByAlcoholic 
} from '@/utils/api';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedAlcoholic, setSelectedAlcoholic] = useState<'Alcoholic' | 'Non_Alcoholic' | ''>('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (query: string) => {
    setLoading(true);
    try {
      setCocktails([]);
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
    } finally {
      setLoading(false);
    }
  };

  const filterBySelectedCategory = async () => {
    if (!selectedCategory) return;
    
    setLoading(true);
    try {
      setCocktails([]);
      const data = await filterByCategory(selectedCategory);
      setCocktails(data);
    } catch (error) {
      console.error('Error filtering by category:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBySelectedAlcoholic = async () => {
    if (!selectedAlcoholic) return;
    
    setLoading(true);
    try {
      setCocktails([]);
      const data = await filterByAlcoholic(selectedAlcoholic as 'Alcoholic' | 'Non_Alcoholic');
      setCocktails(data);
    } catch (error) {
      console.error('Error filtering by alcoholic:', error);
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Search Header */}
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
              <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle>Filter Cocktails</SheetTitle>
                    <SheetDescription>
                      Narrow down cocktails by applying filters
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="py-6 space-y-6">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="categories">
                        <AccordionTrigger className="text-lg">
                          Categories
                        </AccordionTrigger>
                        <AccordionContent>
                          <RadioGroup 
                            value={selectedCategory} 
                            onValueChange={setSelectedCategory}
                            className="space-y-2 mt-2"
                          >
                            {categories.map((category) => (
                              <div key={category} className="flex items-center space-x-2">
                                <RadioGroupItem value={category} id={`category-${category}`} />
                                <Label htmlFor={`category-${category}`}>{category}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="type">
                        <AccordionTrigger className="text-lg">
                          Type
                        </AccordionTrigger>
                        <AccordionContent>
                          <RadioGroup 
                            value={selectedAlcoholic} 
                            onValueChange={(value) => setSelectedAlcoholic(value as 'Alcoholic' | 'Non_Alcoholic' | '')}
                            className="space-y-2 mt-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Alcoholic" id="alcoholic" />
                              <Label htmlFor="alcoholic">Alcoholic</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Non_Alcoholic" id="non-alcoholic" />
                              <Label htmlFor="non-alcoholic">Non-Alcoholic</Label>
                            </div>
                          </RadioGroup>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                  
                  <SheetFooter className="sm:justify-between sm:flex-row mt-6 gap-2">
                    <Button variant="outline" onClick={clearFilters} className="sm:w-auto w-full">
                      <X className="mr-2 h-4 w-4" />
                      Clear Filters
                    </Button>
                    <Button onClick={applyFilters} className="sm:w-auto w-full">
                      Apply Filters
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </section>
      
      {/* Results Section */}
      <section className="py-12 px-6 flex-grow">
        <div className="container mx-auto max-w-7xl">
          {loading ? (
            <div>
              <div className="flex items-center justify-center my-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
              <div className="text-center text-muted-foreground">Loading cocktails...</div>
            </div>
          ) : cocktails.length > 0 ? (
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
          ) : initialQuery || selectedCategory || selectedAlcoholic ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <CocktailIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-medium mb-2">No cocktails found</h2>
              <p className="text-muted-foreground mb-8">
                Try using different search terms or filters
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <CocktailIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-medium mb-2">Start your search</h2>
              <p className="text-muted-foreground">
                Use the search bar above to find cocktails
              </p>
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Search;
