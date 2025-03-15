import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useCocktails } from '@/context/CocktailContext';

interface RatingProps {
  cocktailId?: string;  // Made optional since not all usages provide it
  className?: string;
  value?: number;       // Added to support controlled component usage
  readOnly?: boolean;   // Added to support readonly display
  onChange?: (value: number) => void; // Added to support external value changes
}

const Rating: React.FC<RatingProps> = ({ 
  cocktailId, 
  className, 
  value: externalValue, 
  readOnly = false,
  onChange 
}) => {
  const { rateCocktail } = useCocktails();
  const [internalRatings, setInternalRatings] = useState({
    sweet: 3,
    sour: 3,
    bitter: 3,
    strong: 3,
    overall: 3,
  });
  
  // For simple star rating when used as a display/input component
  const [internalValue, setInternalValue] = useState(externalValue || 3);
  
  // Determine which value to show in stars
  const displayValue = externalValue !== undefined ? externalValue : internalValue;

  const handleSliderChange = (name: keyof typeof internalRatings, value: number[]) => {
    setInternalRatings(prev => ({
      ...prev,
      [name]: value[0],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cocktailId) {
      rateCocktail(cocktailId, internalRatings);
    }
  };

  const handleStarClick = (starValue: number) => {
    if (readOnly) return;
    
    setInternalValue(starValue);
    if (onChange) {
      onChange(starValue);
    }
  };

  const renderStars = (value: number) => {
    return (
      <div className={cn("flex", { "cursor-pointer": !readOnly }, className)}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "w-4 h-4 transition-all",
              star <= value
                ? "text-primary fill-primary"
                : "text-muted-foreground",
              !readOnly && "hover:scale-110"
            )}
            onClick={readOnly ? undefined : () => handleStarClick(star)}
          />
        ))}
      </div>
    );
  };

  // If used as a simple star rating component
  if (onChange || externalValue !== undefined || readOnly) {
    return renderStars(displayValue);
  }

  // Otherwise, render the full cocktail rating form
  return (
    <div className={cn("glass-effect p-6 rounded-xl", className)}>
      <h3 className="text-lg font-medium mb-4">Rate this cocktail</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* Sweet rating */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Sweetness</label>
              {renderStars(internalRatings.sweet)}
            </div>
            <Slider
              value={[internalRatings.sweet]}
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
              {renderStars(internalRatings.sour)}
            </div>
            <Slider
              value={[internalRatings.sour]}
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
              {renderStars(internalRatings.bitter)}
            </div>
            <Slider
              value={[internalRatings.bitter]}
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
              {renderStars(internalRatings.strong)}
            </div>
            <Slider
              value={[internalRatings.strong]}
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
              {renderStars(internalRatings.overall)}
            </div>
            <Slider
              value={[internalRatings.overall]}
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
