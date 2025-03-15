
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getRandomCocktail, getCocktailById, searchCocktailsByName, Cocktail } from '@/utils/api';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Rating from '@/components/ui/Rating';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Wine, Star, BookOpen, History, Search } from 'lucide-react';

const Customer = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId') || localStorage.getItem('customerId') || '';
  const [userName, setUserName] = useState(localStorage.getItem('customerName') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(!!userName);
  const [cocktailId, setCocktailId] = useState(searchParams.get('cocktailId') || '');
  const [cocktail, setCocktail] = useState<Cocktail | null>(null);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Cocktail[]>([]);
  const [searching, setSearching] = useState(false);
  const [ratings, setRatings] = useState({
    flavor: 0,
    presentation: 0,
    overall: 0
  });
  const [diary, setDiary] = useState<Array<{
    id: string;
    date: string;
    cocktailId: string;
    cocktailName: string;
    notes: string;
    ratings: typeof ratings;
  }>>([]);

  // Load diary from localStorage
  useEffect(() => {
    if (isLoggedIn) {
      const savedDiary = localStorage.getItem(`cocktailDiary_${userId}`);
      if (savedDiary) {
        setDiary(JSON.parse(savedDiary));
      }
    }
  }, [userId, isLoggedIn]);

  // Load cocktail if ID is provided
  useEffect(() => {
    if (cocktailId) {
      fetchCocktail(cocktailId);
    }
  }, [cocktailId]);

  const fetchCocktail = async (id: string) => {
    setLoading(true);
    try {
      const data = await getCocktailById(id);
      setCocktail(data);
    } catch (error) {
      console.error('Error fetching cocktail:', error);
      toast.error('Could not load the cocktail');
    } finally {
      setLoading(false);
    }
  };

  const handleRandomCocktail = async () => {
    setLoading(true);
    try {
      const data = await getRandomCocktail();
      if (data) {
        setCocktail(data);
        setCocktailId(data.idDrink);
      }
    } catch (error) {
      console.error('Error fetching random cocktail:', error);
      toast.error('Could not load a random cocktail');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    try {
      const results = await searchCocktailsByName(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching cocktails:', error);
      toast.error('Could not search for cocktails');
    } finally {
      setSearching(false);
    }
  };

  const selectCocktailFromSearch = (selectedCocktail: Cocktail) => {
    setCocktail(selectedCocktail);
    setCocktailId(selectedCocktail.idDrink);
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleLogin = () => {
    if (!userName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    const newUserId = `user_${Date.now()}`;
    localStorage.setItem('customerId', newUserId);
    localStorage.setItem('customerName', userName);
    setIsLoggedIn(true);
    toast.success(`Welcome, ${userName}!`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    localStorage.removeItem('customerId');
    localStorage.removeItem('customerName');
    toast.success('Logged out successfully');
  };

  const handleRatingChange = (category: string, value: number) => {
    setRatings(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleSaveToDiary = () => {
    if (!cocktail) return;
    
    // Create new diary entry
    const newEntry = {
      id: `entry_${Date.now()}`,
      date: new Date().toISOString(),
      cocktailId: cocktail.idDrink,
      cocktailName: cocktail.strDrink,
      notes,
      ratings
    };
    
    // Add to diary
    const updatedDiary = [newEntry, ...diary];
    setDiary(updatedDiary);
    
    // Save to localStorage
    localStorage.setItem(`cocktailDiary_${userId}`, JSON.stringify(updatedDiary));
    
    // Reset form
    setNotes('');
    setRatings({ flavor: 0, presentation: 0, overall: 0 });
    
    toast.success('Added to your cocktail diary');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow flex items-center justify-center p-6">
          <div className="max-w-md w-full p-8 rounded-lg border bg-card text-card-foreground shadow">
            <div className="text-center mb-6">
              <Wine className="h-12 w-12 mx-auto text-primary mb-4" />
              <h1 className="text-2xl font-bold">Cocktail Diary</h1>
              <p className="text-muted-foreground mt-2">
                Rate cocktails and keep track of your favorites
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input 
                  id="name" 
                  placeholder="Enter your name" 
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleLogin}
              >
                Start Your Cocktail Journey
              </Button>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-32 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold">{userName}'s Cocktail Diary</h1>
            <p className="text-muted-foreground mt-2">
              Rate cocktails and keep track of your tasting notes
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleRandomCocktail}
              disabled={loading}
            >
              <Wine className="mr-2 h-4 w-4" />
              Random Cocktail
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              Log Out
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="rate">
          <TabsList className="mb-8">
            <TabsTrigger value="rate" className="gap-2">
              <Star className="h-4 w-4" />
              Rate Cocktails
            </TabsTrigger>
            <TabsTrigger value="diary" className="gap-2">
              <BookOpen className="h-4 w-4" />
              My Diary
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="rate">
            {/* Search Bar - New Addition */}
            <div className="mb-8">
              <div className="flex gap-2">
                <div className="flex-grow">
                  <Input
                    type="text"
                    placeholder="Search for a cocktail by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  disabled={searching || !searchQuery.trim()}
                  variant="outline"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
              
              {/* Search Results - New Addition */}
              {searching && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-muted-foreground mt-2">Searching...</p>
                </div>
              )}
              
              {!searching && searchResults.length > 0 && (
                <div className="mt-4 border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Search Results</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-60 overflow-y-auto">
                    {searchResults.map(result => (
                      <div 
                        key={result.idDrink}
                        className="flex items-center gap-2 p-2 border rounded hover:bg-muted cursor-pointer"
                        onClick={() => selectCocktailFromSearch(result)}
                      >
                        <img 
                          src={result.strDrinkThumb} 
                          alt={result.strDrink} 
                          className="w-12 h-12 object-cover rounded"
                        />
                        <span className="font-medium text-sm truncate">{result.strDrink}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!searching && searchResults.length === 0 && searchQuery && (
                <div className="mt-4 text-center py-2">
                  <p className="text-sm text-muted-foreground">No cocktails found. Try a different search term.</p>
                </div>
              )}
            </div>

            {cocktail ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <div className="rounded-xl overflow-hidden">
                    <img 
                      src={cocktail.strDrinkThumb} 
                      alt={cocktail.strDrink}
                      className="w-full aspect-square object-cover"
                    />
                  </div>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold mb-2">{cocktail.strDrink}</h2>
                  <p className="text-muted-foreground mb-6">
                    {cocktail.strCategory} • {cocktail.strAlcoholic} • {cocktail.strGlass}
                  </p>
                  
                  <Separator className="my-6" />
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-4">Rate this Cocktail</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <p className="text-sm font-medium mb-1">Flavor</p>
                        <Rating 
                          value={ratings.flavor}
                          onChange={(value) => handleRatingChange('flavor', value)} 
                          className="text-amber-400" 
                        />
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium mb-1">Presentation</p>
                        <Rating 
                          value={ratings.presentation}
                          onChange={(value) => handleRatingChange('presentation', value)} 
                          className="text-amber-400" 
                        />
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium mb-1">Overall</p>
                        <Rating 
                          value={ratings.overall}
                          onChange={(value) => handleRatingChange('overall', value)} 
                          className="text-amber-400" 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-4">Tasting Notes</h3>
                    <Textarea 
                      placeholder="Write your thoughts about this cocktail..." 
                      className="h-24"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                  
                  <Button onClick={handleSaveToDiary}>
                    Save to Diary
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Wine className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-medium mb-2">No cocktail selected</h2>
                <p className="text-muted-foreground mb-6">
                  Search for a cocktail above or click the button below to get a random cocktail to rate
                </p>
                <Button onClick={handleRandomCocktail} disabled={loading}>
                  {loading ? 'Loading...' : 'Get Random Cocktail'}
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="diary">
            {diary.length > 0 ? (
              <div className="space-y-6">
                {diary.map((entry) => (
                  <div key={entry.id} className="border rounded-lg p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-bold">{entry.cocktailName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(entry.date)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => fetchCocktail(entry.cocktailId)}
                        >
                          Rate Again
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-secondary/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Flavor</p>
                        <div className="mt-1">
                          <Rating value={entry.ratings.flavor} readOnly className="justify-center" />
                        </div>
                      </div>
                      <div className="text-center p-3 bg-secondary/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Presentation</p>
                        <div className="mt-1">
                          <Rating value={entry.ratings.presentation} readOnly className="justify-center" />
                        </div>
                      </div>
                      <div className="text-center p-3 bg-secondary/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Overall</p>
                        <div className="mt-1">
                          <Rating value={entry.ratings.overall} readOnly className="justify-center" />
                        </div>
                      </div>
                    </div>
                    
                    {entry.notes && (
                      <div className="bg-muted/40 p-4 rounded-lg">
                        <p className="text-sm italic">{entry.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-medium mb-2">Your diary is empty</h2>
                <p className="text-muted-foreground mb-6">
                  Rate some cocktails to start building your diary
                </p>
                <Button onClick={handleRandomCocktail}>
                  Get Random Cocktail
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="history">
            <div className="text-center py-12">
              <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-medium mb-2">Coming Soon</h2>
              <p className="text-muted-foreground">
                This feature will be available in a future update
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Customer;
