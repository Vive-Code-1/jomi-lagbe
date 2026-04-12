import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/lib/i18n";
import { AuthProvider } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Listings from "./pages/Listings";
import LandDetail from "./pages/LandDetail";
import Auth from "./pages/Auth";
import Favorites from "./pages/Favorites";
import Packages from "./pages/Packages";
import Admin from "./pages/Admin";
import AddListing from "./pages/AddListing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <ScrollToTop />
            <Navbar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/listings" element={<Listings />} />
              <Route path="/land/:id" element={<LandDetail />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/packages" element={<Packages />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/add-listing" element={<AddListing />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
