
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import SafetyButton from '@/components/ui/SafetyButton';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  MessageCircle, 
  ShieldAlert, 
  BookOpen, 
  Search, 
  BellRing, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';

const Dashboard = () => {
  const { toast } = useToast();

  const handleEmergencyClick = () => {
    toast({
      title: "Emergency Support Activated",
      description: "In a real app, this would connect you with immediate assistance.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20">
        <div className="section-container py-12">
          <div className="mb-12">
            <h1 className="text-3xl font-medium mb-2">Welcome, Anonymous User</h1>
            <p className="text-muted-foreground">Your secure space for support and resources.</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              {/* Support Overview */}
              <Card className="glass-card border-accent overflow-hidden shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>Support Dashboard</CardTitle>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      View All
                    </Button>
                  </div>
                  <CardDescription>Your secure support network</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-24 justify-start flex-col items-start p-4 hover:bg-secondary/50">
                      <div className="flex w-full items-center mb-2">
                        <Users className="h-5 w-5 text-primary mr-2" />
                        <span className="font-medium">Support Circles</span>
                      </div>
                      <p className="text-muted-foreground text-sm text-left">
                        Join anonymous groups for peer support
                      </p>
                    </Button>
                    
                    <Button variant="outline" className="h-24 justify-start flex-col items-start p-4 hover:bg-secondary/50">
                      <div className="flex w-full items-center mb-2">
                        <MessageCircle className="h-5 w-5 text-primary mr-2" />
                        <span className="font-medium">Private Mentorship</span>
                      </div>
                      <p className="text-muted-foreground text-sm text-left">
                        Connect privately with verified mentors
                      </p>
                    </Button>
                    
                    <Button variant="outline" className="h-24 justify-start flex-col items-start p-4 hover:bg-secondary/50">
                      <div className="flex w-full items-center mb-2">
                        <BookOpen className="h-5 w-5 text-primary mr-2" />
                        <span className="font-medium">Resource Library</span>
                      </div>
                      <p className="text-muted-foreground text-sm text-left">
                        Access guides, legal help, and more
                      </p>
                    </Button>
                    
                    <Button variant="outline" className="h-24 justify-start flex-col items-start p-4 hover:bg-secondary/50">
                      <div className="flex w-full items-center mb-2">
                        <Search className="h-5 w-5 text-primary mr-2" />
                        <span className="font-medium">Find Help</span>
                      </div>
                      <p className="text-muted-foreground text-sm text-left">
                        Search for specific support resources
                      </p>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Recent Activity */}
              <Card className="glass-card border-accent overflow-hidden shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest secure interactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                        <BellRing size={18} className="text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">New Resource Published</div>
                        <p className="text-sm text-muted-foreground">
                          "Financial Independence Guide" has been added to the resource library.
                        </p>
                        <div className="text-xs text-muted-foreground/70 mt-1">2 hours ago</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-9 h-9 rounded-full bg-safe-500/10 flex items-center justify-center mr-3 mt-0.5">
                        <CheckCircle2 size={18} className="text-safe-500" />
                      </div>
                      <div>
                        <div className="font-medium">Support Circle Available</div>
                        <p className="text-sm text-muted-foreground">
                          "Moving Forward" circle is now open for new members.
                        </p>
                        <div className="text-xs text-muted-foreground/70 mt-1">Yesterday</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-9 h-9 rounded-full bg-safe-500/10 flex items-center justify-center mr-3 mt-0.5">
                        <MessageCircle size={18} className="text-safe-500" />
                      </div>
                      <div>
                        <div className="font-medium">New Mentors Available</div>
                        <p className="text-sm text-muted-foreground">
                          Three new verified mentors are available for private chat.
                        </p>
                        <div className="text-xs text-muted-foreground/70 mt-1">3 days ago</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar/Actions Area */}
            <div className="space-y-8">
              {/* Emergency Help */}
              <Card className="glass-card border-destructive/20 overflow-hidden shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    <ShieldAlert className="h-5 w-5 text-destructive" />
                    <CardTitle>Emergency Support</CardTitle>
                  </div>
                  <CardDescription>Get immediate assistance</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    If you need immediate help, activate emergency support to connect with verified assistance.
                  </p>
                  <SafetyButton 
                    label="Activate Emergency Support" 
                    onClick={handleEmergencyClick} 
                    className="w-full"
                  />
                </CardContent>
              </Card>
              
              {/* Privacy Status */}
              <Card className="glass-card border-accent overflow-hidden shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle>Privacy Status</CardTitle>
                  <CardDescription>Your security information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Connection</span>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm font-medium">Secure</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Encryption</span>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm font-medium">Active</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Message Deletion</span>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm font-medium">Enabled (24h)</span>
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      Privacy Settings <ArrowRight size={12} className="ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Quick Access */}
              <Card className="glass-card border-accent overflow-hidden shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle>Quick Access</CardTitle>
                  <CardDescription>Frequently used resources</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start text-sm">
                      <BookOpen size={16} className="mr-2" />
                      Legal Rights Guide
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-sm">
                      <MessageCircle size={16} className="mr-2" />
                      Support Chat
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-sm">
                      <Users size={16} className="mr-2" />
                      Community Forum
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
