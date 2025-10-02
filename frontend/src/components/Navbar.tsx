import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { MessageSquare, Globe, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const Navbar = () => {
  const { t, language, setLanguage } = useLanguage();
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/chat') {
      return location.pathname === '/chat' || location.pathname.startsWith('/chat/');
    }
    return location.pathname === path;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/landing" className="flex items-center gap-2 transition-smooth hover:opacity-80">
          <MessageSquare className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl bg-gradient-primary bg-clip-text text-transparent">
            AI Chat
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <>
              <Link to="/chat">
                <Button
                  variant={isActive('/chat') ? 'default' : 'ghost'}
                  className="transition-smooth"
                >
                  {t.nav.chat}
                </Button>
              </Link>
              <Link to="/history">
                <Button
                  variant={isActive('/history') ? 'default' : 'ghost'}
                  className="transition-smooth"
                >
                  {t.nav.history}
                </Button>
              </Link>
              <Link to="/profile">
                <Button
                  variant={isActive('/profile') ? 'default' : 'ghost'}
                  className="transition-smooth"
                >
                  {t.nav.profile}
                </Button>
              </Link>
            </>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="transition-smooth">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border">
              <DropdownMenuItem
                onClick={() => setLanguage('en')}
                className={language === 'en' ? 'bg-muted' : ''}
              >
                English
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setLanguage('ar')}
                className={language === 'ar' ? 'bg-muted' : ''}
              >
                العربية
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {isAuthenticated ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="transition-smooth"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          ) : (
            <div className="flex gap-2">
              <Link to="/login">
                <Button variant="ghost" className="transition-smooth">
                  {t.nav.login}
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="gradient-primary transition-smooth shadow-glow">
                  {t.nav.signup}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
