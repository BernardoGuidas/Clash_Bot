import { useState, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { GitCompare, ArrowRight, Zap, Heart, Swords, Target, TrendingUp, Download } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from "recharts";
import { toPng } from "html-to-image";
import { toast } from "sonner";

type CardType = "Troop" | "Spell" | "Building" | "Tower Troop";
type Rarity = "Common" | "Rare" | "Epic" | "Legendary" | "Champion";

export default function CompareCards() {
  const [selectedCard1, setSelectedCard1] = useState<number | null>(null);
  const [selectedCard2, setSelectedCard2] = useState<number | null>(null);
  const [searchQuery1, setSearchQuery1] = useState("");
  const [searchQuery2, setSearchQuery2] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const comparisonRef = useRef<HTMLDivElement>(null);

  // Fetch all cards
  const { data: allCards = [] } = trpc.cards.getAll.useQuery();

  // Filter cards for selection
  const filteredCards1 = useMemo(() => {
    return allCards.filter((card) =>
      card.name.toLowerCase().includes(searchQuery1.toLowerCase())
    );
  }, [allCards, searchQuery1]);

  const filteredCards2 = useMemo(() => {
    return allCards.filter((card) =>
      card.name.toLowerCase().includes(searchQuery2.toLowerCase())
    );
  }, [allCards, searchQuery2]);

  // Fetch comparison data
  const { data: comparisonData } = trpc.cards.compare.useQuery(
    { cardId1: selectedCard1!, cardId2: selectedCard2! },
    { enabled: !!selectedCard1 && !!selectedCard2 }
  );

  const card1 = comparisonData?.card1;
  const card2 = comparisonData?.card2;

  // Prepare radar chart data
  const radarData = useMemo(() => {
    if (!card1 || !card2) return [];

    return [
      {
        stat: "Elixir",
        carta1: card1.elixirCost || 0,
        carta2: card2.elixirCost || 0,
      },
      {
        stat: "Vida",
        carta1: (card1.hitPoints || 0) / 100,
        carta2: (card2.hitPoints || 0) / 100,
      },
      {
        stat: "Dano",
        carta1: (card1.damage || 0) / 10,
        carta2: (card2.damage || 0) / 10,
      },
      {
        stat: "Uso",
        carta1: (card1.stats?.usageCount || 0) / 10,
        carta2: (card2.stats?.usageCount || 0) / 10,
      },
    ];
  }, [card1, card2]);

  // Prepare bar chart data
  const barChartData = useMemo(() => {
    if (!card1 || !card2) return [];

    return [
      {
        name: "Elixir",
        carta1: card1.elixirCost || 0,
        carta2: card2.elixirCost || 0,
      },
      {
        name: "Vida",
        carta1: card1.hitPoints || 0,
        carta2: card2.hitPoints || 0,
      },
      {
        name: "Dano",
        carta1: card1.damage || 0,
        carta2: card2.damage || 0,
      },
      {
        name: "Uso",
        carta1: card1.stats?.usageCount || 0,
        carta2: card2.stats?.usageCount || 0,
      },
    ];
  }, [card1, card2]);

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

  const handleExportImage = async () => {
    if (!comparisonRef.current || !card1 || !card2) {
      toast.error("Selecione duas cartas para exportar a compara\u00e7\u00e3o");
      return;
    }

    setIsExporting(true);
    toast.info("Gerando imagem...");

    try {
      const dataUrl = await toPng(comparisonRef.current, {
        cacheBust: true,
        backgroundColor: "#0f172a",
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.download = `comparacao-${card1.name}-vs-${card2.name}.png`;
      link.href = dataUrl;
      link.click();

      toast.success("Imagem exportada com sucesso!");
    } catch (error) {
      console.error("Erro ao exportar imagem:", error);
      toast.error("Erro ao exportar imagem. Tente novamente.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-purple-800 border-b border-purple-600 px-6 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <GitCompare className="w-8 h-8 text-yellow-400" />
              Comparador de Cartas
            </h1>
            <p className="text-gray-400 mt-2">Compare estatísticas de duas cartas lado a lado</p>
          </div>
          {card1 && card2 && (
            <Button
              onClick={handleExportImage}
              disabled={isExporting}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold hover:from-green-400 hover:to-emerald-500 shadow-lg"
            >
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? "Exportando..." : "Exportar PNG"}
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Card Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Card 1 Selector */}
          <Card className="bg-slate-700 border-purple-600 p-6">
            <Label className="text-white mb-2 block">Primeira Carta</Label>
            <Input
              placeholder="Buscar carta..."
              value={searchQuery1}
              onChange={(e) => setSearchQuery1(e.target.value)}
              className="bg-slate-600 border-purple-600 text-white placeholder-gray-400 mb-4"
            />
            <div className="max-h-64 overflow-y-auto space-y-2">
              {filteredCards1.slice(0, 10).map((card) => (
                <button
                  key={card.id}
                  onClick={() => {
                    setSelectedCard1(card.id);
                    setSearchQuery1(card.name);
                  }}
                  className={`w-full text-left p-3 rounded transition-colors ${
                    selectedCard1 === card.id
                      ? "bg-yellow-500 text-black font-semibold"
                      : "bg-slate-600 text-gray-300 hover:bg-slate-500"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{card.name}</span>
                    <Badge className={`${getRarityColor(card.rarity as Rarity)} text-white text-xs`}>
                      {card.rarity}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Card 2 Selector */}
          <Card className="bg-slate-700 border-purple-600 p-6">
            <Label className="text-white mb-2 block">Segunda Carta</Label>
            <Input
              placeholder="Buscar carta..."
              value={searchQuery2}
              onChange={(e) => setSearchQuery2(e.target.value)}
              className="bg-slate-600 border-purple-600 text-white placeholder-gray-400 mb-4"
            />
            <div className="max-h-64 overflow-y-auto space-y-2">
              {filteredCards2.slice(0, 10).map((card) => (
                <button
                  key={card.id}
                  onClick={() => {
                    setSelectedCard2(card.id);
                    setSearchQuery2(card.name);
                  }}
                  className={`w-full text-left p-3 rounded transition-colors ${
                    selectedCard2 === card.id
                      ? "bg-yellow-500 text-black font-semibold"
                      : "bg-slate-600 text-gray-300 hover:bg-slate-500"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{card.name}</span>
                    <Badge className={`${getRarityColor(card.rarity as Rarity)} text-white text-xs`}>
                      {card.rarity}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Comparison Results */}
        {card1 && card2 ? (
          <div ref={comparisonRef} className="space-y-6">
            {/* Card Details Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1 Details */}
              <Card className="bg-gradient-to-br from-slate-700 to-slate-800 border-purple-600 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white">{card1.name}</h3>
                    <p className="text-gray-400">{card1.type}</p>
                  </div>
                  <Badge className={`${getRarityColor(card1.rarity as Rarity)} text-white`}>
                    {card1.rarity}
                  </Badge>
                </div>
                <p className="text-gray-300 mb-4">{card1.description}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-600 rounded p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <p className="text-xs text-gray-400">Elixir</p>
                    </div>
                    <p className="text-xl font-bold text-yellow-400">{card1.elixirCost}</p>
                  </div>
                  {card1.hitPoints && (
                    <div className="bg-slate-600 rounded p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Heart className="w-4 h-4 text-green-400" />
                        <p className="text-xs text-gray-400">Vida</p>
                      </div>
                      <p className="text-xl font-bold text-green-400">{card1.hitPoints}</p>
                    </div>
                  )}
                  {card1.damage && (
                    <div className="bg-slate-600 rounded p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Swords className="w-4 h-4 text-red-400" />
                        <p className="text-xs text-gray-400">Dano</p>
                      </div>
                      <p className="text-xl font-bold text-red-400">{card1.damage}</p>
                    </div>
                  )}
                  {card1.stats && (
                    <div className="bg-slate-600 rounded p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-blue-400" />
                        <p className="text-xs text-gray-400">Uso</p>
                      </div>
                      <p className="text-xl font-bold text-blue-400">{card1.stats.usageCount}</p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Card 2 Details */}
              <Card className="bg-gradient-to-br from-slate-700 to-slate-800 border-purple-600 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white">{card2.name}</h3>
                    <p className="text-gray-400">{card2.type}</p>
                  </div>
                  <Badge className={`${getRarityColor(card2.rarity as Rarity)} text-white`}>
                    {card2.rarity}
                  </Badge>
                </div>
                <p className="text-gray-300 mb-4">{card2.description}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-600 rounded p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <p className="text-xs text-gray-400">Elixir</p>
                    </div>
                    <p className="text-xl font-bold text-yellow-400">{card2.elixirCost}</p>
                  </div>
                  {card2.hitPoints && (
                    <div className="bg-slate-600 rounded p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Heart className="w-4 h-4 text-green-400" />
                        <p className="text-xs text-gray-400">Vida</p>
                      </div>
                      <p className="text-xl font-bold text-green-400">{card2.hitPoints}</p>
                    </div>
                  )}
                  {card2.damage && (
                    <div className="bg-slate-600 rounded p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Swords className="w-4 h-4 text-red-400" />
                        <p className="text-xs text-gray-400">Dano</p>
                      </div>
                      <p className="text-xl font-bold text-red-400">{card2.damage}</p>
                    </div>
                  )}
                  {card2.stats && (
                    <div className="bg-slate-600 rounded p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-blue-400" />
                        <p className="text-xs text-gray-400">Uso</p>
                      </div>
                      <p className="text-xl font-bold text-blue-400">{card2.stats.usageCount}</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bar Chart */}
              <Card className="bg-slate-700 border-purple-600 p-6">
                <h3 className="text-lg font-bold text-white mb-6">Comparação de Estatísticas</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #9333ea",
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Legend />
                    <Bar dataKey="carta1" fill="#fbbf24" name={card1.name} />
                    <Bar dataKey="carta2" fill="#f97316" name={card2.name} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Radar Chart */}
              <Card className="bg-slate-700 border-purple-600 p-6">
                <h3 className="text-lg font-bold text-white mb-6">Análise Radar</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#4b5563" />
                    <PolarAngleAxis dataKey="stat" stroke="#9ca3af" />
                    <PolarRadiusAxis stroke="#9ca3af" />
                    <Radar name={card1.name} dataKey="carta1" stroke="#fbbf24" fill="#fbbf24" fillOpacity={0.6} />
                    <Radar name={card2.name} dataKey="carta2" stroke="#f97316" fill="#f97316" fillOpacity={0.6} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Analysis */}
            <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">Análise Comparativa</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Custo-Benefício</p>
                  <p className="text-white font-semibold">
                    {(card1.elixirCost || 0) < (card2.elixirCost || 0)
                      ? `${card1.name} é mais barato`
                      : (card1.elixirCost || 0) > (card2.elixirCost || 0)
                      ? `${card2.name} é mais barato`
                      : "Mesmo custo"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Resistência</p>
                  <p className="text-white font-semibold">
                    {(card1.hitPoints || 0) > (card2.hitPoints || 0)
                      ? `${card1.name} tem mais vida`
                      : (card1.hitPoints || 0) < (card2.hitPoints || 0)
                      ? `${card2.name} tem mais vida`
                      : "Mesma vida"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Popularidade</p>
                  <p className="text-white font-semibold">
                    {(card1.stats?.usageCount || 0) > (card2.stats?.usageCount || 0)
                      ? `${card1.name} é mais usado`
                      : (card1.stats?.usageCount || 0) < (card2.stats?.usageCount || 0)
                      ? `${card2.name} é mais usado`
                      : "Mesmo uso"}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <Card className="bg-slate-700 border-purple-600 p-12 text-center">
            <GitCompare className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Selecione duas cartas para comparar</p>
          </Card>
        )}
      </div>
    </div>
  );
}
