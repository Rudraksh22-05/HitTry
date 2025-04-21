
import { Link } from 'react-router-dom';
import { Shield, Heart, Lock, Mail, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <h2 className="text-lg font-semibold">Silent Guardians</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              A secure, anonymous support network for women, built with privacy as the foundation.
            </p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Heart size={16} className="text-primary" />
              <span>Built with care and compassion</span>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/join" className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm">
                  Join Securely
                </Link>
              </li>
              <li>
                <Link to="/get-help" className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm">
                  Get Help
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm">
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">Legal & Privacy</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/decentralization" className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm">
                  Decentralization Policy
                </Link>
              </li>
              <li>
                <Link to="/security" className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm">
                  Security Measures
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">Connect</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Mail size={16} className="text-muted-foreground" />
                <a 
                  href="mailto:secure@silentguardians.org" 
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm flex items-center"
                >
                  secure@silentguardians.org
                  <Lock size={12} className="ml-1 text-safe-500" />
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/silent-guardians" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm flex items-center"
                >
                  <span>Open Source</span>
                  <ExternalLink size={12} className="ml-1" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Silent Guardians. All rights reserved.
            </p>
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <div className="flex items-center text-xs text-muted-foreground">
                <Lock size={12} className="mr-1" />
                <span>End-to-End Encrypted</span>
              </div>
              <span className="text-border">|</span>
              <div className="flex items-center text-xs text-muted-foreground">
                <Shield size={12} className="mr-1" />
                <span>Zero Data Storage</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
