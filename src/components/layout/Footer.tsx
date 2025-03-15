
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="border-t py-12 bg-background/90 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cocktail-amber to-cocktail-teal">
                Elixir
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Discover, save and rate the world's finest cocktails for your establishment.
            </p>
          </div>
          
          <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-medium mb-4">Navigation</h3>
              <ul className="space-y-3">
                <li><Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
                <li><Link to="/search" className="text-sm text-muted-foreground hover:text-primary transition-colors">Search</Link></li>
                <li><Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">Dashboard</Link></li>
                <li><Link to="/leaderboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">Leaderboard</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-4">Explore</h3>
              <ul className="space-y-3">
                <li><Link to="/search" className="text-sm text-muted-foreground hover:text-primary transition-colors">Popular Cocktails</Link></li>
                <li><Link to="/search" className="text-sm text-muted-foreground hover:text-primary transition-colors">Recent Additions</Link></li>
                <li><Link to="/leaderboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">Top Rated</Link></li>
                <li><Link to="/search" className="text-sm text-muted-foreground hover:text-primary transition-colors">Seasonal Specials</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-4">For Users</h3>
              <ul className="space-y-3">
                <li><Link to="/customer" className="text-sm text-muted-foreground hover:text-primary transition-colors">Customer Diary</Link></li>
                <li><Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t text-center md:flex md:justify-between md:text-left">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Elixir. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground mt-2 md:mt-0">
            Powered by <a href="https://www.thecocktaildb.com/api.php" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">TheCocktailDB</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
