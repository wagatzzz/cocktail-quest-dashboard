
import React, { useEffect, useState } from 'react';
import { Trophy, TrendingUp, ThumbsUp, Star } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCocktails } from '@/context/CocktailContext';
import CocktailCard from '@/components/ui/CocktailCard';
import { Cocktail } from '@/utils/api';

const Leaderboard = () => {
  const { getTopRatedCocktails, getRatedCocktails } = useCocktails();
  const [period, setPeriod] = useState<'week' | 'month' | 'alltime'>('month');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  
  const topRatedCocktails = getTopRatedCocktails(20);
  const allRatedCocktails = getRatedCocktails();
  
  // These could be refined with actual data in the future
  const categories = [
    { name: 'Sweet', icon: <ThumbsUp className="h-5 w-5 text-cocktail-amber" /> },
    { name: 'Sour', icon: <Star className="h-5 w-5 text-cocktail-teal" /> },
    { name: 'Strong', icon: <TrendingUp className="h-5 w-5 text-cocktail-coral" /> },
    { name: 'Refreshing', icon: <Trophy className="h-5 w-5 text-cocktail-navy" /> },
  ];
  
  const getCategoryTopCocktails = (category: string): Cocktail[] => {
    // In a real app, you would filter by category ratings
    // This is a placeholder that just returns some of the rated cocktails
    return allRatedCocktails.slice(0, 5);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-28 pb-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Cocktail Leaderboard</h1>
              <p className="text-muted-foreground mt-2">
                See the most popular cocktails based on customer ratings
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-muted rounded-lg p-1">
                <Button 
                  variant={period === 'week' ? 'secondary' : 'ghost'} 
                  size="sm"
                  onClick={() => setPeriod('week')}
                  className="rounded-lg"
                >
                  Week
                </Button>
                <Button 
                  variant={period === 'month' ? 'secondary' : 'ghost'} 
                  size="sm"
                  onClick={() => setPeriod('month')}
                  className="rounded-lg"
                >
                  Month
                </Button>
                <Button 
                  variant={period === 'alltime' ? 'secondary' : 'ghost'} 
                  size="sm"
                  onClick={() => setPeriod('alltime')}
                  className="rounded-lg"
                >
                  All Time
                </Button>
              </div>
              
              <div className="flex items-center bg-muted rounded-lg p-1">
                <Button 
                  variant={view === 'grid' ? 'secondary' : 'ghost'} 
                  size="icon"
                  onClick={() => setView('grid')}
                  className="rounded-lg"
                >
                  <div className="grid grid-cols-2 gap-0.5">
                    <div className="w-1.5 h-1.5 bg-current"></div>
                    <div className="w-1.5 h-1.5 bg-current"></div>
                    <div className="w-1.5 h-1.5 bg-current"></div>
                    <div className="w-1.5 h-1.5 bg-current"></div>
                  </div>
                </Button>
                <Button 
                  variant={view === 'list' ? 'secondary' : 'ghost'} 
                  size="icon"
                  onClick={() => setView('list')}
                  className="rounded-lg"
                >
                  <div className="flex flex-col gap-0.5">
                    <div className="w-4 h-1.5 bg-current"></div>
                    <div className="w-4 h-1.5 bg-current"></div>
                    <div className="w-4 h-1.5 bg-current"></div>
                  </div>
                </Button>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="overall" className="mb-12">
            <TabsList className="mb-8">
              <TabsTrigger value="overall">Overall Rating</TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category.name} value={category.name.toLowerCase()}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value="overall">
              {topRatedCocktails.length === 0 ? (
                <div className="text-center p-12 border border-muted rounded-lg">
                  <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No ratings yet</h3>
                  <p className="text-muted-foreground mb-6">
                    There are no rated cocktails yet. Start rating cocktails to see them appear here.
                  </p>
                </div>
              ) : view === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {topRatedCocktails.map((cocktail, index) => (
                    <CocktailCard 
                      key={cocktail.idDrink}
                      cocktail={cocktail}
                      showRanking
                      rank={index + 1}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {topRatedCocktails.map((cocktail, index) => (
                    <Card key={cocktail.idDrink} className="overflow-hidden">
                      <div className="flex">
                        <div className="relative w-24 flex-shrink-0">
                          <div className="absolute top-2 left-2 bg-background/80 backdrop-blur rounded-full h-8 w-8 flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <img 
                            src={cocktail.strDrinkThumb} 
                            alt={cocktail.strDrink} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-4">
                          <CardTitle className="text-lg">{cocktail.strDrink}</CardTitle>
                          <CardDescription className="line-clamp-2 mt-1">
                            {cocktail.strInstructions || "No description available"}
                          </CardDescription>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            {categories.map((category) => (
              <TabsContent key={category.name} value={category.name.toLowerCase()}>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                    {category.icon}
                    Top {category.name} Cocktails
                  </h2>
                  <p className="text-muted-foreground">
                    Cocktails with the highest {category.name.toLowerCase()} ratings from customers.
                  </p>
                </div>
                
                {view === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {getCategoryTopCocktails(category.name).map((cocktail, index) => (
                      <CocktailCard 
                        key={cocktail.idDrink}
                        cocktail={cocktail}
                        showRanking
                        rank={index + 1}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {getCategoryTopCocktails(category.name).map((cocktail, index) => (
                      <Card key={cocktail.idDrink} className="overflow-hidden">
                        <div className="flex">
                          <div className="relative w-24 flex-shrink-0">
                            <div className="absolute top-2 left-2 bg-background/80 backdrop-blur rounded-full h-8 w-8 flex items-center justify-center font-bold">
                              {index + 1}
                            </div>
                            <img 
                              src={cocktail.strDrinkThumb} 
                              alt={cocktail.strDrink} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1 p-4">
                            <CardTitle className="text-lg">{cocktail.strDrink}</CardTitle>
                            <CardDescription className="line-clamp-2 mt-1">
                              {cocktail.strInstructions || "No description available"}
                            </CardDescription>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Leaderboard;
