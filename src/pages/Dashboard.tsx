
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, List, Grid, ChevronRight, Search, Trash2, Clock, SortDesc, SortAsc } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CocktailCard from '@/components/ui/CocktailCard';
import SearchBar from '@/components/ui/SearchBar';
import { Button } from '@/components/ui/button';
import { useCocktails, DashboardCocktail } from '@/context/CocktailContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';

type SortOption = "newest" | "oldest" | "name-asc" | "name-desc" | "rating-high" | "rating-low";

const Dashboard = () => {
  const { favorites, removeFromFavorites } = useCocktails();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filterText, setFilterText] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [cocktailToDelete, setCocktailToDelete] = useState<string | null>(null);

  const filteredCocktails = favorites.filter(cocktail => 
    cocktail.strDrink.toLowerCase().includes(filterText.toLowerCase())
  );

  const sortedCocktails = [...filteredCocktails].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      case "oldest":
        return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
      case "name-asc":
        return a.strDrink.localeCompare(b.strDrink);
      case "name-desc":
        return b.strDrink.localeCompare(a.strDrink);
      case "rating-high":
        return b.ratings.overall - a.ratings.overall;
      case "rating-low":
        return a.ratings.overall - b.ratings.overall;
      default:
        return 0;
    }
  });

  const handleSearch = (query: string) => {
    setFilterText(query);
  };

  const confirmDelete = (id: string) => {
    setCocktailToDelete(id);
  };

  const handleDelete = () => {
    if (cocktailToDelete) {
      removeFromFavorites(cocktailToDelete);
      setCocktailToDelete(null);
    }
  };

  const sortOptions = [
    { value: "newest", label: "Newest First", icon: <Clock className="mr-2 h-4 w-4" /> },
    { value: "oldest", label: "Oldest First", icon: <Clock className="mr-2 h-4 w-4" /> },
    { value: "name-asc", label: "Name A-Z", icon: <SortAsc className="mr-2 h-4 w-4" /> },
    { value: "name-desc", label: "Name Z-A", icon: <SortDesc className="mr-2 h-4 w-4" /> },
    { value: "rating-high", label: "Rating High-Low", icon: <SortDesc className="mr-2 h-4 w-4" /> },
    { value: "rating-low", label: "Rating Low-High", icon: <SortAsc className="mr-2 h-4 w-4" /> },
  ];

  const getSortLabel = () => {
    return sortOptions.find(option => option.value === sortOption)?.label || "Sort";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Dashboard Header */}
      <section className="pt-32 pb-12 px-6 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Your Cocktail Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Manage your collection of cocktails and view ratings
              </p>
            </div>
            
            <Button asChild>
              <Link to="/search">
                <Search className="mr-2 h-4 w-4" />
                Find New Cocktails
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Dashboard Content */}
      <section className="py-8 px-6 flex-grow">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="w-full md:w-auto">
              <SearchBar 
                onSearch={handleSearch} 
                placeholder="Filter your cocktails..." 
                className="max-w-md"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <SortAsc className="h-4 w-4" />
                    {getSortLabel()}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {sortOptions.map((option) => (
                    <DropdownMenuItem 
                      key={option.value}
                      onClick={() => setSortOption(option.value as SortOption)}
                      className="cursor-pointer flex items-center"
                    >
                      {option.icon}
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <div className="border rounded-md flex">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-none ${view === 'grid' ? 'bg-muted' : ''}`}
                  onClick={() => setView('grid')}
                >
                  <Grid className="h-4 w-4" />
                  <span className="sr-only">Grid view</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-none ${view === 'list' ? 'bg-muted' : ''}`}
                  onClick={() => setView('list')}
                >
                  <List className="h-4 w-4" />
                  <span className="sr-only">List view</span>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Cocktails */}
          {favorites.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-medium mb-2">Your collection is empty</h2>
              <p className="text-muted-foreground mb-6">
                Start by adding cocktails to your dashboard from the search page
              </p>
              <Button asChild>
                <Link to="/search">
                  <Search className="mr-2 h-4 w-4" />
                  Search Cocktails
                </Link>
              </Button>
            </div>
          ) : sortedCocktails.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-medium mb-2">No matching cocktails</h2>
              <p className="text-muted-foreground mb-4">
                Try a different search term
              </p>
              <Button variant="outline" onClick={() => setFilterText('')}>
                Clear Filter
              </Button>
            </div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sortedCocktails.map((cocktail) => (
                <div key={cocktail.idDrink} className="group relative">
                  <CocktailCard 
                    cocktail={cocktail}
                    showActions={false}
                    className="animate-fade-up"
                  />
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="rounded-full h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDelete(cocktail.idDrink);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will remove "{cocktail.strDrink}" from your collection. 
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete}>
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {sortedCocktails.map((cocktail) => (
                <div 
                  key={cocktail.idDrink}
                  className="flex items-center border rounded-lg p-3 hover:bg-muted/30 transition-colors"
                >
                  <img 
                    src={cocktail.strDrinkThumb} 
                    alt={cocktail.strDrink}
                    className="w-16 h-16 object-cover rounded-md mr-4"
                  />
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{cocktail.strDrink}</h3>
                      <div className="text-sm text-muted-foreground">
                        {cocktail.ratings.count > 0 ? (
                          <span>Rating: {cocktail.ratings.overall.toFixed(1)}/5</span>
                        ) : (
                          <span>Not rated</span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {cocktail.strCategory} • {cocktail.strAlcoholic}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/cocktail/${cocktail.idDrink}`}>
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">View details</span>
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will remove "{cocktail.strDrink}" from your collection. 
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => removeFromFavorites(cocktail.idDrink)}>
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
