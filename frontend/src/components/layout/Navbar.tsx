import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import { GraduationCap, LogOut } from 'lucide-react';

export const Navbar = () => {
  const { isAuthenticated, role, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl group">
            <GraduationCap className="h-7 w-7 text-primary group-hover:scale-110 transition-transform" />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Campus Connect
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {!isAuthenticated && (
              <>
                <Link to="/events" className="text-sm font-medium hover:text-primary transition-colors">
                  Events
                </Link>
                <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">
                  Login
                </Link>
                <Button asChild size="sm">
                  <Link to="/register">Sign Up</Link>
                </Button>
              </>
            )}

            {isAuthenticated && role === 'USER' && (
              <>
                <Link to="/events" className="text-sm font-medium hover:text-primary transition-colors">
                  Events
                </Link>
                <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                  My Dashboard
                </Link>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Welcome, {user?.name}
                  </span>
                  <Button onClick={handleLogout} size="sm" variant="ghost">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </>
            )}

            {isAuthenticated && role === 'ADMIN' && (
              <>
                <Link to="/admin/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                  Admin Dashboard
                </Link>
                <Link to="/admin/manage-events" className="text-sm font-medium hover:text-primary transition-colors">
                  Manage Events
                </Link>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Admin: {user?.name}
                  </span>
                  <Button onClick={handleLogout} size="sm" variant="ghost">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </>
            )}

            <ThemeToggle />
          </div>

          {/* Mobile Menu */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};
