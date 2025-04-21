import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Privacy from '@/components/landing/Privacy';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageCircle, ShieldAlert, BookOpen, CircleDollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import SafetyButton from '@/components/ui/SafetyButton';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();

  const handleEmergencyClick = () => {
    toast({
      title: "Emergency Mode",
      description: "Redirecting to emergency support services.",
      variant: "destructive",
    });
    
    // Delay to show the toast before redirecting
    setTimeout(() => {
      window.location.href = '/emergency-support';
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <Hero />
        <Features />
        <Privacy />
        
        {/* Call to Action */}
        <section className="py-20 bg-primary/5">
          <div className="section-container">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-medium mb-6">
                Explore How We Can Help
              </h2>
              <p className="text-muted-foreground mb-12">
                Whether you're seeking support, mentorship, or resources, our platform 
                offers multiple ways to connect securely and anonymously.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                <div className="glass-card p-6 rounded-2xl hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto mb-4">
                    <MessageCircle size={24} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-3">Support Circles</h3>
                  <p className="text-muted-foreground mb-6">
                    Join anonymous groups focused on specific topics and concerns.
                  </p>
                  <Button asChild variant="outline" className="w-full rounded-full whitespace-normal break-words px-4 py-2 min-h-[44px]">
                    <Link to="/support-circles">
                      Explore Groups <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </Button>
                </div>
                
                <div className="glass-card p-6 rounded-2xl hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto mb-4">
                    <BookOpen size={24} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-3">Resources</h3>
                  <p className="text-muted-foreground mb-6">
                    Access guides, legal information, and helpful materials.
                  </p>
                  <Button asChild variant="outline" className="w-full rounded-full whitespace-normal break-words px-4 py-2 min-h-[44px]">
                    <Link to="/resources">
                      Browse Resources <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </Button>
                </div>
                
                <div className="glass-card p-6 rounded-2xl hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <div className="bg-destructive/10 p-4 rounded-full w-fit mx-auto mb-4">
                    <ShieldAlert size={24} className="text-destructive" />
                  </div>
                  <h3 className="text-xl font-medium mb-3">Emergency Help</h3>
                  <p className="text-muted-foreground mb-6">
                    Get immediate assistance from verified support organizations.
                  </p>
                  <SafetyButton 
                    label="Emergency Support" 
                    onClick={handleEmergencyClick} 
                    className="w-full"
                  />
                </div>
                
                <div className="glass-card p-6 rounded-2xl hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto mb-4">
                    <CircleDollarSign size={24} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-3">Raise Funds</h3>
                  <p className="text-muted-foreground mb-6">
                    Create a fundraiser and receive financial support for your cause.
                  </p>
                  <Button asChild variant="outline" className="w-full rounded-full whitespace-normal break-words px-4 py-2 min-h-[44px]">
                    <Link to="/raise-funds">
                      Start Fundraiser <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Join Banner */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="relative p-8 md:p-12 text-center">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                
                <h2 className="text-2xl md:text-3xl font-medium mb-4">
                  Join Our Secure Community Today
                </h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Connect with others, access resources, and find support - all while maintaining 
                  your privacy and anonymity. Your security is our highest priority.
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button asChild size="lg" className="rounded-full px-8 whitespace-normal break-words py-2 min-h-[44px]">
                    <Link to="/auth/register">
                      Join Securely <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </Button>
                  
                  <Button asChild size="lg" variant="outline" className="rounded-full px-8 whitespace-normal break-words py-2 min-h-[44px]">
                    <Link to="/how-it-works">
                      Learn More
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
