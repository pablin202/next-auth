"use server";

import { auth } from "@/auth";
import db from "@/db/drizzle";
import { users, passwordResetTokens } from "@/db/schema";
import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";

export const resetPassword = async ({
  email,
}: {
  email: string;
}) => {

  const session = await auth();

  if (!!session?.user?.id) {
    return {
      error: true,
      message: "You must be logged out to reset your password"
    }
  }

  // Send reset password email
  const [user] = await db.select({ id: users.id })
    .from(users)
    .where(eq(users.email, email));

  if (!user) {
    return;
  }

  // Send email with reset link
  const passwordResetToken = randomBytes(32).toString("hex");

  await db.insert(passwordResetTokens)
    .values({
      user_id: user.id,
      token: passwordResetToken,
      expires_at: new Date(Date.now() + 1000 * 60 * 60),
    }).onConflictDoUpdate({
      target: passwordResetTokens.user_id,
      set: {
        token: passwordResetToken,
        expires_at: new Date(Date.now() + 1000 * 60 * 60),
      },
    });
}
