import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").unique(),
  password: text("password"),
  created_at: timestamp("created_at").defaultNow(),
  two_factor_enabled: boolean("two_factor_enabled").default(false),
  two_factor_secret: text("two_factor_secret"),
});
