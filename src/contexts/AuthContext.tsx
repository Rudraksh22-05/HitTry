import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthContextType {
  user: SupabaseUser | null;
  session: Session | null;
  loading: boolean;
<<<<<<< HEAD
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (email: string, password: string) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<AuthResponse>;
}

interface AuthResponse {
  error?: Error;
  data?: any;
=======
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
>>>>>>> friend/main
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log("Auth state changed:", _event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

<<<<<<< HEAD
  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
=======
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
>>>>>>> friend/main
      
      if (error) {
        console.error("Sign in error:", error);
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
<<<<<<< HEAD
        return { error };
      }
      
      console.log("Sign in successful");
=======
        throw error;
      }
      
      console.log("Sign in successful:", data);
>>>>>>> friend/main
      toast({
        title: "Welcome back",
        description: "You've successfully logged in",
      });
      
      navigate('/dashboard');
<<<<<<< HEAD
      return { data: true };
    } catch (error) {
      console.error("Sign in error:", error);
      return { error };
=======
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
>>>>>>> friend/main
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const signUp = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({ 
=======
  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({ 
>>>>>>> friend/main
        email, 
        password,
        options: {
          emailRedirectTo: window.location.origin + '/auth/login'
        }
      });
      
      if (error) {
        console.error("Sign up error:", error);
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive",
        });
<<<<<<< HEAD
        return { error };
      }
      
      console.log("Sign up successful");
      return { data: true };
    } catch (error) {
      console.error("Sign up error:", error);
      return { error };
=======
        throw error;
      }
      
      console.log("Sign up successful:", data);
      toast({
        title: "Account created",
        description: "Please check your email to confirm your account",
      });
      
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
>>>>>>> friend/main
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Sign out error:", error);
        toast({
          title: "Sign out failed",
          description: error.message || "Please try again",
          variant: "destructive",
        });
        throw error;
      }
      
      console.log("Sign out successful");
      toast({
        title: "Signed out",
        description: "You've been successfully logged out",
      });
      
      if (navigate) {
        navigate('/');
      }
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const resetPassword = async (email: string): Promise<AuthResponse> => {
=======
  const resetPassword = async (email: string) => {
>>>>>>> friend/main
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/auth/reset-password',
      });
      
      if (error) {
        toast({
          title: "Password reset failed",
          description: error.message,
          variant: "destructive",
        });
<<<<<<< HEAD
        return { error };
=======
        throw error;
>>>>>>> friend/main
      }
      
      toast({
        title: "Password reset email sent",
        description: "Please check your email for instructions",
      });
<<<<<<< HEAD
      return { data: true };
    } catch (error) {
      console.error("Reset password error:", error);
      return { error };
=======
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
>>>>>>> friend/main
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
