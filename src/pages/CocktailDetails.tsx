
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Heart, Share2 } from 'lucide-react';
import { getCocktailById, getIngredientsAndMeasures, Cocktail } from '@/utils/api';
import { useCocktails } from '@/context/CocktailContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Rating from '@/components/ui/Rating';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { toast } from 'sonner';

const CocktailDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [cocktail, setCocktail] = useState<Cocktail | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToFavorites, removeFromFavorites, isFavorite, rateCocktail } = useCocktails();
  
  useEffect(() => {
    const fetchCocktailDetails = async () => {
      setLoading(true);
      if (id) {
        try {
          const data = await getCocktailById(id);
          setCocktail(data);
        } catch (error) {
          console.error('Error fetching cocktail details:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchCocktailDetails();
  }, [id]);

  const isInFavorites = id ? isFavorite(id) : false;

  const handleFavoriteToggle = () => {
    if (!cocktail) return;
    
    if (isInFavorites) {
      removeFromFavorites(cocktail.idDrink);
      toast.success('Removed from your collection');
    } else {
      addToFavorites(cocktail);
      toast.success('Added to your collection');
    }
  };

  const handleRatingChange = (category: string, value: number) => {
    if (!cocktail) return;
    
    rateCocktail(cocktail.idDrink, category as any, value);
    toast.success('Rating saved');
  };

  const handleShare = () => {
    if (navigator.share && cocktail) {
      navigator.share({
        title: cocktail.strDrink,
        text: `Check out this cocktail: ${cocktail.strDrink}`,
        url: window.location.href
      }).catch(error => {
        console.error('Error sharing:', error);
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!cocktail) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center p-6">
          <h1 className="text-2xl font-bold mb-4">Cocktail Not Found</h1>
          <p className="text-muted-foreground mb-6">The cocktail you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/search">Browse Cocktails</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const ingredients = getIngredientsAndMeasures(cocktail);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-32 max-w-7xl">
        <div className="mb-6">
          <Button variant="ghost" asChild className="gap-2 mb-4">
            <Link to="/search">
              <ArrowLeft className="h-4 w-4" />
              Back to Search
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="relative rounded-xl overflow-hidden">
              <img 
                src={cocktail.strDrinkThumb} 
                alt={cocktail.strDrink}
                className="w-full aspect-square object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="rounded-full"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button 
                    variant={isInFavorites ? "default" : "secondary"}
                    size="sm" 
                    className="rounded-full"
                    onClick={handleFavoriteToggle}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isInFavorites ? "fill-white" : ""}`} />
                    {isInFavorites ? 'Saved' : 'Save'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h1 className="text-3xl font-bold mb-2">{cocktail.strDrink}</h1>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline">{cocktail.strCategory}</Badge>
              <Badge variant="outline">{cocktail.strAlcoholic}</Badge>
              <Badge variant="outline">{cocktail.strGlass}</Badge>
            </div>
            
            <Separator className="my-6" />
            
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-3">Ingredients</h2>
              <ul className="space-y-2">
                {ingredients.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center mr-3 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="font-medium">{item.ingredient}</span>
                    {item.measure && <span className="ml-2 text-muted-foreground">{item.measure}</span>}
                  </li>
                ))}
              </ul>
            </div>
            
            <Separator className="my-6" />
            
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-3">Instructions</h2>
              <p className="text-muted-foreground">{cocktail.strInstructions}</p>
            </div>
            
            <Separator className="my-6" />
            
            <div>
              <h2 className="text-lg font-medium mb-3">Rate this Cocktail</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">Flavor</p>
                  <Rating 
                    onChange={(value) => handleRatingChange('flavor', value)} 
                    className="text-amber-400" 
                  />
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Presentation</p>
                  <Rating 
                    onChange={(value) => handleRatingChange('presentation', value)} 
                    className="text-amber-400" 
                  />
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Difficulty</p>
                  <Rating 
                    onChange={(value) => handleRatingChange('difficulty', value)} 
                    className="text-amber-400" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CocktailDetails;
