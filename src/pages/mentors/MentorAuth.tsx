import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

// TODO: Replace with your actual Supabase URL and anon key
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const MentorAuth = () => {
  const [tab, setTab] = useState<'login' | 'signup'>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const navigate = useNavigate();

  // Signup state
  const [signupData, setSignupData] = useState({
    full_name: "",
    phone: "",
    email: "",
    password: "",
  });

  // Login state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Handle mentor signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setWarning(null);
    try {
      // Sign up with Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
      });
      if (signUpError) {
        setError(signUpError.message || "Signup failed");
        setLoading(false);
        return;
      }
      if (!data.user) {
        setError("No user returned from Supabase");
        setLoading(false);
        return;
      }
      // Insert mentor details into mentors table
      const { error: insertError } = await supabase.from("mentors").insert([
        {
          id: data.user.id,
          full_name: signupData.full_name,
          phone: signupData.phone,
          email: signupData.email,
        },
      ]);
      if (insertError) {
        setWarning(
          "Signup succeeded, but mentor profile was not fully created (" +
            (insertError.message || "mentor insert failed") + "). Please contact support."
        );
      }
      // Redirect to dashboard
      navigate("/mentors/dashboard");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // Handle mentor login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setWarning(null);
    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });
      if (loginError) throw loginError;
      // Redirect to dashboard
      navigate("/mentors/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
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
          <div className="flex gap-2 mb-6">
            <Button
              type="button"
              variant={tab === "login" ? "default" : "outline"}
              onClick={() => setTab("login")}
              className="flex-1"
            >
              Login
            </Button>
            <Button
              type="button"
              variant={tab === "signup" ? "default" : "outline"}
              onClick={() => setTab("signup")}
              className="flex-1"
            >
              Signup
            </Button>
          </div>
          {tab === "signup" && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  placeholder="Full Name"
                  value={signupData.full_name}
                  onChange={e => setSignupData({ ...signupData, full_name: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="Phone Number"
                  value={signupData.phone}
                  onChange={e => setSignupData({ ...signupData, phone: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mentor-email">Email</Label>
                <Input
                  id="mentor-email"
                  type="email"
                  placeholder="you@example.com"
                  value={signupData.email}
                  onChange={e => setSignupData({ ...signupData, email: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mentor-password">Password</Label>
                <Input
                  id="mentor-password"
                  type="password"
                  placeholder="••••••••"
                  value={signupData.password}
                  onChange={e => setSignupData({ ...signupData, password: e.target.value })}
                  required
                  minLength={6}
                  disabled={loading}
                />
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              {warning && <div className="text-yellow-600 text-sm">{warning}</div>}
              <Button type="submit" disabled={loading} className="w-full mt-2">
                {loading ? "Signing up..." : "Sign Up"}
              </Button>
            </form>
          )}
          {tab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mentor-login-email">Email</Label>
                <Input
                  id="mentor-login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={loginData.email}
                  onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mentor-login-password">Password</Label>
                <Input
                  id="mentor-login-password"
                  type="password"
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                  required
                  minLength={6}
                  disabled={loading}
                />
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <Button type="submit" disabled={loading} className="w-full mt-2">
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorAuth;
