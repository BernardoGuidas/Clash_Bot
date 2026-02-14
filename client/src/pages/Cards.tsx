import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Filter, Zap } from "lucide-react";
import { trpc } from "@/lib/trpc";

type CardType = "Troop" | "Spell" | "Building" | "Tower Troop";
type Rarity = "Common" | "Rare" | "Epic" | "Legendary" | "Champion";

export default function Cards() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<CardType | null>(null);
  const [selectedElixir, setSelectedElixir] = useState<number | null>(null);
  const [selectedRarity, setSelectedRarity] = useState<Rarity | null>(null);

  // Fetch all cards
  const { data: allCards = [] } = trpc.cards.getAll.useQuery();

  // Filter cards based on selected filters
  const filteredCards = useMemo(() => {
    return allCards.filter((card) => {
      const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = !selectedType || card.type === selectedType;
      const matchesElixir = !selectedElixir || card.elixirCost === selectedElixir;
      const matchesRarity = !selectedRarity || card.rarity === selectedRarity;

      return matchesSearch && matchesType && matchesElixir && matchesRarity;
    });
  }, [allCards, searchQuery, selectedType, selectedElixir, selectedRarity]);

  const cardTypes: CardType[] = ["Troop", "Spell", "Building", "Tower Troop"];
  const rarities: Rarity[] = ["Common", "Rare", "Epic", "Legendary", "Champion"];
  const elixirCosts = [1, 2, 3, 4, 5, 6, 7, 8];

  const getRarityColor = (rarity: Rarity) => {
    switch (rarity) {
      case "Common":
        return "bg-gray-500";
      case "Rare":
        return "bg-orange-500";
      case "Epic":
        return "bg-purple-500";
      case "Legendary":
        return "bg-yellow-500";
      case "Champion":
        return "bg-pink-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-purple-800 border-b border-purple-600 px-6 py-4 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Zap className="w-8 h-8 text-yellow-400" />
            Cartas do Clash Royale
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Buscar cartas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-700 border-purple-600 text-white placeholder-gray-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-700 border border-purple-600 rounded-lg p-6 sticky top-4">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Filter className="w-5 h-5 text-yellow-400" />
                Filtros
              </h2>

              {/* Type Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Tipo</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedType(null)}
                    className={`w-full text-left px-3 py-2 rounded transition-colors ${
                      selectedType === null
                        ? "bg-yellow-500 text-black font-semibold"
                        : "bg-slate-600 text-gray-300 hover:bg-slate-500"
                    }`}
                  >
                    Todos
                  </button>
                  {cardTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`w-full text-left px-3 py-2 rounded transition-colors ${
                        selectedType === type
                          ? "bg-yellow-500 text-black font-semibold"
                          : "bg-slate-600 text-gray-300 hover:bg-slate-500"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Elixir Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Custo de Elixir</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedElixir(null)}
                    className={`px-2 py-2 rounded text-sm transition-colors ${
                      selectedElixir === null
                        ? "bg-yellow-500 text-black font-semibold"
                        : "bg-slate-600 text-gray-300 hover:bg-slate-500"
                    }`}
                  >
                    Todos
                  </button>
                  {elixirCosts.map((cost) => (
                    <button
                      key={cost}
                      onClick={() => setSelectedElixir(cost)}
                      className={`px-2 py-2 rounded text-sm transition-colors ${
                        selectedElixir === cost
                          ? "bg-yellow-500 text-black font-semibold"
                          : "bg-slate-600 text-gray-300 hover:bg-slate-500"
                      }`}
                    >
                      {cost}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rarity Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Raridade</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedRarity(null)}
                    className={`w-full text-left px-3 py-2 rounded transition-colors ${
                      selectedRarity === null
                        ? "bg-yellow-500 text-black font-semibold"
                        : "bg-slate-600 text-gray-300 hover:bg-slate-500"
                    }`}
                  >
                    Todas
                  </button>
                  {rarities.map((rarity) => (
                    <button
                      key={rarity}
                      onClick={() => setSelectedRarity(rarity)}
                      className={`w-full text-left px-3 py-2 rounded transition-colors ${
                        selectedRarity === rarity
                          ? "bg-yellow-500 text-black font-semibold"
                          : "bg-slate-600 text-gray-300 hover:bg-slate-500"
                      }`}
                    >
                      {rarity}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedType(null);
                  setSelectedElixir(null);
                  setSelectedRarity(null);
                }}
                variant="outline"
                className="w-full bg-slate-600 border-purple-600 text-gray-300 hover:bg-slate-500"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="lg:col-span-3">
            {filteredCards.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">Nenhuma carta encontrada</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCards.map((card) => (
                  <Card
                    key={card.id}
                    className="bg-gradient-to-br from-slate-700 to-slate-800 border-purple-600 hover:border-yellow-400 transition-all hover:shadow-lg hover:shadow-yellow-400/20 overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-white">{card.name}</h3>
                          <p className="text-sm text-gray-400">{card.type}</p>
                        </div>
                        <span className={`${getRarityColor(card.rarity as Rarity)} text-white text-xs font-bold px-2 py-1 rounded`}>
                          {card.rarity}
                        </span>
                      </div>

                      <p className="text-gray-300 text-sm mb-4">{card.description}</p>

                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="bg-slate-600 rounded p-2">
                          <p className="text-xs text-gray-400">Elixir</p>
                          <p className="text-lg font-bold text-yellow-400">{card.elixirCost}</p>
                        </div>
                        {card.hitPoints && (
                          <div className="bg-slate-600 rounded p-2">
                            <p className="text-xs text-gray-400">Vida</p>
                            <p className="text-lg font-bold text-green-400">{card.hitPoints}</p>
                          </div>
                        )}
                        {card.damage && (
                          <div className="bg-slate-600 rounded p-2">
                            <p className="text-xs text-gray-400">Dano</p>
                            <p className="text-lg font-bold text-red-400">{card.damage}</p>
                          </div>
                        )}
                        {card.speed && (
                          <div className="bg-slate-600 rounded p-2">
                            <p className="text-xs text-gray-400">Velocidade</p>
                            <p className="text-xs font-bold text-blue-400">{card.speed}</p>
                          </div>
                        )}
                      </div>

                      {card.range && (
                        <div className="bg-slate-600 rounded p-2">
                          <p className="text-xs text-gray-400">Alcance</p>
                          <p className="text-sm font-bold text-purple-400">{card.range}</p>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Results Count */}
            <div className="mt-8 text-center text-gray-400">
              <p>
                {filteredCards.length} de {allCards.length} cartas encontradas
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
