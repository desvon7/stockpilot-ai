
import { pgTable, serial, text, timestamp, numeric, uuid, foreignKey, integer } from "drizzle-orm/pg-core";

// Users table (extending Supabase auth.users)
export const users = pgTable("users", {
  id: uuid("id").primaryKey().notNull(),
  email: text("email").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
  full_name: text("full_name"),
  avatar_url: text("avatar_url"),
});

// Portfolio holdings table
export const portfolioHoldings = pgTable("portfolio_holdings", {
  id: serial("id").primaryKey(),
  user_id: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  symbol: text("symbol").notNull(),
  company_name: text("company_name").notNull(),
  shares: numeric("shares").notNull(),
  average_price: numeric("average_price").notNull(),
  current_price: numeric("current_price"),
  profit_loss: numeric("profit_loss"),
  profit_loss_percent: numeric("profit_loss_percent"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Watchlists table
export const watchlists = pgTable("watchlists", {
  id: serial("id").primaryKey(),
  user_id: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Watchlist items table
export const watchlistItems = pgTable("watchlist_items", {
  id: serial("id").primaryKey(),
  watchlist_id: integer("watchlist_id").notNull().references(() => watchlists.id, { onDelete: "cascade" }),
  symbol: text("symbol").notNull(),
  current_price: numeric("current_price"),
  price_change: numeric("price_change"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Market indices table
export const marketIndices = pgTable("market_indices", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  value: numeric("value").notNull(),
  change: numeric("change").notNull(),
  change_percent: numeric("change_percent").notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Portfolio history table
export const portfolioHistory = pgTable("portfolio_history", {
  id: serial("id").primaryKey(),
  user_id: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull(),
  total_value: numeric("total_value").notNull(),
  cash_value: numeric("cash_value").notNull(),
  stocks_value: numeric("stocks_value").notNull(),
});

// Transactions table
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  user_id: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  symbol: text("symbol").notNull(),
  type: text("type").notNull(), // 'buy' or 'sell'
  shares: numeric("shares").notNull(),
  price: numeric("price").notNull(),
  total: numeric("total").notNull(),
  date: timestamp("date").defaultNow().notNull(),
});
