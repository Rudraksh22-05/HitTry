import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import SupportCircles from "./pages/SupportCircles";
import EmergencySupport from "./pages/EmergencySupport";
import Auth from "./pages/Auth";
import Chat from "./pages/Chat";
import Discussions from "./pages/Discussions";
import HowItWorks from "./pages/HowItWorks";
import Resources from "./pages/Resources";
import RaiseFunds from "./pages/RaiseFunds";
import GeoAssistance from "./pages/GeoAssistance";
<<<<<<< HEAD
import ContractInteraction from "./pages/ContractInteraction";
import CrowdFunding from "./pages/CrowdFunding";
import { TweetList } from "@/components/tweets/TweetList";
=======
import MentorAuth from "./pages/mentors/MentorAuth";
import MentorDashboard from "./pages/mentors/MentorDashboard";
>>>>>>> friend/main
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  // Check if user prefers dark mode
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/support-circles" element={<SupportCircles />} />
              <Route path="/emergency-support" element={<EmergencySupport />} />
              <Route path="/auth/login" element={<Auth />} />
              <Route path="/auth/register" element={<Auth />} />
              <Route path="/auth/reset-password" element={<Auth />} />
              <Route path="/chat/:circleId" element={<Chat />} />
              <Route path="/discussions/:circleId" element={<Discussions />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/raise-funds" element={<RaiseFunds />} />
              <Route path="/geo-assistance" element={<GeoAssistance />} />
<<<<<<< HEAD
              <Route path="/contract" element={<ContractInteraction />} />
              <Route path="/tweets" element={<TweetList />} />
              <Route path="/CrowdFunding" element={<CrowdFunding />} />
=======
              <Route path="/mentors/auth" element={<MentorAuth />} />
              <Route path="/mentors/dashboard" element={<MentorDashboard />} />
>>>>>>> friend/main
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
