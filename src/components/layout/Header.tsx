import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, Shield, LogIn, User, LogOut, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const closeSheet = () => {
    setIsOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">Silent Guardians</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="hidden gap-6 md:flex">
            <Link
              to="/support-circles"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Support Circles
            </Link>
            <Link
              to="/how-it-works"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              How It Works
            </Link>
            <Link
              to="/resources"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Resources
            </Link>
            <Link
              to="/raise-funds"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Crowd Funding
            </Link>
            <Link
              to="/geo-assistance"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Geo Assistance
            </Link>
            <Link
              to="/emergency-support"
              className="text-sm font-medium text-destructive transition-colors hover:text-destructive/80"
            >
              Emergency Support
            </Link>
          </nav>
        )}

        {/* Auth Buttons/Mobile Menu */}
        <div className="flex items-center gap-2">
          {!isMobile && !user && (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/auth/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/auth/register">Join Now</Link>
              </Button>
            </>
          )}

          {!isMobile && user && (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link to="/dashboard">
                  <User className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </>
          )}

          {isMobile && (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  {isOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link
                    to="/"
                    className="text-lg font-medium hover:text-primary"
                    onClick={closeSheet}
                  >
                    Home
                  </Link>
                  <Link
                    to="/support-circles"
                    className="text-lg font-medium hover:text-primary"
                    onClick={closeSheet}
                  >
                    Support Circles
                  </Link>
                  <Link
                    to="/how-it-works"
                    className="text-lg font-medium hover:text-primary"
                    onClick={closeSheet}
                  >
                    How It Works
                  </Link>
                  <Link
                    to="/resources"
                    className="text-lg font-medium hover:text-primary"
                    onClick={closeSheet}
                  >
                    Resources
                  </Link>
                  <Link
                    to="/raise-funds"
                    className="text-lg font-medium hover:text-primary"
                    onClick={closeSheet}
                  >
                    Crowd Funding
                  </Link>
                  <Link
                    to="/geo-assistance"
                    className="text-lg font-medium hover:text-primary"
                    onClick={closeSheet}
                  >
                    Geo Assistance
                  </Link>
                  <Link
                    to="/emergency-support"
                    className="text-lg font-medium text-destructive hover:text-destructive/80"
                    onClick={closeSheet}
                  >
                    Emergency Support
                  </Link>
                  <div className="border-t mt-2 pt-4">
                    {!user ? (
                      <>
                        <Button variant="outline" className="w-full mb-2" asChild>
                          <Link to="/auth/login" onClick={closeSheet}>
                            <LogIn className="mr-2 h-4 w-4" />
                            Sign In
                          </Link>
                        </Button>
                        <Button className="w-full" asChild>
                          <Link to="/auth/register" onClick={closeSheet}>
                            Join Now
                          </Link>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" className="w-full mb-2" asChild>
                          <Link to="/dashboard" onClick={closeSheet}>
                            <User className="mr-2 h-4 w-4" />
                            Dashboard
                          </Link>
                        </Button>
                        <Button variant="ghost" className="w-full" onClick={() => {
                          handleSignOut();
                          closeSheet();
                        }}>
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign Out
                        </Button>
                      </>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
