
import React, { useState } from 'react';
import { Trophy, SortDesc, SortAsc, Star } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCocktails, DashboardCocktail } from '@/context/CocktailContext';
import { Cocktail } from '@/utils/api';
import { Separator } from '@/components/ui/separator';
import { getRandomCocktail } from '@/utils/api';
import { toast } from 'sonner';
import CocktailCard from '@/components/ui/CocktailCard';

const Leaderboard = () => {
  const { getTopRatedCocktails, favorites } = useCocktails();
  const [randomCocktails, setRandomCocktails] = useState<Cocktail[]>([]);
  const [isLoadingRandom, setIsLoadingRandom] = useState(false);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Get top rated cocktails from favorites
  const topRatedCocktails = getTopRatedCocktails(10);

  // Load random cocktails
  const loadRandomCocktails = async () => {
    setIsLoadingRandom(true);
    try {
      const newRandomCocktails: Cocktail[] = [];
      const attempts = 5; // Try to get 5 unique cocktails
      
      for (let i = 0; i < attempts; i++) {
        const cocktail = await getRandomCocktail();
        if (cocktail && !newRandomCocktails.some(c => c.idDrink === cocktail.idDrink)) {
          newRandomCocktails.push(cocktail);
        }
      }
      
      setRandomCocktails(newRandomCocktails);
    } catch (error) {
      console.error('Error loading random cocktails:', error);
      toast.error('Failed to load random cocktails');
    } finally {
      setIsLoadingRandom(false);
    }
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  // Sort cocktails by rating
  const sortedTopRated = [...topRatedCocktails].sort((a, b) => {
    if (sortOrder === 'desc') {
      return b.ratings.overall - a.ratings.overall;
    } else {
      return a.ratings.overall - b.ratings.overall;
    }
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Leaderboard Header */}
      <section className="pt-32 pb-16 px-6 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Cocktail Leaderboard</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the highest-rated cocktails in our collection based on customer ratings.
          </p>
        </div>
      </section>
      
      {/* Leaderboard Content */}
      <section className="py-12 px-6 flex-grow">
        <div className="container mx-auto max-w-7xl">
          <Tabs defaultValue="top-rated" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <TabsList>
                <TabsTrigger value="top-rated">Top Rated</TabsTrigger>
                <TabsTrigger value="discover">Discover New</TabsTrigger>
              </TabsList>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={toggleSortOrder}
              >
                {sortOrder === 'desc' ? (
                  <>
                    <SortDesc className="h-4 w-4" />
                    Highest First
                  </>
                ) : (
                  <>
                    <SortAsc className="h-4 w-4" />
                    Lowest First
                  </>
                )}
              </Button>
            </div>
            
            <TabsContent value="top-rated" className="space-y-8">
              {topRatedCocktails.length > 0 ? (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 gap-6">
                    {sortedTopRated.map((cocktail, index) => (
                      <LeaderboardItem 
                        key={cocktail.idDrink}
                        cocktail={cocktail}
                        rank={index + 1}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <Star className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h2 className="text-2xl font-medium mb-2">No rated cocktails yet</h2>
                  <p className="text-muted-foreground mb-6">
                    Rate cocktails in your collection to see them appear here
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="discover" className="space-y-8">
              {randomCocktails.length > 0 ? (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 gap-6">
                    {randomCocktails.map((cocktail, index) => (
                      <RandomCocktailItem 
                        key={cocktail.idDrink}
                        cocktail={cocktail}
                        rank={index + 1}
                      />
                    ))}
                  </div>
                  
                  <div className="flex justify-center">
                    <Button 
                      onClick={loadRandomCocktails}
                      disabled={isLoadingRandom}
                      className="min-w-[200px]"
                    >
                      {isLoadingRandom ? 'Loading...' : 'Load More Cocktails'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <Star className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h2 className="text-2xl font-medium mb-2">Discover new cocktails</h2>
                  <p className="text-muted-foreground mb-6">
                    Click the button below to find new and exciting cocktails to try
                  </p>
                  <Button 
                    onClick={loadRandomCocktails}
                    disabled={isLoadingRandom}
                    className="min-w-[200px]"
                  >
                    {isLoadingRandom ? 'Loading...' : 'Load Random Cocktails'}
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

// Helper component for leaderboard items
const LeaderboardItem = ({ cocktail, rank }: { cocktail: DashboardCocktail; rank: number }) => {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-card/80 transition-colors">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
        {rank}
      </div>
      
      <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-4 flex-1">
          <img 
            src={cocktail.strDrinkThumb} 
            alt={cocktail.strDrink}
            className="w-16 h-16 object-cover rounded-md"
          />
          
          <div>
            <h3 className="font-medium text-lg">{cocktail.strDrink}</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                {cocktail.strCategory || 'Uncategorized'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-auto">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="font-medium">{cocktail.ratings.overall.toFixed(1)}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            ({cocktail.ratings.count} {cocktail.ratings.count === 1 ? 'rating' : 'ratings'})
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for random cocktail items
const RandomCocktailItem = ({ cocktail, rank }: { cocktail: Cocktail; rank: number }) => {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-card/80 transition-colors">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-secondary-foreground font-bold">
        {rank}
      </div>
      
      <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-4 flex-1">
          <img 
            src={cocktail.strDrinkThumb} 
            alt={cocktail.strDrink}
            className="w-16 h-16 object-cover rounded-md"
          />
          
          <div>
            <h3 className="font-medium text-lg">{cocktail.strDrink}</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                {cocktail.strCategory || 'Uncategorized'}
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                {cocktail.strAlcoholic || 'Unknown'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
