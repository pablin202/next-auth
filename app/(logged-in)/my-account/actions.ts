"use server";

import db from "@/db/drizzle";
import { users } from "@/db/usersSchema";
import { eq } from "drizzle-orm";

export const getUserById = async (
  {
    userId
  }:
    {
      userId: string,
    }
) => {
  const [user] = await db.select(
    {
      twoFactorEnabled: users.two_factor_enabled,
    }
  ).from(users).where(eq(users.id, parseInt(userId)));

  return user;
} 