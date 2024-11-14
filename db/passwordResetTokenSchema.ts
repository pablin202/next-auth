import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./usersSchema";

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id, {
    onDelete: "cascade",
  }).unique(),
  token: text("token").unique(),
  expires_at: timestamp("expires_at"),
});
