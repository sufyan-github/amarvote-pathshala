import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import VoterEducation from "./pages/VoterEducation";
import CivicServices from "./pages/CivicServices";
import Rights from "./pages/Rights";
import Search from "./pages/Search";
import Auth from "./pages/Auth";
import ContentDetail from "./pages/ContentDetail";
import MisinformationDetector from "./pages/MisinformationDetector";
import Features from "./pages/Features";
import Assistant from "./pages/Assistant";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/voter-education" element={<VoterEducation />} />
          <Route path="/civic-services" element={<CivicServices />} />
          <Route path="/rights" element={<Rights />} />
          <Route path="/search" element={<Search />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/content/:id" element={<ContentDetail />} />
          <Route path="/misinformation-detector" element={<MisinformationDetector />} />
          <Route path="/features" element={<Features />} />
          <Route path="/assistant" element={<Assistant />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
