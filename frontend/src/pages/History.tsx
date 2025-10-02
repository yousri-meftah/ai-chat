import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Search, MessageSquare, Trash2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import type { Conversation } from '@/api/schemas/chat';
import { chatApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const History = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const { items } = await chatApi.listChats();
        const mapped: Conversation[] = (items || []).map((c) => ({
          id: String(c.id),
          title: c.title || 'Chat',
          messages: [],
          createdAt: c.created_at || new Date().toISOString(),
          updatedAt: c.updated_at || c.created_at || new Date().toISOString(),
          model: (c.model as 'gemini' | 'groq' | 'mistral' | undefined) ?? 'gemini',
        }));
        setConversations(mapped);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const previous = conversations;
    setConversations(prev => prev.filter(c => c.id !== id));
    try {
      await chatApi.deleteChat(id);
      toast({ description: 'Deleted successfully' });
    } catch (error: unknown) {
      setConversations(previous);
      const message = error instanceof Error ? error.message : 'Failed to delete chat';
      toast({ variant: 'destructive', description: message });
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
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
            <h1 className="text-4xl font-bold mb-4">{t.history.title}</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.history.searchPlaceholder}
                className="pl-10 bg-background"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16 animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 shadow-glow" />
              <h2 className="text-2xl font-bold mb-2">{t.common.loading}</h2>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-16 animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 shadow-glow">
                <MessageSquare className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">{t.history.noHistory}</h2>
              <p className="text-muted-foreground">{t.history.startChatting}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredConversations.map((conversation, index) => (
                <div
                  key={conversation.id}
                  className="gradient-card p-6 rounded-xl shadow-elevation transition-smooth hover:scale-[1.02] hover:shadow-glow cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => navigate(`/chat/${conversation.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{conversation.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{formatDate(conversation.createdAt)}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/20 transition-smooth"
                      onClick={(e) => handleDelete(e, conversation.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
