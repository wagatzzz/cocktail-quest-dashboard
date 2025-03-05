
import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useCocktails } from '@/context/CocktailContext';

interface RatingProps {
  cocktailId: string;
  className?: string;
}

const Rating: React.FC<RatingProps> = ({ cocktailId, className }) => {
  const { rateCocktail } = useCocktails();
  const [ratings, setRatings] = useState({
    sweet: 3,
    sour: 3,
    bitter: 3,
    strong: 3,
    overall: 3,
  });

  const handleSliderChange = (name: keyof typeof ratings, value: number[]) => {
    setRatings(prev => ({
      ...prev,
      [name]: value[0],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    rateCocktail(cocktailId, ratings);
  };

  const renderStars = (value: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "w-4 h-4 transition-all",
              star <= value
                ? "text-primary fill-primary"
                : "text-muted-foreground"
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={cn("glass-effect p-6 rounded-xl", className)}>
      <h3 className="text-lg font-medium mb-4">Rate this cocktail</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* Sweet rating */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Sweetness</label>
              {renderStars(ratings.sweet)}
            </div>
            <Slider
              value={[ratings.sweet]}
              min={1}
              max={5}
              step={1}
              onValueChange={(value) => handleSliderChange('sweet', value)}
              className="mt-1"
            />
          </div>
          
          {/* Sour rating */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Sourness</label>
              {renderStars(ratings.sour)}
            </div>
            <Slider
              value={[ratings.sour]}
              min={1}
              max={5}
              step={1}
              onValueChange={(value) => handleSliderChange('sour', value)}
              className="mt-1"
            />
          </div>
          
          {/* Bitter rating */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Bitterness</label>
              {renderStars(ratings.bitter)}
            </div>
            <Slider
              value={[ratings.bitter]}
              min={1}
              max={5}
              step={1}
              onValueChange={(value) => handleSliderChange('bitter', value)}
              className="mt-1"
            />
          </div>
          
          {/* Strong rating */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Strength</label>
              {renderStars(ratings.strong)}
            </div>
            <Slider
              value={[ratings.strong]}
              min={1}
              max={5}
              step={1}
              onValueChange={(value) => handleSliderChange('strong', value)}
              className="mt-1"
            />
          </div>
          
          {/* Overall rating */}
          <div className="space-y-2 pt-4 border-t">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Overall Rating</label>
              {renderStars(ratings.overall)}
            </div>
            <Slider
              value={[ratings.overall]}
              min={1}
              max={5}
              step={1}
              onValueChange={(value) => handleSliderChange('overall', value)}
              className="mt-1"
            />
          </div>
        </div>
        
        <Button type="submit" className="w-full">
          Submit Rating
        </Button>
      </form>
    </div>
  );
};

export default Rating;
