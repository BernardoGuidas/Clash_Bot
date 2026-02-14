import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { LogIn, Sparkles } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Login() {
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      setLocation("/");
    }
  }, [isAuthenticated, loading, setLocation]);

  const handleLogin = () => {
    window.location.href = getLoginUrl();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-purple-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Sparkles className="w-12 h-12 text-yellow-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Clash Royale Card Bot
          </h1>
          <p className="text-purple-200">
            Seu especialista em cartas do Clash Royale
          </p>
        </div>

        {/* Card de Login */}
        <div className="bg-slate-800 border border-purple-500/30 rounded-lg p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Bem-vindo!</h2>
            <p className="text-purple-200 text-sm">
              Faça login para acessar todas as funcionalidades do chatbot,
              salvar seus decks favoritos e acompanhar rankings.
            </p>
          </div>

          {/* Features List */}
          <div className="mb-8 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-yellow-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
              </div>
              <p className="text-purple-100 text-sm">
                Chat inteligente sobre cartas
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-yellow-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
              </div>
              <p className="text-purple-100 text-sm">
                Construtor de decks com análise
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-yellow-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
              </div>
              <p className="text-purple-100 text-sm">
                Comparador de cartas avançado
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-yellow-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
              </div>
              <p className="text-purple-100 text-sm">
                Rankings de clãs e jogadores
              </p>
            </div>
          </div>

          {/* Login Button */}
          <Button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 mb-4"
          >
            <LogIn className="w-5 h-5" />
            {loading ? "Carregando..." : "Entrar com Manus"}
          </Button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-purple-500/30" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-800 text-purple-300">ou</span>
            </div>
          </div>

          {/* Info Text */}
          <p className="text-center text-purple-300 text-sm">
            Você pode explorar o site sem fazer login, mas algumas funcionalidades
            estarão limitadas.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-purple-300 text-sm">
            Não tem uma conta?{" "}
            <a
              href="https://manus.im"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors"
            >
              Crie uma aqui
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
