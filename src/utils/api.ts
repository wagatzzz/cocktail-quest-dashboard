
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

// Mock data for when the API is unavailable
const mockCocktails: Cocktail[] = [
  {
    idDrink: "11007",
    strDrink: "Margarita",
    strCategory: "Ordinary Drink",
    strAlcoholic: "Alcoholic",
    strGlass: "Cocktail glass",
    strInstructions: "Rub the rim of the glass with the lime slice to make the salt stick to it. Take care to moisten only the outer rim and sprinkle the salt on it. The salt should present to the lips of the imbiber and never mix into the cocktail. Shake the other ingredients with ice, then carefully pour into the glass.",
    strDrinkThumb: "https://www.thecocktaildb.com/images/media/drink/5noda61589575158.jpg",
    strIngredient1: "Tequila",
    strIngredient2: "Triple sec",
    strIngredient3: "Lime juice",
    strIngredient4: "Salt",
    strIngredient5: null,
    strIngredient6: null,
    strIngredient7: null,
    strIngredient8: null,
    strIngredient9: null,
    strIngredient10: null,
    strIngredient11: null,
    strIngredient12: null,
    strIngredient13: null,
    strIngredient14: null,
    strIngredient15: null,
    strMeasure1: "1 1/2 oz ",
    strMeasure2: "1/2 oz ",
    strMeasure3: "1 oz ",
    strMeasure4: null,
    strMeasure5: null,
    strMeasure6: null,
    strMeasure7: null,
    strMeasure8: null,
    strMeasure9: null,
    strMeasure10: null,
    strMeasure11: null,
    strMeasure12: null,
    strMeasure13: null,
    strMeasure14: null,
    strMeasure15: null
  },
  {
    idDrink: "11001",
    strDrink: "Old Fashioned",
    strCategory: "Cocktail",
    strAlcoholic: "Alcoholic",
    strGlass: "Old-fashioned glass",
    strInstructions: "Place sugar cube in old fashioned glass and saturate with bitters, add a dash of plain water. Muddle until dissolved. Fill the glass with ice cubes and add whiskey. Garnish with orange twist, and a cocktail cherry.",
    strDrinkThumb: "https://www.thecocktaildb.com/images/media/drink/vrwquq1478252802.jpg",
    strIngredient1: "Bourbon",
    strIngredient2: "Angostura bitters",
    strIngredient3: "Sugar",
    strIngredient4: "Water",
    strIngredient5: null,
    strIngredient6: null,
    strIngredient7: null,
    strIngredient8: null,
    strIngredient9: null,
    strIngredient10: null,
    strIngredient11: null,
    strIngredient12: null,
    strIngredient13: null,
    strIngredient14: null,
    strIngredient15: null,
    strMeasure1: "4.5 cL",
    strMeasure2: "2 dashes",
    strMeasure3: "1 cube",
    strMeasure4: "dash",
    strMeasure5: null,
    strMeasure6: null,
    strMeasure7: null,
    strMeasure8: null,
    strMeasure9: null,
    strMeasure10: null,
    strMeasure11: null,
    strMeasure12: null,
    strMeasure13: null,
    strMeasure14: null,
    strMeasure15: null
  },
  {
    idDrink: "11003",
    strDrink: "Negroni",
    strCategory: "Cocktail",
    strAlcoholic: "Alcoholic",
    strGlass: "Old-fashioned glass",
    strInstructions: "Stir into glass over ice, garnish and serve.",
    strDrinkThumb: "https://www.thecocktaildb.com/images/media/drink/qgdu971561574065.jpg",
    strIngredient1: "Gin",
    strIngredient2: "Campari",
    strIngredient3: "Sweet Vermouth",
    strIngredient4: null,
    strIngredient5: null,
    strIngredient6: null,
    strIngredient7: null,
    strIngredient8: null,
    strIngredient9: null,
    strIngredient10: null,
    strIngredient11: null,
    strIngredient12: null,
    strIngredient13: null,
    strIngredient14: null,
    strIngredient15: null,
    strMeasure1: "1 oz ",
    strMeasure2: "1 oz ",
    strMeasure3: "1 oz ",
    strMeasure4: null,
    strMeasure5: null,
    strMeasure6: null,
    strMeasure7: null,
    strMeasure8: null,
    strMeasure9: null,
    strMeasure10: null,
    strMeasure11: null,
    strMeasure12: null,
    strMeasure13: null,
    strMeasure14: null,
    strMeasure15: null
  }
];

// Search cocktails by name
export const searchCocktailsByName = async (name: string): Promise<Cocktail[]> => {
  try {
    const response = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(name)}`);
    const data: CocktailSearchResponse = await response.json();
    return data.drinks || [];
  } catch (error) {
    console.error('Error searching cocktails:', error);
    // Return mock data when API is unavailable
    return mockCocktails.filter(c => 
      c.strDrink.toLowerCase().includes(name.toLowerCase())
    );
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
    // Return a random cocktail from mock data when API is unavailable
    const randomIndex = Math.floor(Math.random() * mockCocktails.length);
    return mockCocktails[randomIndex];
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
    // Return mock data when API is unavailable
    return mockCocktails.find(c => c.idDrink === id) || null;
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
    // Return mock data when API is unavailable
    return mockCocktails.filter(c => 
      c.strDrink.charAt(0).toLowerCase() === letter.toLowerCase()
    );
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
    // Return mock categories when API is unavailable
    return ["Ordinary Drink", "Cocktail", "Shake", "Other/Unknown", "Cocoa", "Shot", "Coffee / Tea", "Homemade Liqueur", "Punch / Party Drink", "Beer", "Soft Drink"];
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
    // Return mock data when API is unavailable
    return mockCocktails.filter(c => c.strCategory === category);
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
    // Return mock data when API is unavailable
    return mockCocktails.filter(c => c.strAlcoholic === alcoholic);
  }
};
