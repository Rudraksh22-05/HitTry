
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-safe-50/40 via-background to-background"></div>
      
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 bg-secondary/50 text-foreground/80 px-3 py-1 rounded-full text-sm backdrop-blur-sm border border-border">
              <ShieldCheck size={14} className="text-safe-500" />
              <span>Built with privacy-first principles</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight">
              A Secure, Anonymous <span className="text-primary">Support Network</span> for Women
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl">
              Connect with mentors, find resources, and access emergency help - all while maintaining your privacy and security. No personal data stored. End-to-end encryption.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link to="/auth/register">
                  Join Securely <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
              
              <Button asChild size="lg" variant="outline" className="rounded-full px-8">
                <Link to="/how-it-works">
                  How It Works
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="relative hidden lg:block">
            <div className="glass-card rounded-2xl p-5 shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                alt="Women Supporting Each Other" 
                className="rounded-xl w-full h-auto object-cover"
              />
              
              <div className="absolute -bottom-8 -left-8 glass-card rounded-xl p-4 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Anonymous Connection Secured</span>
                </div>
              </div>
              
              <div className="absolute -top-6 -right-6 glass-card rounded-xl p-4 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-safe-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">End-to-End Encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 hidden md:block">
          <div className="flex flex-col items-center space-y-2">
            <span className="text-sm text-muted-foreground">Learn more</span>
            <div className="animate-bounce w-6 h-6 flex items-center justify-center">
              <ArrowRight size={20} className="transform rotate-90 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
