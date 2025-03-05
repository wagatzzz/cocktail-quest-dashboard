
import React from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface SearchFiltersProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedAlcoholic: 'Alcoholic' | 'Non_Alcoholic' | '';
  setSelectedAlcoholic: (value: 'Alcoholic' | 'Non_Alcoholic' | '') => void;
  applyFilters: () => void;
  clearFilters: () => void;
  filtersOpen: boolean;
  setFiltersOpen: (open: boolean) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedAlcoholic,
  setSelectedAlcoholic,
  applyFilters,
  clearFilters,
  filtersOpen,
  setFiltersOpen
}) => {
  return (
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
  );
};

export default SearchFilters;
