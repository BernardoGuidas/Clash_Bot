import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, cards, chatMessages, cardStats, decks, deckLikes, Card, InsertCard, ChatMessage, InsertChatMessage, CardStats, InsertCardStats, Deck, InsertDeck, clans, players, Clan, InsertClan, Player, InsertPlayer } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getAllCards() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get cards: database not available");
    return [];
  }

  try {
    return await db.select().from(cards);
  } catch (error) {
    console.error("[Database] Failed to get cards:", error);
    throw error;
  }
}

export async function getCardById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get card: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(cards).where(eq(cards.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get card:", error);
    throw error;
  }
}

export async function getCardByName(name: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get card: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(cards).where(eq(cards.name, name)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get card:", error);
    throw error;
  }
}

export async function searchCards(query: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot search cards: database not available");
    return [];
  }

  try {
    const { like } = await import("drizzle-orm");
    return await db.select().from(cards).where(like(cards.name, `%${query}%`));
  } catch (error) {
    console.error("[Database] Failed to search cards:", error);
    throw error;
  }
}

export async function getCardsByType(type: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get cards by type: database not available");
    return [];
  }

  try {
    return await db.select().from(cards).where(eq(cards.type, type));
  } catch (error) {
    console.error("[Database] Failed to get cards by type:", error);
    throw error;
  }
}

export async function getCardsByElixirCost(cost: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get cards by elixir cost: database not available");
    return [];
  }

  try {
    return await db.select().from(cards).where(eq(cards.elixirCost, cost));
  } catch (error) {
    console.error("[Database] Failed to get cards by elixir cost:", error);
    throw error;
  }
}

export async function saveChatMessage(message: InsertChatMessage): Promise<any> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot save chat message: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(chatMessages).values(message);
    return result;
  } catch (error) {
    console.error("[Database] Failed to save chat message:", error);
    throw error;
  }
}

export async function getChatHistory(userId: number, limit: number = 50): Promise<ChatMessage[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get chat history: database not available");
    return [];
  }

  try {
    const { desc } = await import("drizzle-orm");
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.userId, userId))
      .orderBy(desc(chatMessages.createdAt))
      .limit(limit);
  } catch (error) {
    console.error("[Database] Failed to get chat history:", error);
    throw error;
  }
}

export async function insertCard(card: InsertCard): Promise<any> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot insert card: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(cards).values(card);
    return result;
  } catch (error) {
    console.error("[Database] Failed to insert card:", error);
    throw error;
  }
}


export async function getPopularCards(limit: number = 10) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get popular cards: database not available");
    return [];
  }

  try {
    const results = await db
      .select({
        card: cards,
        stats: cardStats,
      })
      .from(cardStats)
      .innerJoin(cards, eq(cardStats.cardId, cards.id))
      .orderBy(desc(cardStats.usageCount))
      .limit(limit);

    return results;
  } catch (error) {
    console.error("[Database] Failed to get popular cards:", error);
    throw error;
  }
}

export async function getCardStats(cardId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get card stats: database not available");
    return undefined;
  }

  try {
    const result = await db
      .select()
      .from(cardStats)
      .where(eq(cardStats.cardId, cardId))
      .limit(1);

    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get card stats:", error);
    throw error;
  }
}

export async function updateCardStats(cardId: number, stats: Partial<InsertCardStats>) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update card stats: database not available");
    return undefined;
  }

  try {
    const existing = await getCardStats(cardId);
    
    if (existing) {
      return await db
        .update(cardStats)
        .set(stats)
        .where(eq(cardStats.cardId, cardId));
    } else {
      return await db.insert(cardStats).values({
        cardId,
        usageCount: stats.usageCount || 0,
        winRate: stats.winRate || 0,
        pickRate: stats.pickRate || 0,
        avgDeckPosition: stats.avgDeckPosition || 0,
      });
    }
  } catch (error) {
    console.error("[Database] Failed to update card stats:", error);
    throw error;
  }
}


export async function createDeck(deck: InsertDeck) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create deck: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(decks).values(deck);
    return result;
  } catch (error) {
    console.error("[Database] Failed to create deck:", error);
    throw error;
  }
}

export async function getUserDecks(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user decks: database not available");
    return [];
  }

  try {
    const result = await db
      .select()
      .from(decks)
      .where(eq(decks.userId, userId));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get user decks:", error);
    throw error;
  }
}

export async function getDeckById(deckId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get deck: database not available");
    return undefined;
  }

  try {
    const result = await db
      .select()
      .from(decks)
      .where(eq(decks.id, deckId))
      .limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get deck:", error);
    throw error;
  }
}

export async function updateDeck(deckId: number, deckData: Partial<InsertDeck>) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update deck: database not available");
    return undefined;
  }

  try {
    return await db
      .update(decks)
      .set(deckData)
      .where(eq(decks.id, deckId));
  } catch (error) {
    console.error("[Database] Failed to update deck:", error);
    throw error;
  }
}

export async function deleteDeck(deckId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete deck: database not available");
    return undefined;
  }

  try {
    return await db
      .delete(decks)
      .where(eq(decks.id, deckId));
  } catch (error) {
    console.error("[Database] Failed to delete deck:", error);
    throw error;
  }
}

export async function getPublicDecks(limit: number = 20) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get public decks: database not available");
    return [];
  }

  try {
    const result = await db
      .select()
      .from(decks)
      .where(eq(decks.isPublic, true))
      .orderBy(desc(decks.likes))
      .limit(limit);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get public decks:", error);
    throw error;
  }
}


// Clans functions
export async function getTopClans(limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(clans).orderBy(desc(clans.trophies)).limit(limit);
  return result;
}

export async function getClanByTag(tag: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(clans).where(eq(clans.tag, tag)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createClan(clan: InsertClan) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.insert(clans).values(clan);
  return result;
}

// Players functions
export async function getTopPlayers(limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(players).orderBy(desc(players.trophies)).limit(limit);
  return result;
}

export async function getPlayerByTag(tag: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(players).where(eq(players.tag, tag)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createPlayer(player: InsertPlayer) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.insert(players).values(player);
  return result;
}

export async function getPlayersByClan(clanId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(players).where(eq(players.clanId, clanId));
  return result;
}
