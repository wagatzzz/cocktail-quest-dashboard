import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Search, Wine, Trophy, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CocktailCard from '@/components/ui/CocktailCard';
import { getRandomCocktail, Cocktail as CocktailType } from '@/utils/api';
import { useCocktails } from '@/context/CocktailContext';

const Index = () => {
  const [featuredCocktails, setFeaturedCocktails] = useState<CocktailType[]>([]);
  const [loading, setLoading] = useState(true);
  const { getTopRatedCocktails } = useCocktails();
  const topRatedCocktails = getTopRatedCocktails(4);

  useEffect(() => {
    const loadFeaturedCocktails = async () => {
      setLoading(true);
      try {
        const cocktails: CocktailType[] = [];
        for (let i = 0; i < 4; i++) {
          const cocktail = await getRandomCocktail();
          if (cocktail && !cocktails.some(c => c.idDrink === cocktail.idDrink)) {
            cocktails.push(cocktail);
          }
        }
        setFeaturedCocktails(cocktails);
      } catch (error) {
        console.error('Error loading featured cocktails:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedCocktails();
  }, []);

  const features = [
    {
      icon: <Search className="h-8 w-8 text-cocktail-amber" />,
      title: 'Discover',
      description: 'Explore thousands of cocktail recipes with detailed ingredients and instructions.',
    },
    {
      icon: <Wine className="h-8 w-8 text-cocktail-teal" />,
      title: 'Curate',
      description: 'Save your favorite drinks to your restaurant dashboard for easy access.',
    },
    {
      icon: <Star className="h-8 w-8 text-cocktail-coral" />,
      title: 'Rate',
      description: 'Rate cocktails based on flavor profiles and keep track of customer preferences.',
    },
    {
      icon: <Trophy className="h-8 w-8 text-cocktail-navy" />,
      title: 'Compare',
      description: 'View which cocktails are trending and popular with your customers.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 hero-gradient">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-up">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Your Restaurant's <span className="bg-clip-text text-transparent bg-gradient-to-r from-cocktail-amber to-cocktail-teal">Cocktail Companion</span>
                </h1>
                <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
                  Discover, curate and rate the finest cocktails for your menu, all while gathering valuable customer feedback.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="rounded-full px-8">
                  <Link to="/search">
                    Start Exploring
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                  <Link to="/dashboard">
                    View Dashboard
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative aspect-square overflow-hidden rounded-3xl shadow-2xl animate-fade-in">
                <img 
                  src="https://images.unsplash.com/photo-1536935338788-846bb9981813?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                  alt="Cocktail" 
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>
              
              <div className="absolute -bottom-8 -left-8 glass-effect p-6 rounded-2xl shadow-xl max-w-xs animate-fade-up" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Customer Ratings</h3>
                    <p className="text-sm text-muted-foreground mt-1">Gather valuable flavor profile ratings from your customers</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-8 -right-8 glass-effect p-6 rounded-2xl shadow-xl max-w-xs hidden lg:block animate-fade-up" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-accent/10 rounded-full">
                    <Trophy className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-medium">Leaderboards</h3>
                    <p className="text-sm text-muted-foreground mt-1">See which cocktails are most popular at your establishment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-6 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold">Elevate Your Cocktail Menu</h2>
            <p className="mt-4 text-muted-foreground">
              Everything you need to discover new cocktails, enhance your menu, and delight your customers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 border rounded-xl hover:shadow-md transition-all duration-300 animate-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="p-3 bg-secondary inline-block rounded-lg mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Cocktails */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-wrap justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold">Featured Cocktails</h2>
              <p className="mt-2 text-muted-foreground">
                Discover new and exciting cocktails to add to your collection.
              </p>
            </div>
            <Button asChild variant="outline" className="mt-4 md:mt-0">
              <Link to="/search">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/3] bg-muted rounded-xl mb-3"></div>
                  <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCocktails.map((cocktail) => (
                <CocktailCard 
                  key={cocktail.idDrink}
                  cocktail={cocktail}
                  className="animate-fade-up"
                />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Top Rated Section */}
      {topRatedCocktails.length > 0 && (
        <section className="py-20 px-6 bg-background">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-wrap justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl font-bold">Top Rated Cocktails</h2>
                <p className="mt-2 text-muted-foreground">
                  The most popular cocktails according to customer ratings.
                </p>
              </div>
              <Button asChild variant="outline" className="mt-4 md:mt-0">
                <Link to="/leaderboard">
                  View Leaderboard <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {topRatedCocktails.map((cocktail) => (
                <CocktailCard 
                  key={cocktail.idDrink}
                  cocktail={cocktail}
                  className="animate-fade-up"
                />
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-cocktail-amber/10 to-cocktail-teal/10">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to elevate your cocktail menu?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start exploring thousands of cocktail recipes and build your perfect collection today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="rounded-full px-8">
              <Link to="/search">
                Start Searching
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8">
              <Link to="/dashboard">
                Go to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
