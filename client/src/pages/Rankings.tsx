import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, TrendingUp, Crown, Star, Award } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Rankings() {
  const { data: topClans = [], isLoading: clansLoading } = trpc.rankings.getTopClans.useQuery({ limit: 50 });
  const { data: topPlayers = [], isLoading: playersLoading } = trpc.rankings.getTopPlayers.useQuery({ limit: 50 });

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Award className="w-6 h-6 text-gray-300" />;
    if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />;
    return <span className="text-gray-400 font-bold">#{rank}</span>;
  };

  const getTrophyColor = (trophies: number) => {
    if (trophies >= 5000) return "text-purple-400";
    if (trophies >= 4000) return "text-blue-400";
    if (trophies >= 3000) return "text-green-400";
    return "text-gray-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-purple-800 border-b border-purple-600 px-6 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-400" />
            Rankings Globais
          </h1>
          <p className="text-gray-400 mt-2">Veja os melhores clãs e jogadores do Clash Royale</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="clans" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800 border border-purple-600">
            <TabsTrigger value="clans" className="data-[state=active]:bg-purple-600">
              <Users className="w-4 h-4 mr-2" />
              Top Clãs
            </TabsTrigger>
            <TabsTrigger value="players" className="data-[state=active]:bg-purple-600">
              <Star className="w-4 h-4 mr-2" />
              Top Jogadores
            </TabsTrigger>
          </TabsList>

          {/* Clans Tab */}
          <TabsContent value="clans" className="mt-6">
            {clansLoading ? (
              <div className="text-center text-white py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                <p className="mt-4">Carregando rankings...</p>
              </div>
            ) : topClans.length === 0 ? (
              <Card className="bg-slate-800 border-purple-600 p-12 text-center">
                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Nenhum clã encontrado no ranking</p>
                <p className="text-gray-500 text-sm mt-2">Os clãs aparecerão aqui quando forem adicionados</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {topClans.map((clan, index) => (
                  <Card key={clan.id} className="bg-slate-800 border-purple-600 p-4 hover:bg-slate-700 transition-colors">
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div className="flex-shrink-0 w-12 flex items-center justify-center">
                        {getRankIcon(index + 1)}
                      </div>

                      {/* Clan Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-white truncate">{clan.name}</h3>
                        <p className="text-sm text-gray-400">{clan.tag}</p>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className={`flex items-center gap-1 ${getTrophyColor(clan.trophies)}`}>
                            <Trophy className="w-5 h-5" />
                            <span className="font-bold text-lg">{clan.trophies.toLocaleString()}</span>
                          </div>
                          <p className="text-xs text-gray-500">Troféus</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-blue-400">
                            <Users className="w-5 h-5" />
                            <span className="font-bold text-lg">{clan.memberCount}/50</span>
                          </div>
                          <p className="text-xs text-gray-500">Membros</p>
                        </div>
                        {clan.region && (
                          <Badge variant="outline" className="border-purple-500 text-purple-300">
                            {clan.region}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {clan.description && (
                      <p className="text-gray-400 text-sm mt-3 ml-16">{clan.description}</p>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Players Tab */}
          <TabsContent value="players" className="mt-6">
            {playersLoading ? (
              <div className="text-center text-white py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                <p className="mt-4">Carregando rankings...</p>
              </div>
            ) : topPlayers.length === 0 ? (
              <Card className="bg-slate-800 border-purple-600 p-12 text-center">
                <Star className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Nenhum jogador encontrado no ranking</p>
                <p className="text-gray-500 text-sm mt-2">Os jogadores aparecerão aqui quando forem adicionados</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {topPlayers.map((player, index) => (
                  <Card key={player.id} className="bg-slate-800 border-purple-600 p-4 hover:bg-slate-700 transition-colors">
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div className="flex-shrink-0 w-12 flex items-center justify-center">
                        {getRankIcon(index + 1)}
                      </div>

                      {/* Player Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-white truncate">{player.name}</h3>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-400">{player.tag}</p>
                          {player.arena && (
                            <Badge variant="outline" className="border-blue-500 text-blue-300 text-xs">
                              {player.arena}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className={`flex items-center gap-1 ${getTrophyColor(player.trophies)}`}>
                            <Trophy className="w-5 h-5" />
                            <span className="font-bold text-lg">{player.trophies.toLocaleString()}</span>
                          </div>
                          <p className="text-xs text-gray-500">Troféus</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-yellow-400">
                            <TrendingUp className="w-5 h-5" />
                            <span className="font-bold text-lg">{player.bestTrophies.toLocaleString()}</span>
                          </div>
                          <p className="text-xs text-gray-500">Melhor</p>
                        </div>
                        <div className="text-center">
                          <Badge className="bg-purple-600 text-white">
                            Nível {player.level}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Win/Loss Stats */}
                    <div className="flex items-center gap-4 mt-3 ml-16">
                      <div className="text-sm">
                        <span className="text-green-400 font-bold">{player.wins}V</span>
                        <span className="text-gray-500"> / </span>
                        <span className="text-red-400 font-bold">{player.losses}D</span>
                      </div>
                      <div className="text-sm text-gray-400">
                        Taxa de vitória: <span className="text-white font-bold">
                          {player.wins + player.losses > 0 
                            ? ((player.wins / (player.wins + player.losses)) * 100).toFixed(1)
                            : 0}%
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
