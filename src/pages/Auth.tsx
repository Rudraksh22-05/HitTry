import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import LiveFaceCheck from '@/components/LiveFaceCheck';

// Convert 'login', 'register', 'reset-password' to title case
const getPageTitle = (page: string) => {
  switch (page) {
    case 'login':
      return 'Log In';
    case 'register':
      return 'Register';
    case 'reset-password':
      return 'Reset Password';
    default:
      return 'Authentication';
  }
};

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signIn, signUp, resetPassword, loading } = useAuth();
  const { toast } = useToast();
  
  // Determine which auth screen to show based on URL
  const authType = location.pathname.split('/').pop() || 'login';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [faceCheckPassed, setFaceCheckPassed] = useState(false);
  const [detectedGender, setDetectedGender] = useState<string | null>(null);

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user && authType !== 'reset-password') {
      navigate('/dashboard');
    }
  }, [user, navigate, authType]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      switch (authType) {
        case 'login':
          await signIn(email, password);
          break;
        case 'register':
          if (password !== confirmPassword) {
            toast({
              title: "Passwords don't match",
              description: "Please make sure your passwords match",
              variant: "destructive",
            });
            return;
          }
          
          if (password.length < 6) {
            toast({
              title: "Password too short",
              description: "Password must be at least 6 characters",
              variant: "destructive",
            });
            return;
          }
          
          await signUp(email, password);
          toast({
            title: "Account created",
            description: "Please check your email to confirm your account",
          });
          break;
        case 'reset-password':
          await resetPassword(email);
          toast({
            title: "Password reset email sent",
            description: "Please check your email for the reset link",
          });
          break;
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: "Authentication error",
        description: error.message || "An error occurred during authentication",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Link to="/" className="flex items-center space-x-2 text-foreground">
            <Shield className="h-10 w-10 text-primary" />
            <span className="text-2xl font-semibold">Silent Guardians</span>
          </Link>
        </div>
        
        <div className="bg-card rounded-xl shadow-lg p-8 border border-border">
          <h1 className="text-2xl font-medium mb-6">{getPageTitle(authType)}</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* LiveFaceCheck for register only */}
            {authType === 'register' && !faceCheckPassed && (
              <div className="mb-4">
                <LiveFaceCheck
                  onSuccess={(gender) => {
                    setFaceCheckPassed(true);
                    setDetectedGender(gender);
                  }}
                />
                <div className="text-xs text-muted-foreground mt-2">
                  Please complete the live face check to proceed with registration.
                </div>
              </div>
            )}
            {/* Hide rest of form until faceCheckPassed */}
            {(authType !== 'register' || faceCheckPassed) && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                {authType !== 'reset-password' && (
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      disabled={isSubmitting}
                    />
                  </div>
                )}
                {authType === 'register' && (
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      disabled={isSubmitting}
                    />
                  </div>
                )}
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting || loading}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {authType === 'login' ? 'Log In' : 
                        authType === 'register' ? 'Create Account' : 'Send Reset Link'}
                      <ArrowRight size={16} className="ml-2" />
                    </>
                  )}
                </Button>
              </>
            )}
          </form>
          
          <div className="mt-6 pt-6 border-t border-border text-center">
            {authType === 'login' && (
              <div className="space-y-3">
                <div>
                  <Link to="/auth/register" className="text-primary hover:underline">
                    Need an account? Register
                  </Link>
                </div>
                <div>
                  <Link to="/auth/reset-password" className="text-muted-foreground hover:text-foreground">
                    Forgot your password?
                  </Link>
                </div>
              </div>
            )}
            
            {authType === 'register' && (
              <Link to="/auth/login" className="text-primary hover:underline">
                Already have an account? Log in
              </Link>
            )}
            
            {authType === 'reset-password' && (
              <Link to="/auth/login" className="text-primary hover:underline">
                Back to log in
              </Link>
            )}
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>By using Silent Guardians, you agree to our <Link to="/terms" className="underline">Terms of Service</Link> and <Link to="/privacy" className="underline">Privacy Policy</Link>.</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
