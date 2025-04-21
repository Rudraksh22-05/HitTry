
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Card, CardContent } from "@/components/ui/card";
import { useTitle } from "@/hooks/use-title";
import { Shield, UserRound, MessageCircle, HeartHandshake, Lock, ShieldCheck } from 'lucide-react';

const HowItWorks = () => {
  useTitle("How It Works | Silent Guardians");
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-12">
        <Container>
          <Heading 
            title="How Silent Guardians Works" 
            description="Our platform is designed with your safety and privacy as our top priorities."
            className="mb-8"
          />
          
          <div className="space-y-12">
            {/* Core Principles */}
            <section>
              <h2 className="text-2xl font-medium mb-6">Our Core Principles</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="mb-4 bg-primary/10 p-3 rounded-full w-fit">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Privacy First</h3>
                    <p className="text-muted-foreground">
                      We never share your identity without consent. All data is encrypted and securely stored.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="mb-4 bg-primary/10 p-3 rounded-full w-fit">
                      <UserRound className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Anonymous Identity</h3>
                    <p className="text-muted-foreground">
                      Communicate using anonymous identifiers that cannot be linked back to your real identity.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="mb-4 bg-primary/10 p-3 rounded-full w-fit">
                      <HeartHandshake className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Supportive Community</h3>
                    <p className="text-muted-foreground">
                      Connect with others who understand your situation in a safe, moderated environment.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>
            
            {/* How to Use */}
            <section>
              <h2 className="text-2xl font-medium mb-6">How to Use Our Platform</h2>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="bg-muted rounded-full p-4 flex-shrink-0">
                    <span className="font-medium text-xl">1</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Join Support Circles</h3>
                    <p className="text-muted-foreground mb-2">
                      Browse our available support circles based on your specific needs and concerns.
                    </p>
                    <p className="text-muted-foreground">
                      Each circle provides a specialized community of support for different situations.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="bg-muted rounded-full p-4 flex-shrink-0">
                    <span className="font-medium text-xl">2</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Participate in Discussions</h3>
                    <p className="text-muted-foreground mb-2">
                      Start or join anonymous thread-based discussions in your support circles.
                    </p>
                    <p className="text-muted-foreground">
                      Share experiences and advice while maintaining your privacy through anonymous identifiers.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="bg-muted rounded-full p-4 flex-shrink-0">
                    <span className="font-medium text-xl">3</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Connect Through Chat</h3>
                    <p className="text-muted-foreground mb-2">
                      Engage in real-time chat within your support circles for immediate connection.
                    </p>
                    <p className="text-muted-foreground">
                      Our platform ensures all communications remain secure and anonymous.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="bg-muted rounded-full p-4 flex-shrink-0">
                    <span className="font-medium text-xl">4</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Access Emergency Support</h3>
                    <p className="text-muted-foreground mb-2">
                      For immediate assistance, our Emergency Support provides direct connections to crisis services.
                    </p>
                    <p className="text-muted-foreground">
                      These services are available 24/7 and accessible with complete anonymity.
                    </p>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Security Measures */}
            <section>
              <h2 className="text-2xl font-medium mb-6">Our Security Measures</h2>
              <Card>
                <CardContent className="pt-6 pb-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <Lock className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2">Anonymous Identifiers</h3>
                        <p className="text-muted-foreground">
                          Each support circle assigns you a unique anonymous ID that can't be traced back to your account.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <MessageCircle className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2">Thread-based Discussions</h3>
                        <p className="text-muted-foreground">
                          Our platform uses thread-based discussions that allow for organized and secure conversations.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2">Secure Data Storage</h3>
                        <p className="text-muted-foreground">
                          All data is encrypted and stored securely with automatic deletion after periods of inactivity.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <Shield className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2">Content Moderation</h3>
                        <p className="text-muted-foreground">
                          Community-driven moderation through upvoting and downvoting helps maintain quality discussions.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
};

export default HowItWorks;
