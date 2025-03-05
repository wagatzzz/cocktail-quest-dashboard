
// API functions to interact with TheCocktailDB API
// Documentation: https://www.thecocktaildb.com/api.php

// The base URL for the free API
const BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1';

// Types for API responses
export interface Cocktail {
  idDrink: string;
  strDrink: string;
  strCategory: string;
  strAlcoholic: string;
  strGlass: string;
  strInstructions: string;
  strDrinkThumb: string;
  strIngredient1: string | null;
  strIngredient2: string | null;
  strIngredient3: string | null;
  strIngredient4: string | null;
  strIngredient5: string | null;
  strIngredient6: string | null;
  strIngredient7: string | null;
  strIngredient8: string | null;
  strIngredient9: string | null;
  strIngredient10: string | null;
  strIngredient11: string | null;
  strIngredient12: string | null;
  strIngredient13: string | null;
  strIngredient14: string | null;
  strIngredient15: string | null;
  strMeasure1: string | null;
  strMeasure2: string | null;
  strMeasure3: string | null;
  strMeasure4: string | null;
  strMeasure5: string | null;
  strMeasure6: string | null;
  strMeasure7: string | null;
  strMeasure8: string | null;
  strMeasure9: string | null;
  strMeasure10: string | null;
  strMeasure11: string | null;
  strMeasure12: string | null;
  strMeasure13: string | null;
  strMeasure14: string | null;
  strMeasure15: string | null;
}

export interface CocktailSearchResponse {
  drinks: Cocktail[] | null;
}

// Get ingredients and measurements as arrays
export const getIngredientsAndMeasures = (cocktail: Cocktail): {ingredient: string; measure: string}[] => {
  const ingredients: {ingredient: string; measure: string}[] = [];

  for (let i = 1; i <= 15; i++) {
    const ingredient = cocktail[`strIngredient${i}` as keyof Cocktail];
    const measure = cocktail[`strMeasure${i}` as keyof Cocktail];

    if (ingredient) {
      ingredients.push({
        ingredient: ingredient as string,
        measure: measure as string || ''
      });
    }
  }

  return ingredients;
};

// Search cocktails by name
export const searchCocktailsByName = async (name: string): Promise<Cocktail[]> => {
  try {
    const response = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(name)}`);
    const data: CocktailSearchResponse = await response.json();
    return data.drinks || [];
  } catch (error) {
    console.error('Error searching cocktails:', error);
    return [];
  }
};

// Get a random cocktail
export const getRandomCocktail = async (): Promise<Cocktail | null> => {
  try {
    const response = await fetch(`${BASE_URL}/random.php`);
    const data: CocktailSearchResponse = await response.json();
    return data.drinks && data.drinks.length > 0 ? data.drinks[0] : null;
  } catch (error) {
    console.error('Error getting random cocktail:', error);
    return null;
  }
};

// Get cocktail details by ID
export const getCocktailById = async (id: string): Promise<Cocktail | null> => {
  try {
    const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
    const data: CocktailSearchResponse = await response.json();
    return data.drinks && data.drinks.length > 0 ? data.drinks[0] : null;
  } catch (error) {
    console.error('Error getting cocktail details:', error);
    return null;
  }
};

// Get cocktails by first letter
export const getCocktailsByFirstLetter = async (letter: string): Promise<Cocktail[]> => {
  try {
    const response = await fetch(`${BASE_URL}/search.php?f=${letter.charAt(0)}`);
    const data: CocktailSearchResponse = await response.json();
    return data.drinks || [];
  } catch (error) {
    console.error('Error getting cocktails by letter:', error);
    return [];
  }
};

// Get all categories
export const getCategories = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${BASE_URL}/list.php?c=list`);
    const data = await response.json();
    return data.drinks ? data.drinks.map((item: {strCategory: string}) => item.strCategory) : [];
  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
  }
};

// Filter by category
export const filterByCategory = async (category: string): Promise<Cocktail[]> => {
  try {
    const response = await fetch(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
    const data: CocktailSearchResponse = await response.json();
    return data.drinks || [];
  } catch (error) {
    console.error('Error filtering by category:', error);
    return [];
  }
};

// Filter by alcoholic/non-alcoholic
export const filterByAlcoholic = async (alcoholic: 'Alcoholic' | 'Non_Alcoholic'): Promise<Cocktail[]> => {
  try {
    const response = await fetch(`${BASE_URL}/filter.php?a=${alcoholic}`);
    const data: CocktailSearchResponse = await response.json();
    return data.drinks || [];
  } catch (error) {
    console.error('Error filtering by alcoholic:', error);
    return [];
  }
};
