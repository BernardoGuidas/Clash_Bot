import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, Sparkles, Copy, Trash2, Check, RefreshCw } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Streamdown } from "streamdown";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

type ChatMessage = {
  id?: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
};

export default function Chat() {
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Quick reply suggestions
  const quickReplies = [
    "Qual é a melhor carta para defesa?",
    "Como fazer counter para P.E.K.K.A?",
    "Qual carta tem melhor custo-benefício?",
    "Estratégias com Golem",
    "Melhores decks para Arena 12",
  ];

  // Fetch chat history on mount
  const { data: history } = trpc.chat.getHistory.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Load history into messages
  useEffect(() => {
    if (history) {
      const formattedMessages = history
        .reverse()
        .map((msg) => ({
          id: `${msg.id}`,
          role: msg.role as "user" | "assistant",
          content: msg.content,
          timestamp: msg.createdAt,
        }));
      setMessages(formattedMessages);
    }
  }, [history]);

  // Auto-scroll to bottom with smooth behavior
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Send message mutation
  const sendMessageMutation = trpc.chat.sendMessage.useMutation({
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.message,
          timestamp: new Date(),
        },
      ]);
      setInput("");
      setIsLoading(false);
      inputRef.current?.focus();
    },
    onError: (error) => {
      console.error("Error sending message:", error);
      toast.error("Erro ao enviar mensagem. Tente novamente.");
      setIsLoading(false);
    },
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !isAuthenticated) return;

    // Add user message to UI
    const userMessage: ChatMessage = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Send to server
    sendMessageMutation.mutate({ message: input });
  };

  const handleQuickReply = (reply: string) => {
    setInput(reply);
    inputRef.current?.focus();
  };

  const handleClearChat = () => {
    setMessages([]);
    toast.success("Conversa limpa com sucesso!");
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      toast.success("Mensagem copiada!");
    } catch (err) {
      toast.error("Erro ao copiar mensagem");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <Sparkles className="w-16 h-16 text-yellow-400 animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Clash Royale Card Chatbot</h1>
          <p className="text-xl text-gray-300 mb-8">Faça login para conversar sobre cartas do Clash Royale</p>
          <Button
            onClick={() => (window.location.href = getLoginUrl())}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-8 py-6 text-lg hover:from-yellow-300 hover:to-orange-400"
          >
            Fazer Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-purple-800 border-b border-purple-600 px-6 py-4 shadow-lg flex-shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">Chat com IA</h1>
              <p className="text-sm text-gray-400">Especialista em Clash Royale</p>
            </div>
          </div>
          {messages.length > 0 && (
            <Button
              onClick={handleClearChat}
              variant="outline"
              size="sm"
              className="border-red-400 text-red-400 hover:bg-red-400 hover:text-black"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpar Chat
            </Button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div ref={scrollRef} className="max-w-4xl mx-auto px-6 py-6 space-y-6">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-pulse" />
                <h2 className="text-2xl font-bold text-white mb-2">Bem-vindo ao Chat!</h2>
                <p className="text-gray-400 mb-6">Pergunte qualquer coisa sobre cartas do Clash Royale</p>
                
                {/* Quick Replies */}
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Sugestões de perguntas:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {quickReplies.map((reply, idx) => (
                      <Badge
                        key={idx}
                        onClick={() => handleQuickReply(reply)}
                        className="cursor-pointer bg-purple-600 hover:bg-purple-500 text-white px-3 py-2 text-sm"
                      >
                        {reply}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                      : "bg-slate-800 border border-purple-600 text-white"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="space-y-2">
                      <Streamdown>{msg.content}</Streamdown>
                      <div className="flex items-center justify-between pt-2 border-t border-purple-700">
                        <span className="text-xs text-gray-400">
                          {msg.timestamp?.toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <Button
                          onClick={() => copyToClipboard(msg.content, `${idx}`)}
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-gray-400 hover:text-white"
                        >
                          {copiedId === `${idx}` ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      <p className="text-xs text-purple-200 mt-2">
                        {msg.timestamp?.toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-slate-800 border border-purple-600 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                    <span className="text-sm text-gray-400">Pensando...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="bg-gradient-to-r from-slate-800 to-purple-800 border-t border-purple-600 px-6 py-4 flex-shrink-0">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder="Digite sua pergunta sobre Clash Royale..."
              className="flex-1 bg-slate-700 border-purple-600 text-white placeholder:text-gray-400 resize-none min-h-[60px] max-h-[120px]"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-6 self-end"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-2">Pressione Enter para enviar, Shift+Enter para nova linha</p>
        </form>
      </div>
    </div>
  );
}
