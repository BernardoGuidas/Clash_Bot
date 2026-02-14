import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wand2, Trash2, Save, Share2, Zap, Target, Copy, Check } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useEffect } from "react";

type Card = {
  id: number;
  name: string;
  type: string;
  elixirCost: number;
  rarity: string;
  description: string;
  damage?: number | null;
  hitPoints?: number | null;
  imageUrl?: string | null;
};

export default function DeckBuilder() {
  const [deckName, setDeckName] = useState("Meu Deck");
  const [deckDescription, setDeckDescription] = useState("");
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewCard, setPreviewCard] = useState<Card | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [lastSavedDeckId, setLastSavedDeckId] = useState<number | null>(null);

  // Fetch all cards
  const { data: allCards = [] } = trpc.cards.getAll.useQuery();

  // Handle import from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const importCode = params.get("import");
    if (importCode && allCards.length > 0) {
      const cardIds = importCode.split("-").map(Number);
      const importedCards = allCards.filter((c) => cardIds.includes(c.id));
      if (importedCards.length > 0) {
        setSelectedCards(importedCards);
        toast.success(`Deck importado com ${importedCards.length} cartas!`);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [allCards]);

  // Filter cards for selection
  const filteredCards = useMemo(() => {
    return allCards.filter(
      (card) =>
        card.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !selectedCards.some((sc) => sc.id === card.id)
    );
  }, [allCards, searchQuery, selectedCards]);

  // Calculate average elixir
  const averageElixir = useMemo(() => {
    if (selectedCards.length === 0) return "0";
    const total = selectedCards.reduce((sum, card) => sum + (card.elixirCost || 0), 0);
    return (total / selectedCards.length).toFixed(1);
  }, [selectedCards]);

  // Get balance suggestions
  const balanceSuggestions = useMemo(() => {
    if (selectedCards.length === 0) return [];

    const suggestions = [];
    const avgElixir = parseFloat(averageElixir as string);

    if (avgElixir > 4.5) {
      suggestions.push({
        type: "warning",
        message: "Deck muito caro! Considere adicionar cartas com custo menor de elixir.",
      });
    } else if (avgElixir < 3) {
      suggestions.push({
        type: "warning",
        message: "Deck muito barato! Adicione cartas com maior custo para mais poder.",
      });
    } else {
      suggestions.push({
        type: "success",
        message: "Custo de elixir bem balanceado!",
      });
    }

    const troops = selectedCards.filter((c) => c.type === "Troop");
    const spells = selectedCards.filter((c) => c.type === "Spell");
    const buildings = selectedCards.filter((c) => c.type === "Building");

    if (troops.length < 3) {
      suggestions.push({
        type: "warning",
        message: `Você tem apenas ${troops.length} tropas. Considere adicionar mais.`,
      });
    }

    if (spells.length === 0) {
      suggestions.push({
        type: "warning",
        message: "Seu deck não tem feitiços! Adicione pelo menos um para mais versatilidade.",
      });
    }

    return suggestions;
  }, [selectedCards, averageElixir]);

  // Auto-suggest cards for balance
  const suggestedCards = useMemo(() => {
    if (selectedCards.length >= 8) return [];

    const avgElixir = parseFloat(averageElixir);
    const selectedIds = new Set(selectedCards.map((c) => c.id));

    if (avgElixir > 4.5) {
      // Suggest cheap cards
      return allCards
        .filter((c) => !selectedIds.has(c.id) && c.elixirCost <= 3)
        .slice(0, 3);
    } else if (avgElixir < 3) {
      // Suggest expensive cards
      return allCards
        .filter((c) => !selectedIds.has(c.id) && c.elixirCost >= 5)
        .slice(0, 3);
    }

    return [];
  }, [selectedCards, averageElixir, allCards]);

  const handleAddCard = (card: Card) => {
    if (selectedCards.length < 8) {
      setSelectedCards([...selectedCards, card]);
      setSearchQuery("");
      toast.success(`${card.name} adicionado ao deck!`);
    } else {
      toast.error("Seu deck já tem 8 cartas!");
    }
  };

  const handleRemoveCard = (cardId: number) => {
    setSelectedCards(selectedCards.filter((c) => c.id !== cardId));
  };

  const handleSuggestedCard = (card: Card) => {
    handleAddCard(card);
  };

  const handleSaveDeck = async () => {
    if (selectedCards.length !== 8) {
      toast.error("Seu deck deve ter exatamente 8 cartas!");
      return;
    }

    setIsSaving(true);
    try {
      const createMutation = trpc.decks.create.useMutation();
      await createMutation.mutateAsync({
        name: deckName,
        description: deckDescription,
        cardIds: selectedCards.map((c) => c.id),
        averageElixir: Math.round(parseFloat(averageElixir as string) * 10) / 10,
        isPublic,
      });
      toast.success("Deck salvo com sucesso!");
      setSelectedCards([]);
      setDeckName("Meu Deck");
      setDeckDescription("");
    } catch (error) {
      toast.error("Erro ao salvar deck. Tente novamente.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearDeck = () => {
    setSelectedCards([]);
    setDeckName("Meu Deck");
    setDeckDescription("");
  };

  const generateShareCode = () => {
    if (selectedCards.length === 0) return "";
    return selectedCards.map((c) => c.id).join("-");
  };

  const generateShareUrl = () => {
    const code = generateShareCode();
    const baseUrl = window.location.origin;
    return `${baseUrl}/deck-builder?import=${code}`;
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "code") {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      } else {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
      toast.success(`${type === "code" ? "Codigo" : "Link"} copiado!`);
    } catch (err) {
      toast.error("Erro ao copiar");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-purple-800 border-b border-purple-600 px-6 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Wand2 className="w-8 h-8 text-yellow-400" />
            Construtor de Decks
          </h1>
          <p className="text-gray-400 mt-2">Crie e compartilhe seus decks de Clash Royale</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Card Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Deck Info */}
            <Card className="bg-slate-700 border-purple-600 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Informações do Deck</h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-white mb-2 block">Nome do Deck</Label>
                  <Input
                    value={deckName}
                    onChange={(e) => setDeckName(e.target.value)}
                    className="bg-slate-600 border-purple-600 text-white placeholder-gray-400"
                    placeholder="Digite o nome do seu deck"
                  />
                </div>
                <div>
                  <Label className="text-white mb-2 block">Descrição (opcional)</Label>
                  <Input
                    value={deckDescription}
                    onChange={(e) => setDeckDescription(e.target.value)}
                    className="bg-slate-600 border-purple-600 text-white placeholder-gray-400"
                    placeholder="Descreva sua estratégia"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="isPublic" className="text-gray-300 cursor-pointer">
                    Tornar público para outros jogadores
                  </Label>
                </div>
              </div>
            </Card>

            {/* Card Search */}
            <Card className="bg-slate-700 border-purple-600 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Adicionar Cartas</h2>
              <div className="relative">
                <Input
                  placeholder="Buscar cartas (autocompletar)..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  className="bg-slate-600 border-purple-600 text-white placeholder-gray-400 mb-4"
                />
                {showDropdown && filteredCards.length > 0 && (
                  <div className="absolute top-12 left-0 right-0 bg-slate-600 border border-purple-600 rounded max-h-64 overflow-y-auto z-10 shadow-lg">
                    {filteredCards.slice(0, 10).map((card) => (
                      <button
                        key={card.id}
                        onClick={() => {
                          handleAddCard(card);
                          setShowDropdown(false);
                        }}
                        onMouseEnter={() => setPreviewCard(card)}
                        className="w-full text-left p-3 hover:bg-slate-500 border-b border-slate-500 last:border-b-0 transition-colors flex items-center justify-between"
                      >
                        <div>
                          <p className="text-white font-semibold">{card.name}</p>
                          <p className="text-gray-400 text-xs">{card.type}</p>
                        </div>
                        <Badge className="bg-yellow-500 text-black text-xs">{card.elixirCost}</Badge>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {!showDropdown && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {filteredCards.slice(0, 12).map((card) => (
                    <button
                      key={card.id}
                      onClick={() => handleAddCard(card)}
                      onMouseEnter={() => setPreviewCard(card)}
                      className="text-left p-3 bg-slate-600 hover:bg-slate-500 rounded transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-semibold">{card.name}</p>
                          <p className="text-gray-400 text-sm">{card.type}</p>
                        </div>
                        <Badge className="bg-yellow-500 text-black">{card.elixirCost}</Badge>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </Card>

            {/* Suggestions */}
            {suggestedCards.length > 0 && (
              <Card className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-blue-400" />
                  Sugestões de Balanceamento
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {suggestedCards.map((card) => (
                    <button
                      key={card.id}
                      onClick={() => handleSuggestedCard(card)}
                      className="text-left p-3 bg-blue-600/50 hover:bg-blue-600 rounded transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-semibold">{card.name}</p>
                          <p className="text-gray-300 text-sm">{card.type}</p>
                        </div>
                        <Badge className="bg-yellow-500 text-black">{card.elixirCost}</Badge>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right: Deck Preview */}
          <div className="space-y-6">
            {/* Deck Stats */}
            <Card className="bg-gradient-to-br from-slate-700 to-slate-800 border-purple-600 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Estatísticas do Deck</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Cartas:</span>
                  <span className="text-2xl font-bold text-yellow-400">{selectedCards.length}/8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Elixir Médio:
                  </span>
                  <span className="text-2xl font-bold text-orange-400">{averageElixir}</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all"
                    style={{ width: `${(selectedCards.length / 8) * 100}%` }}
                  />
                </div>
              </div>
            </Card>

            {/* Balance Suggestions */}
            {balanceSuggestions.length > 0 && (
              <Card className="bg-slate-700 border-purple-600 p-6">
                <h2 className="text-lg font-bold text-white mb-4">Sugestões</h2>
                <div className="space-y-3">
                  {balanceSuggestions.map((suggestion, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded ${
                        suggestion.type === "success"
                          ? "bg-green-500/20 border border-green-400/30"
                          : "bg-yellow-500/20 border border-yellow-400/30"
                      }`}
                    >
                      <p
                        className={
                          suggestion.type === "success" ? "text-green-300" : "text-yellow-300"
                        }
                      >
                        {suggestion.message}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Card Preview */}
            {previewCard && (
              <Card className="bg-gradient-to-br from-slate-700 to-slate-800 border-yellow-600 p-6">
                <h2 className="text-lg font-bold text-white mb-4">Preview da Carta</h2>
                <div className="space-y-4">
                  {previewCard.imageUrl && (
                    <div className="w-full h-64 bg-slate-600 rounded overflow-hidden">
                      <img
                        src={previewCard.imageUrl}
                        alt={previewCard.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="text-2xl font-bold text-white">{previewCard.name}</h3>
                    <p className="text-gray-400 text-sm mt-1">{previewCard.type}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-xs">Custo de Elixir</p>
                      <p className="text-2xl font-bold text-yellow-400">{previewCard.elixirCost}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Raridade</p>
                      <p className="text-lg font-semibold text-purple-300">{previewCard.rarity}</p>
                    </div>
                  </div>
                  {previewCard.damage && (
                    <div>
                      <p className="text-gray-400 text-xs">Dano</p>
                      <p className="text-lg font-semibold text-red-400">{previewCard.damage}</p>
                    </div>
                  )}
                  {previewCard.hitPoints && (
                    <div>
                      <p className="text-gray-400 text-xs">Vida</p>
                      <p className="text-lg font-semibold text-green-400">{previewCard.hitPoints}</p>
                    </div>
                  )}
                  <p className="text-gray-300 text-sm">{previewCard.description}</p>
                </div>
              </Card>
            )}

            {/* Selected Cards */}
            <Card className="bg-slate-700 border-purple-600 p-6">
              <h2 className="text-lg font-bold text-white mb-4">Cartas Selecionadas ({selectedCards.length}/8)</h2>
              {selectedCards.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Nenhuma carta selecionada</p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {selectedCards.map((card) => (
                    <div
                      key={card.id}
                      className="bg-slate-600 rounded overflow-hidden hover:border-yellow-400 border-2 border-transparent transition-colors cursor-pointer group"
                      onMouseEnter={() => setPreviewCard(card)}
                    >
                      {card.imageUrl && (
                        <div className="w-full h-32 bg-slate-500 overflow-hidden">
                          <img
                            src={card.imageUrl}
                            alt={card.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          />
                        </div>
                      )}
                      <div className="p-2">
                        <p className="text-white font-semibold text-xs truncate">{card.name}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-gray-400 text-xs">{card.type}</p>
                          <Badge className="bg-yellow-500 text-black text-xs">{card.elixirCost}</Badge>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveCard(card.id)}
                        className="w-full bg-red-600/80 hover:bg-red-600 text-white py-1 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={() => setShowShareModal(true)}
                disabled={selectedCards.length === 0}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold hover:from-blue-400 hover:to-cyan-500"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar Deck
              </Button>
              <Button
                onClick={handleSaveDeck}
                disabled={selectedCards.length !== 8 || isSaving}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold hover:from-green-400 hover:to-emerald-500"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Salvando..." : "Salvar Deck"}
              </Button>
              <Button
                onClick={handleClearDeck}
                variant="outline"
                className="w-full border-red-400 text-red-400 hover:bg-red-400 hover:text-black"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Limpar Deck
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-slate-800 border-purple-600 max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Compartilhar Deck</h2>
            
            <div className="space-y-4">
              <div>
                <Label className="text-white mb-2 block">Codigo do Deck</Label>
                <div className="flex gap-2">
                  <Input
                    value={generateShareCode()}
                    readOnly
                    className="bg-slate-700 border-purple-600 text-white font-mono text-sm"
                  />
                  <Button
                    onClick={() => copyToClipboard(generateShareCode(), "code")}
                    className="bg-purple-600 hover:bg-purple-500 text-white"
                  >
                    {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-gray-400 text-xs mt-1">Compartilhe este codigo</p>
              </div>

              <div>
                <Label className="text-white mb-2 block">Link Compartilhavel</Label>
                <div className="flex gap-2">
                  <Input
                    value={generateShareUrl()}
                    readOnly
                    className="bg-slate-700 border-purple-600 text-white text-xs"
                  />
                  <Button
                    onClick={() => copyToClipboard(generateShareUrl(), "link")}
                    className="bg-purple-600 hover:bg-purple-500 text-white"
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-gray-400 text-xs mt-1">Compartilhe este link</p>
              </div>
            </div>

            <Button
              onClick={() => setShowShareModal(false)}
              className="w-full mt-6 bg-slate-700 hover:bg-slate-600 text-white"
            >
              Fechar
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
