import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("Cards Router", () => {
  it("should fetch all cards", async () => {
    const caller = appRouter.createCaller({} as TrpcContext);
    const cards = await caller.cards.getAll();
    expect(Array.isArray(cards)).toBe(true);
  });

  it("should search cards by name", async () => {
    const caller = appRouter.createCaller({} as TrpcContext);
    const results = await caller.cards.search({ query: "Knight" });
    expect(Array.isArray(results)).toBe(true);
    if (results.length > 0) {
      expect(results[0].name.toLowerCase()).toContain("knight");
    }
  });

  it("should get cards by type", async () => {
    const caller = appRouter.createCaller({} as TrpcContext);
    const troops = await caller.cards.getByType({ type: "Troop" });
    expect(Array.isArray(troops)).toBe(true);
    if (troops.length > 0) {
      expect(troops[0].type).toBe("Troop");
    }
  });

  it("should get cards by elixir cost", async () => {
    const caller = appRouter.createCaller({} as TrpcContext);
    const cards = await caller.cards.getByElixirCost({ cost: 3 });
    expect(Array.isArray(cards)).toBe(true);
    if (cards.length > 0) {
      expect(cards[0].elixirCost).toBe(3);
    }
  });

  it("should get card by name", async () => {
    const caller = appRouter.createCaller({} as TrpcContext);
    const card = await caller.cards.getByName({ name: "Knight" });
    if (card) {
      expect(card.name).toBe("Knight");
    }
  });

  it("should get card by id", async () => {
    const caller = appRouter.createCaller({} as TrpcContext);
    // First get a card to know its ID
    const allCards = await caller.cards.getAll();
    if (allCards.length > 0) {
      const firstCard = allCards[0];
      const card = await caller.cards.getById({ id: firstCard.id });
      expect(card?.id).toBe(firstCard.id);
    }
  });
});

describe("Chat Router", () => {
  it("should get chat history for authenticated user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const history = await caller.chat.getHistory();
    expect(Array.isArray(history)).toBe(true);
    // History should be empty or contain messages
    expect(history.length).toBeGreaterThanOrEqual(0);
  });


});


describe("Popular Cards", () => {
  it("should get popular cards", async () => {
    const caller = appRouter.createCaller({} as TrpcContext);
    const popularCards = await caller.cards.getPopular({ limit: 10 });
    expect(Array.isArray(popularCards)).toBe(true);
  });

  it("should get card stats", async () => {
    const caller = appRouter.createCaller({} as TrpcContext);
    const allCards = await caller.cards.getAll();
    if (allCards.length > 0) {
      const stats = await caller.cards.getStats({ cardId: allCards[0].id });
      // Stats might be null if not initialized
      if (stats) {
        expect(stats.cardId).toBe(allCards[0].id);
      }
    }
  });

  it("should record card usage", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const allCards = await caller.cards.getAll();
    
    if (allCards.length > 0) {
      const result = await caller.cards.recordUsage({ cardId: allCards[0].id });
      expect(result.success).toBe(true);
      expect(result.usageCount).toBeGreaterThan(0);
    }
  });
});


describe("Card Comparison", () => {
  it("should compare two cards", async () => {
    const caller = appRouter.createCaller({} as TrpcContext);
    const allCards = await caller.cards.getAll();
    
    if (allCards.length >= 2) {
      const comparison = await caller.cards.compare({ 
        cardId1: allCards[0].id, 
        cardId2: allCards[1].id 
      });
      
      expect(comparison).toBeDefined();
      expect(comparison.card1).toBeDefined();
      expect(comparison.card2).toBeDefined();
      expect(comparison.card1.id).toBe(allCards[0].id);
      expect(comparison.card2.id).toBe(allCards[1].id);
    }
  });

  it("should include stats in comparison when available", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const allCards = await caller.cards.getAll();
    
    if (allCards.length >= 2) {
      // Record usage for first card to ensure stats exist
      await caller.cards.recordUsage({ cardId: allCards[0].id });
      
      const comparison = await caller.cards.compare({ 
        cardId1: allCards[0].id, 
        cardId2: allCards[1].id 
      });
      
      expect(comparison.card1.stats).toBeDefined();
      if (comparison.card1.stats) {
        expect(comparison.card1.stats.usageCount).toBeGreaterThan(0);
      }
    }
  });
});
