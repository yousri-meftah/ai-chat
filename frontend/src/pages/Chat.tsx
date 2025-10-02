import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, Loader2, Plus } from 'lucide-react';
import Navbar from '@/components/Navbar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ChatMessage } from '@/api/schemas/chat';
import type { AIModel } from '@/api/schemas/backend';
import { useToast } from '@/hooks/use-toast';
import type { ChatDetailOut } from '@/api/schemas/backend';
import { chatApi } from '@/services/api';

const Chat = () => {
  const { t, language } = useLanguage();
  const params = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel>('gemini');
  const { toast } = useToast();
  const chatId = useMemo(() => params.chatId, [params.chatId]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
      model: selectedModel,
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);
    try {
      const res = await chatApi.sendMessage({
        chat_id: chatId ? Number(chatId) : null,
        content: userMessage.content,
        model: selectedModel,
        lang: language,
      });
      const newChatId = String(res.chat_id || chatId || '');
      if (!chatId && newChatId) {
        navigate(`/chat/${newChatId}`, { replace: true });
      }
      const aiMessage: ChatMessage = {
        id: String(res.assistant_message.id),
        role: 'assistant',
        content: res.assistant_message.content,
        timestamp: new Date().toISOString(),
        model: selectedModel,
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t.chat.error;
      setMessages(prev => prev.filter(m => m.id !== userMessage.id));
      toast({ variant: 'destructive', description: message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    navigate('/chat');
  };

  useEffect(() => {
    const load = async () => {
      if (!chatId) {
        setMessages([]);
        return;
      }
      try {
        const res: ChatDetailOut = await chatApi.getChat(chatId);
        const msgs: ChatMessage[] = (res.messages || []).map((m) => ({
          id: String(m.id),
          role: m.role,
          content: m.content,
          timestamp: m.timestamp || new Date().toISOString(),
          model: m.model,
        }));
        setMessages(msgs);
        if (res.model) setSelectedModel(res.model as AIModel);
      } catch {
        setMessages([]);
      }
    };
    load();
  }, [chatId]);

  return (
    <div className="min-h-screen flex flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar />

      <div className="flex-1 flex pt-16">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header (sticky under navbar) */}
          <div className="border-b border-border px-6 py-4 bg-card/50 sticky top-16 z-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold">{t.chat.title}</h1>
                <Select value={selectedModel} onValueChange={(value: AIModel) => setSelectedModel(value)}>
                  <SelectTrigger className="w-48 bg-background">
                    <SelectValue placeholder={t.chat.selectModel} />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="gemini">GEMINI</SelectItem>
                    <SelectItem value="groq">GROQ</SelectItem>
                    <SelectItem value="mistral">MISTRAL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleNewChat}
                variant="outline"
                className="transition-smooth hover:bg-muted"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t.chat.newChat}
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-6 py-6" style={{ direction: language === 'ar' ? 'rtl' : 'ltr', textAlign: language === 'ar' ? 'right' : 'left' }}>
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center animate-fade-in">
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 shadow-glow">
                    <Send className="h-10 w-10 text-primary" />
                  </div>
                  <p className="text-xl text-muted-foreground">{t.chat.noMessages}</p>
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-6">
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                        message.role === 'user'
                          ? 'gradient-primary shadow-glow text-white'
                          : 'gradient-card shadow-elevation'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <p className="text-sm opacity-70 mb-1">{(message.model || selectedModel).toUpperCase()}</p>
                      )}
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="max-w-[80%] gradient-card rounded-2xl px-6 py-4 shadow-elevation">
                      <p className="text-sm opacity-70 mb-1">{selectedModel.toUpperCase()}</p>
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>{t.chat.thinking}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-border px-6 py-4 bg-card/50" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
            <div className="max-w-4xl mx-auto flex gap-4">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                placeholder={t.chat.inputPlaceholder}
                disabled={isLoading}
                className="flex-1 bg-background"
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="gradient-primary shadow-glow transition-smooth hover:scale-105"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    {t.chat.send}
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Floating controls removed; header is sticky instead */}
        </div>
      </div>
    </div>
  );
};

export default Chat;
