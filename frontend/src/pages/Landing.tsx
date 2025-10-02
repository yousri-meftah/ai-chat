import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  MessageSquare,
  History,
  User,
  Globe,
  Shield,
  Smartphone,
  Sparkles,
  Zap,
  Brain,
} from 'lucide-react';
import Navbar from '@/components/Navbar';

const Landing = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Brain,
      title: t.features.multiModel.title,
      description: t.features.multiModel.description,
    },
    {
      icon: History,
      title: t.features.history.title,
      description: t.features.history.description,
    },
    {
      icon: Sparkles,
      title: t.features.personalized.title,
      description: t.features.personalized.description,
    },
    {
      icon: Globe,
      title: t.features.multilingual.title,
      description: t.features.multilingual.description,
    },
    {
      icon: Shield,
      title: t.features.secure.title,
      description: t.features.secure.description,
    },
    {
      icon: Smartphone,
      title: t.features.responsive.title,
      description: t.features.responsive.description,
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-50" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-glow" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-glow" />
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              {t.hero.title}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4">
              {t.hero.subtitle}
            </p>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t.hero.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/signup">
                <Button
                  size="lg"
                  className="gradient-primary shadow-glow transition-smooth hover:scale-105 text-lg px-8"
                >
                  <MessageSquare className="mr-2 h-5 w-5" />
                  {t.hero.cta}
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="transition-smooth hover:bg-muted text-lg px-8"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t.hero.secondaryCta}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-card/50">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.features.title}</h2>
            <p className="text-xl text-muted-foreground">{t.features.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="gradient-card p-6 rounded-lg shadow-elevation transition-smooth hover:scale-105 hover:shadow-glow animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center animate-fade-in">
            <Zap className="h-16 w-16 text-primary mx-auto mb-6 animate-glow" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{t.about.title}</h2>
            <p className="text-xl text-muted-foreground mb-6">
              {t.about.description}
            </p>
            <p className="text-lg text-muted-foreground italic">
              {t.about.mission}
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-card/50">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="gradient-card p-12 rounded-2xl shadow-elevation animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t.cta.title}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
            {t.cta.description}
            </p>
            <Link to="/signup">
              <Button
                size="lg"
                className="gradient-primary shadow-glow transition-smooth hover:scale-105 text-lg px-8"
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                {t.hero.cta}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground">
        <p>{t.footer.copyright}</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
