
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { useState } from "react";
import Index from "./pages/Index";
import PetsPage from "./pages/PetsPage";
import MissingPage from "./pages/MissingPage";
import DonationPage from "./pages/DonationPage";
import RescuePage from "./pages/RescuePage";
import ContactPage from "./pages/ContactPage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import SubmitPetPage from "./pages/SubmitPetPage";
import TermsPage from "./pages/TermsPage";

import NotFound from "./pages/NotFound";

const App = () => {
  // Create the query client instance
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/pets" element={<PetsPage />} />
              <Route path="/missing" element={<MissingPage />} />
              <Route path="/donate" element={<DonationPage />} />
              <Route path="/rescue" element={<RescuePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/submit-pet" element={<SubmitPetPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
