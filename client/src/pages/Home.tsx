import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, MessageCircle, Zap, Shield, Search, TrendingUp, LogOut, User } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

function UserMenu() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Desconectado com sucesso!");
      navigate("/");
    } catch (error) {
      toast.error("Erro ao desconectar");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black"
        >
          <User className="w-4 h-4 mr-2" />
          {user?.name || "Usuário"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-slate-800 border-purple-500">
        <div className="px-2 py-1.5">
          <p className="text-sm font-semibold text-white">{user?.name}</p>
          <p className="text-xs text-purple-300">{user?.email}</p>
        </div>
        <DropdownMenuSeparator className="bg-purple-500/30" />
        <DropdownMenuItem
          onClick={() => navigate("/chat")}
          className="text-purple-200 hover:text-white hover:bg-purple-600"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Meu Chat
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-purple-500/30" />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-400 hover:text-red-300 hover:bg-red-600/20"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const exampleQuestions = [
    "Qual é a melhor estratégia com o Hog Rider?",
    "Como faço counter para o Golem?",
    "Quais cartas têm melhor custo-benefício?",
    "Qual é a diferença entre Miner e Bandit?",
    "Como construir um deck balanceado?",
  ];

  const features = [
    {
      icon: <Sparkles className="w-8 h-8 text-yellow-400" />,
      title: "IA Inteligente",
      description: "Respostas contextuais sobre cartas e estratégias do Clash Royale",
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-blue-400" />,
      title: "Chat Interativo",
      description: "Conversa em tempo real com histórico persistente",
    },
    {
      icon: <Search className="w-8 h-8 text-green-400" />,
      title: "Busca de Cartas",
      description: "Encontre cartas por nome, tipo ou custo de elixir",
    },
    {
      icon: <Zap className="w-8 h-8 text-orange-400" />,
      title: "Análise de Dano",
      description: "Informações detalhadas sobre dano, vida e velocidade",
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-400" />,
      title: "Estratégias",
      description: "Dicas sobre sinergias e counters de cartas",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-pink-400" />,
      title: "Cartas Populares",
      description: "Gráficos e análise das cartas mais usadas em tempo real",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-slate-800 to-purple-800 border-b border-purple-600 px-6 py-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <h1 className="text-2xl font-bold text-white">Clash Royale Card Bot</h1>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => navigate("/cards")}
              variant="outline"
              className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
            >
              Cartas
            </Button>
            <Button
              onClick={() => navigate("/popular")}
              variant="outline"
              className="border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-black"
            >
              Populares
            </Button>
            <Button
              onClick={() => navigate("/compare")}
              className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black"
            >
              Comparar
            </Button>
            <Button
              onClick={() => navigate("/deck-builder")}
              className="border-indigo-400 text-indigo-400 hover:bg-indigo-400 hover:text-black"
            >
              Decks
            </Button>
            <Button
              onClick={() => navigate("/rankings")}
              variant="outline"
              className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black"
            >
              Rankings
            </Button>
            {isAuthenticated ? (
              <>
                <Button
                  onClick={() => navigate("/chat")}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold hover:from-yellow-300 hover:to-orange-400"
                >
                  Ir para Chat
                </Button>
                <UserMenu />
              </>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold hover:from-yellow-300 hover:to-orange-400"
              >
                Entrar
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="mb-6 flex justify-center">
            <Sparkles className="w-20 h-20 text-yellow-400 animate-pulse" />
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Seu Especialista em Cartas do Clash Royale
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Um chatbot inteligente que fornece análises detalhadas, estratégias e dicas sobre todas as cartas do Clash Royale
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => navigate("/popular")}
              variant="outline"
              className="border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-black px-8 py-6 text-lg"
            >
              Ver Populares
            </Button>
            <Button
              onClick={() => navigate("/cards")}
              variant="outline"
              className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-8 py-6 text-lg"
            >
              Ver Cartas
            </Button>
            <Button
              onClick={() => (window.location.href = getLoginUrl())}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-8 py-6 text-lg hover:from-yellow-300 hover:to-orange-400 shadow-lg"
            >
              Começar Chat
            </Button>
          </div>
        </div>

        {/* Example Questions */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Exemplos de Perguntas</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {exampleQuestions.map((question, idx) => (
              <Card
                key={idx}
                className="bg-slate-700 border-purple-600 hover:border-yellow-400 cursor-pointer transition-all hover:shadow-lg hover:shadow-yellow-400/20 p-4"
              >
                <p className="text-gray-200">{question}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-white mb-12 text-center">Funcionalidades</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <Card
                key={idx}
                className="bg-gradient-to-br from-slate-700 to-slate-800 border-purple-600 p-6 hover:border-yellow-400 transition-all hover:shadow-lg hover:shadow-yellow-400/20"
              >
                <div className="mb-4">{feature.icon}</div>
                <h4 className="text-lg font-bold text-white mb-2">{feature.title}</h4>
                <p className="text-gray-300">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-lg p-12 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Pronto para melhorar seu jogo?</h3>
          <p className="text-gray-300 mb-8 text-lg">
            Acesse o chatbot agora e comece a aprender sobre estratégias avançadas do Clash Royale
          </p>
          <Button
            onClick={() => (window.location.href = getLoginUrl())}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-8 py-6 text-lg hover:from-yellow-300 hover:to-orange-400"
          >
            Acessar Chatbot
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 border-t border-purple-600 px-6 py-8 mt-20">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p>© 2025 Clash Royale Card Chatbot. Não é afiliado a Supercell.</p>
        </div>
      </footer>
    </div>
  );
}
