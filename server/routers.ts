import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getAllCards, getCardById, getCardByName, searchCards, getCardsByType, getCardsByElixirCost, saveChatMessage, getChatHistory, getPopularCards, getCardStats, updateCardStats, createDeck, getUserDecks, getDeckById, updateDeck, deleteDeck, getPublicDecks, getTopClans, getClanByTag, createClan, getTopPlayers, getPlayerByTag, createPlayer, getPlayersByClan } from "./db";
import { invokeLLM } from "./_core/llm";
import { notifyOwner } from "./_core/notification";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  cards: router({
    getAll: publicProcedure.query(async () => {
      return await getAllCards();
    }),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return await getCardById(input.id);
    }),
    getByName: publicProcedure.input(z.object({ name: z.string() })).query(async ({ input }) => {
      return await getCardByName(input.name);
    }),
    search: publicProcedure.input(z.object({ query: z.string() })).query(async ({ input }) => {
      return await searchCards(input.query);
    }),
    getByType: publicProcedure.input(z.object({ type: z.string() })).query(async ({ input }) => {
      return await getCardsByType(input.type);
    }),
    getByElixirCost: publicProcedure.input(z.object({ cost: z.number() })).query(async ({ input }) => {
      return await getCardsByElixirCost(input.cost);
    }),
    getPopular: publicProcedure.input(z.object({ limit: z.number().default(10) })).query(async ({ input }) => {
      return await getPopularCards(input.limit);
    }),
    getStats: publicProcedure.input(z.object({ cardId: z.number() })).query(async ({ input }) => {
      return await getCardStats(input.cardId);
    }),
    recordUsage: protectedProcedure.input(z.object({ cardId: z.number() })).mutation(async ({ input }) => {
      const stats = await getCardStats(input.cardId);
      const newUsageCount = (stats?.usageCount || 0) + 1;
      await updateCardStats(input.cardId, { usageCount: newUsageCount });
      return { success: true, usageCount: newUsageCount };
    }),
    compare: publicProcedure.input(z.object({ cardId1: z.number(), cardId2: z.number() })).query(async ({ input }) => {
      const card1 = await getCardById(input.cardId1);
      const card2 = await getCardById(input.cardId2);
      const stats1 = await getCardStats(input.cardId1);
      const stats2 = await getCardStats(input.cardId2);
      
      return {
        card1: { ...card1, stats: stats1 },
        card2: { ...card2, stats: stats2 },
      };
    }),
  }),

  decks: router({
    create: protectedProcedure.input(z.object({ name: z.string(), description: z.string().optional(), cardIds: z.array(z.number()).length(8), averageElixir: z.number(), isPublic: z.boolean().optional() })).mutation(async ({ ctx, input }) => {
      return await createDeck({
        userId: ctx.user.id,
        name: input.name,
        description: input.description,
        cardIds: JSON.stringify(input.cardIds),
        averageElixir: input.averageElixir,
        isPublic: input.isPublic || false,
      });
    }),
    getUserDecks: protectedProcedure.query(async ({ ctx }) => {
      const userDecks = await getUserDecks(ctx.user.id);
      return userDecks.map(d => ({ ...d, cardIds: JSON.parse(d.cardIds) }));
    }),
    getById: publicProcedure.input(z.object({ deckId: z.number() })).query(async ({ input }) => {
      const deck = await getDeckById(input.deckId);
      if (deck) {
        return { ...deck, cardIds: JSON.parse(deck.cardIds) };
      }
      return null;
    }),
    update: protectedProcedure.input(z.object({ deckId: z.number(), name: z.string().optional(), description: z.string().optional(), cardIds: z.array(z.number()).length(8).optional(), averageElixir: z.number().optional(), isPublic: z.boolean().optional() })).mutation(async ({ ctx, input }) => {
      const deck = await getDeckById(input.deckId);
      if (!deck || deck.userId !== ctx.user.id) throw new Error("Unauthorized");
      return await updateDeck(input.deckId, { name: input.name, description: input.description, cardIds: input.cardIds ? JSON.stringify(input.cardIds) : undefined, averageElixir: input.averageElixir, isPublic: input.isPublic });
    }),
    delete: protectedProcedure.input(z.object({ deckId: z.number() })).mutation(async ({ ctx, input }) => {
      const deck = await getDeckById(input.deckId);
      if (!deck || deck.userId !== ctx.user.id) throw new Error("Unauthorized");
      return await deleteDeck(input.deckId);
    }),
    getPublic: publicProcedure.input(z.object({ limit: z.number().default(20) })).query(async ({ input }) => {
      const publicDecks = await getPublicDecks(input.limit);
      return publicDecks.map(d => ({ ...d, cardIds: JSON.parse(d.cardIds) }));
    }),
  }),

  rankings: router({
    getTopClans: publicProcedure.input(z.object({ limit: z.number().optional() })).query(async ({ input }) => {
      return await getTopClans(input.limit || 50);
    }),
    getClanByTag: publicProcedure.input(z.object({ tag: z.string() })).query(async ({ input }) => {
      return await getClanByTag(input.tag);
    }),
    getTopPlayers: publicProcedure.input(z.object({ limit: z.number().optional() })).query(async ({ input }) => {
      return await getTopPlayers(input.limit || 50);
    }),
    getPlayerByTag: publicProcedure.input(z.object({ tag: z.string() })).query(async ({ input }) => {
      return await getPlayerByTag(input.tag);
    }),
    getPlayersByClan: publicProcedure.input(z.object({ clanId: z.number() })).query(async ({ input }) => {
      return await getPlayersByClan(input.clanId);
    }),
  }),

  chat: router({
    sendMessage: protectedProcedure.input(z.object({ message: z.string() })).mutation(async ({ ctx, input }) => {
      // Save user message
      await saveChatMessage({
        userId: ctx.user.id,
        role: "user",
        content: input.message,
      });

      // Get chat history for context
      const history = await getChatHistory(ctx.user.id, 20);
      const allCards = await getAllCards();

      // Format cards data for LLM context
      const cardsContext = allCards
        .map((card) => `${card.name} (${card.type}, ${card.elixirCost} elixir): ${card.description}`)
        .join("\n");

      // Build messages for LLM
      const messages = [
        {
          role: "system" as const,
          content: `Você é um especialista em análise de cartas do Clash Royale. Você fornece informações detalhadas e úteis sobre cartas do Clash Royale, suas estratégias, sinergias e mecânicas de jogo. Responda sempre em português brasileiro. Aqui está o banco de dados de cartas disponíveis:\n\n${cardsContext}`,
        },
        ...history.reverse().map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
        { role: "user" as const, content: input.message },
      ];

      // Call LLM
      const response = await invokeLLM({ messages });
      const messageContent = response.choices[0]?.message?.content;
      const assistantMessage = typeof messageContent === 'string' ? messageContent : "Desculpe, não consegui processar sua pergunta.";

      // Save assistant message
      if (assistantMessage) {
        await saveChatMessage({
          userId: ctx.user.id,
          role: "assistant",
          content: assistantMessage,
        });
      }

      // Check if user is asking about a card not in database
      const cardMentioned = input.message.toLowerCase();
      const hasUnknownCard = !allCards.some((card) => cardMentioned.includes(card.name.toLowerCase()));
      if (hasUnknownCard && (cardMentioned.includes("carta") || cardMentioned.includes("card"))) {
        try {
          await notifyOwner({
            title: "Nova pergunta sobre carta desconhecida",
            content: `Usuário perguntou sobre: "${input.message}"`,
          });
        } catch (error) {
          console.warn("Failed to send notification:", error);
        }
      }

      return { message: assistantMessage };
    }),
    getHistory: protectedProcedure.query(async ({ ctx }) => {
      return await getChatHistory(ctx.user.id, 100);
    }),
  }),
});

export type AppRouter = typeof appRouter;
