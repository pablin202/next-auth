"use server";

import { auth } from "@/auth";
import db from "@/db/drizzle";
import { passwordResetTokens } from "@/db/schema";
import { users } from "@/db/usersSchema";
import { passwordMatchSchema } from "@/validation/passwordMatchSchema";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";

export const updatePassword = async (
  {
    token,
    password,
    confirmPassword
  }:
    {
      token: string,
      password: string,
      confirmPassword: string
    }
) => {

  const passwordValidation = passwordMatchSchema.safeParse({
    password,
    confirmPassword,
  });

  if (!passwordValidation.success) {
    return {
      error: true,
      message:
        passwordValidation.error.issues[0]?.message ?? "An error occurred",
    };
  }

  const session = await auth();

  if (session?.user?.id) {
    return {
      error: true,
      message: "Already logged in. Please log out to reset your password.",
    };
  }

  let tokenIsValid = false;

  if (token) {
    const [passwordResetToken] = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token));

    const now = Date.now();

    if (
      !!passwordResetToken?.expires_at &&
      now < passwordResetToken.expires_at.getTime()
    ) {
      tokenIsValid = true;
    }

    if (!tokenIsValid) {
      return {
        error: true,
        message: "Your token is invalid or has expired",
        tokenInvalid: true,
      };
    }

    const hashedPassword = await hash(password, 10);
    await db
      .update(users)
      .set({
        password: hashedPassword,
      })
      .where(eq(users.id, passwordResetToken.user_id!));

    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.id, passwordResetToken.id));
  }
}