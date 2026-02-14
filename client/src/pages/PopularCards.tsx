import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Zap, Target, Crown } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#fbbf24", "#f97316", "#ec4899", "#a855f7", "#3b82f6", "#06b6d4", "#10b981", "#f59e0b"];

export default function PopularCards() {
  const [selectedTab, setSelectedTab] = useState("overview");

  // Fetch popular cards
  const { data: popularCardsData = [] } = trpc.cards.getPopular.useQuery({ limit: 15 });

  // Transform data for charts
  const chartData = popularCardsData.map((item, idx) => ({
    name: item.card.name,
    usage: item.stats?.usageCount || 0,
    winRate: item.stats?.winRate || 0,
    pickRate: item.stats?.pickRate || 0,
    color: COLORS[idx % COLORS.length],
  }));

  const topUsedCards = chartData.slice(0, 10);
  const typeDistribution = [
    { name: "Tropas", value: popularCardsData.filter(c => c.card.type === "Troop").length },
    { name: "Feitiços", value: popularCardsData.filter(c => c.card.type === "Spell").length },
    { name: "Prédios", value: popularCardsData.filter(c => c.card.type === "Building").length },
  ].filter(d => d.value > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-purple-800 border-b border-purple-600 px-6 py-4 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-yellow-400" />
            Cartas Mais Populares
          </h1>
          <p className="text-gray-400 mt-2">Análise de uso e estatísticas das cartas do Clash Royale</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-slate-700 to-slate-800 border-purple-600 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total de Cartas</p>
                <p className="text-3xl font-bold text-white">{popularCardsData.length}</p>
              </div>
              <Zap className="w-8 h-8 text-yellow-400 opacity-50" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-slate-700 to-slate-800 border-purple-600 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Uso Total</p>
                <p className="text-3xl font-bold text-white">
                  {chartData.reduce((sum, card) => sum + card.usage, 0).toLocaleString()}
                </p>
              </div>
              <Target className="w-8 h-8 text-orange-400 opacity-50" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-slate-700 to-slate-800 border-purple-600 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Carta Mais Popular</p>
                <p className="text-2xl font-bold text-white">
                  {topUsedCards[0]?.name || "N/A"}
                </p>
              </div>
              <Crown className="w-8 h-8 text-yellow-400 opacity-50" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-700 border border-purple-600">
            <TabsTrigger value="overview" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="distribution" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
              Distribuição
            </TabsTrigger>
            <TabsTrigger value="ranking" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
              Ranking
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <Card className="bg-slate-700 border-purple-600 p-6">
              <h3 className="text-lg font-bold text-white mb-6">Uso de Cartas (Top 10)</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={topUsedCards}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                  <XAxis dataKey="name" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #9333ea",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Bar dataKey="usage" fill="#fbbf24" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          {/* Distribution Tab */}
          <TabsContent value="distribution" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-700 border-purple-600 p-6">
                <h3 className="text-lg font-bold text-white mb-6">Distribuição por Tipo</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={typeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {typeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #9333ea",
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "#fff" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              <Card className="bg-slate-700 border-purple-600 p-6">
                <h3 className="text-lg font-bold text-white mb-6">Estatísticas por Tipo</h3>
                <div className="space-y-4">
                  {typeDistribution.map((type, idx) => (
                    <div key={type.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                        />
                        <span className="text-gray-300">{type.name}</span>
                      </div>
                      <span className="text-white font-bold">{type.value} cartas</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Ranking Tab */}
          <TabsContent value="ranking" className="mt-6">
            <Card className="bg-slate-700 border-purple-600 p-6">
              <h3 className="text-lg font-bold text-white mb-6">Top 15 Cartas Mais Populares</h3>
              <div className="space-y-3">
                {popularCardsData.map((item, idx) => (
                  <div
                    key={item.card.id}
                    className="flex items-center justify-between bg-slate-600 rounded-lg p-4 hover:bg-slate-500 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-8 h-8 rounded-full bg-yellow-500 text-black font-bold flex items-center justify-center">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold">{item.card.name}</p>
                        <p className="text-gray-400 text-sm">{item.card.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-gray-400 text-xs">Uso</p>
                        <p className="text-yellow-400 font-bold text-lg">
                          {item.stats?.usageCount || 0}
                        </p>
                      </div>
                      {item.stats?.winRate ? (
                        <div className="text-right">
                          <p className="text-gray-400 text-xs">Win Rate</p>
                          <p className="text-green-400 font-bold text-lg">
                            {item.stats.winRate}%
                          </p>
                        </div>
                      ) : null}
                      {item.stats?.pickRate ? (
                        <div className="text-right">
                          <p className="text-gray-400 text-xs">Pick Rate</p>
                          <p className="text-blue-400 font-bold text-lg">
                            {item.stats.pickRate}%
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Info Box */}
        <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-lg p-6 mt-8">
          <p className="text-gray-300">
            <span className="font-semibold text-yellow-400">Nota:</span> Os dados de popularidade são baseados no uso dentro do chatbot. Quanto mais vezes uma carta é mencionada ou consultada, maior sua pontuação de popularidade.
          </p>
        </Card>
      </div>
    </div>
  );
}
