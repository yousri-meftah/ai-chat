import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { MessageSquare, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Signup = () => {
  const { t, language, setLanguage } = useLanguage();
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);

    try {
      await signup(formData.email, formData.password, language);
      toast.success(t.common.success);
      navigate('/chat');
    } catch (error) {
      toast.error(t.chat.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="absolute inset-0 gradient-hero opacity-30" />
        
        <div className="w-full max-w-md relative z-10 animate-fade-in">
          <div className="gradient-card p-8 rounded-2xl shadow-elevation">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center shadow-glow">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-center mb-2">
              {t.auth.signupTitle}
            </h1>
            <p className="text-muted-foreground text-center mb-8">
              {t.auth.signupSubtitle}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">{t.auth.email}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t.auth.emailPlaceholder}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t.auth.password}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t.auth.passwordPlaceholder}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredLang">{t.common.language}</Label>
                <select
                  id="preferredLang"
                  className="w-full bg-background/50 border border-border rounded-md px-3 py-2"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'en' | 'ar')}
                >
                  <option value="en">English</option>
                  <option value="ar">العربية</option>
                </select>
              </div>

              <Button
                type="submit"
                className="w-full gradient-primary shadow-glow transition-smooth hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.common.loading}
                  </>
                ) : (
                  t.auth.signupButton
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              {t.auth.hasAccount}{' '}
              <Link to="/login" className="text-primary hover:underline transition-smooth">
                {t.auth.loginLink}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
