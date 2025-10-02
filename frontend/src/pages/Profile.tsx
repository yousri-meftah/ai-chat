import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Calendar, Sparkles, TrendingUp } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { authApi } from '@/services/api';
import { GetProfileResponse } from '@/api/schemas/auth';

interface UserStats {
  totalChats: number;
  messagesExchanged: number;
  favoriteModel: string;
}

interface ProfileData {
  name: string;
  email: string;
  memberSince: string;
  stats: UserStats;
  summary: string;
}

const Profile = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authApi.getProfile()
      .then((res: GetProfileResponse) => {
        const transformedData: ProfileData = {
          name: res.user.name,
          email: res.user.email,
          memberSince: res.user.member_since,
          stats: {
            totalChats: res.stats.total_chats,
            messagesExchanged: res.stats.total_messages,
            favoriteModel: res.stats.favorite_model,
          },
          summary: res.summary,
        };
        
        setProfileData(transformedData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch profile:', error);
        setIsLoading(false);
      });
  }, []);

  if (!user && !profileData) return null;

  const displayName = profileData?.name || user?.name || 'User';
  const displayEmail = profileData?.email || user?.email || 'N/A';
  const displayMemberSince = profileData?.memberSince || user?.memberSince;
  const displayStats = profileData?.stats || user?.stats || {
    totalChats: 0,
    messagesExchanged: 0,
    favoriteModel: '-',
  };
  const displaySummary = profileData?.summary || user?.aiSummary || 'No AI summary available yet. Start chatting to generate personalized insights about your interests and preferences.';

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return 'N/A';
    }
    
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold mb-2">{t.profile.title}</h1>
            <p className="text-muted-foreground">{t.profile.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="lg:col-span-1 gradient-card p-6 rounded-xl shadow-elevation animate-fade-in">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-4 shadow-glow">
                  <User className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-1">{displayName}</h2>
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{displayEmail}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">
                    {t.profile.memberSince} {formatDate(displayMemberSince)}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats and AI Summary */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats */}
              <div className="gradient-card p-6 rounded-xl shadow-elevation animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  {t.profile.stats.title}
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-background/50">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {isLoading ? '...' : displayStats.totalChats}
                    </div>
                    <div className="text-sm text-muted-foreground">{t.profile.stats.totalChats}</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-background/50">
                    <div className="text-3xl font-bold text-accent mb-1">
                      {isLoading ? '...' : displayStats.messagesExchanged}
                    </div>
                    <div className="text-sm text-muted-foreground">{t.profile.stats.messagesExchanged}</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-background/50">
                    <div className="text-lg font-bold text-primary mb-1">
                      {isLoading ? '...' : displayStats.favoriteModel}
                    </div>
                    <div className="text-sm text-muted-foreground">{t.profile.stats.favoriteModel}</div>
                  </div>
                </div>
              </div>

              {/* AI Summary */}
              <div className="gradient-card p-6 rounded-xl shadow-elevation animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary animate-glow" />
                  {t.profile.aiSummary}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t.profile.aiSummaryDescription}
                </p>
                <div className="bg-background/50 p-4 rounded-lg">
                  <p className="text-foreground leading-relaxed">
                    {isLoading ? 'Loading summary...' : displaySummary}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;