
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CocktailProvider } from "./context/CocktailContext";
import Index from "./pages/Index";
import Search from "./pages/Search";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import CocktailDetails from "./pages/CocktailDetails";
import Customer from "./pages/Customer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CocktailProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/search" element={<Search />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/cocktail/:id" element={<CocktailDetails />} />
            <Route path="/customer" element={<Customer />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CocktailProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
