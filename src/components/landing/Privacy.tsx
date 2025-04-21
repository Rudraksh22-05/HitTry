
import { Shield, Lock, Eye, Key } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Privacy = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-safe-50/30 via-background to-background"></div>
      
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm mb-6">
              <Lock size={14} />
              <span>End-to-End Encryption</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-medium mb-6">Privacy is at Our Core</h2>
            
            <p className="text-muted-foreground mb-8">
              In a world where privacy is often compromised, our platform stands firm on protecting yours. 
              We've built security measures from the ground up, ensuring that your data remains yours alone.
            </p>
            
            <div className="space-y-6">
              <div className="flex">
                <div className="flex-shrink-0 mt-1">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-safe-100 dark:bg-safe-900">
                    <Shield size={18} className="text-safe-600 dark:text-safe-400" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium">Zero Knowledge Architecture</h3>
                  <p className="text-muted-foreground mt-1">
                    We can't access your data because we don't store it. Everything is encrypted locally on your device.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 mt-1">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-safe-100 dark:bg-safe-900">
                    <Eye size={18} className="text-safe-600 dark:text-safe-400" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium">Anonymous Identity</h3>
                  <p className="text-muted-foreground mt-1">
                    Use pseudonyms and secure authentication to maintain your anonymity while connecting with others.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 mt-1">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-safe-100 dark:bg-safe-900">
                    <Key size={18} className="text-safe-600 dark:text-safe-400" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium">Secure Communication</h3>
                  <p className="text-muted-foreground mt-1">
                    All messages are encrypted and can be set to auto-delete after being read for extra security.
                  </p>
                </div>
              </div>
            </div>
            
            <Button className="mt-8 rounded-full px-8">Learn About Our Privacy</Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card className="glass-card border-accent overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Lock className="text-primary h-6 w-6" />
                  </div>
                </div>
                <h3 className="text-lg font-medium mb-2">End-to-End Encryption</h3>
                <p className="text-muted-foreground text-sm">
                  Messages are encrypted on your device and can only be decrypted by the intended recipient.
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-accent overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 sm:mt-12">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Eye className="text-primary h-6 w-6" />
                  </div>
                </div>
                <h3 className="text-lg font-medium mb-2">No Data Collection</h3>
                <p className="text-muted-foreground text-sm">
                  We don't collect, store, or analyze your personal information. Your data stays with you.
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-accent overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Shield className="text-primary h-6 w-6" />
                  </div>
                </div>
                <h3 className="text-lg font-medium mb-2">Self-Destructing Messages</h3>
                <p className="text-muted-foreground text-sm">
                  Set messages to auto-delete after being read for sensitive communications.
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-accent overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 sm:mt-12">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Key className="text-primary h-6 w-6" />
                  </div>
                </div>
                <h3 className="text-lg font-medium mb-2">Anonymous Authentication</h3>
                <p className="text-muted-foreground text-sm">
                  Use secure, anonymous authentication methods that protect your identity.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Privacy;
