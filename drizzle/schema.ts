import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const cards = mysqlTable("cards", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 128 }).notNull().unique(),
  type: varchar("type", { length: 64 }).notNull(), // Troop, Spell, Building, etc
  elixirCost: int("elixirCost").notNull(),
  rarity: varchar("rarity", { length: 64 }).notNull(), // Common, Rare, Epic, Legendary
  description: text("description").notNull(),
  hitPoints: int("hitPoints"),
  damage: int("damage"),
  deployTime: int("deployTime"), // in seconds
  speed: varchar("speed", { length: 64 }), // Slow, Medium, Fast
  range: varchar("range", { length: 64 }), // Short, Medium, Long
  imageUrl: varchar("imageUrl", { length: 512 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Card = typeof cards.$inferSelect;
export type InsertCard = typeof cards.$inferInsert;

export const chatMessages = mysqlTable("chatMessages", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  role: varchar("role", { length: 32 }).notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  cardReferences: text("cardReferences"), // JSON array of card IDs mentioned
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;

export const cardStats = mysqlTable("cardStats", {
  id: int("id").autoincrement().primaryKey(),
  cardId: int("cardId").notNull().references(() => cards.id),
  usageCount: int("usageCount").default(0).notNull(),
  winRate: int("winRate").default(0).notNull(),
  pickRate: int("pickRate").default(0).notNull(),
  avgDeckPosition: int("avgDeckPosition").default(0),
  lastUpdated: timestamp("lastUpdated").defaultNow().onUpdateNow().notNull(),
});

export type CardStats = typeof cardStats.$inferSelect;
export type InsertCardStats = typeof cardStats.$inferInsert;


export const decks = mysqlTable("decks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  cardIds: text("cardIds").notNull(), // JSON array of 8 card IDs
  averageElixir: int("averageElixir").notNull(),
  isPublic: boolean("isPublic").default(false).notNull(),
  likes: int("likes").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Deck = typeof decks.$inferSelect;
export type InsertDeck = typeof decks.$inferInsert;

export const deckLikes = mysqlTable("deckLikes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  deckId: int("deckId").notNull().references(() => decks.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DeckLike = typeof deckLikes.$inferSelect;
export type InsertDeckLike = typeof deckLikes.$inferInsert;


export const clans = mysqlTable("clans", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  tag: varchar("tag", { length: 20 }).notNull().unique(),
  description: text("description"),
  trophies: int("trophies").notNull().default(0),
  memberCount: int("memberCount").notNull().default(0),
  requiredTrophies: int("requiredTrophies").notNull().default(0),
  region: varchar("region", { length: 50 }),
  badgeUrl: varchar("badgeUrl", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const players = mysqlTable("players", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  tag: varchar("tag", { length: 20 }).notNull().unique(),
  trophies: int("trophies").notNull().default(0),
  bestTrophies: int("bestTrophies").notNull().default(0),
  wins: int("wins").notNull().default(0),
  losses: int("losses").notNull().default(0),
  level: int("level").notNull().default(1),
  arena: varchar("arena", { length: 50 }),
  clanId: int("clanId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Clan = typeof clans.$inferSelect;
export type InsertClan = typeof clans.$inferInsert;
export type Player = typeof players.$inferSelect;
export type InsertPlayer = typeof players.$inferInsert;
