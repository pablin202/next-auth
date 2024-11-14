"use server";

import { auth } from "@/auth";
import db from "@/db/drizzle";
import { users } from "@/db/usersSchema";
import { passwordMatchSchema } from "@/validation/passwordMatchSchema";
import { passwordSchema } from "@/validation/passwordSchema";
import { compare, hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const changePassword = async (
  {
    currentPassword,
    password,
    confirmPassword
  }:
    {
      currentPassword: string,
      password: string,
      confirmPassword: string
    }
) => {

  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: true,
      message: "You must be logged in to change your password"
    }
  }

  const formSchema = z.object({
    currentPassword: passwordSchema
  }).and(passwordMatchSchema);

  const result = formSchema.safeParse({
    currentPassword,
    password,
    confirmPassword
  });

  if (result?.error) {
    return {
      error: true,
      message: result.error.issues?.[0]?.message ?? "An error occurred"
    }
  }

  const [user] = await db.select()
    .from(users)
    .where(eq(users.id, parseInt(session.user.id)));

  if (!user) {
    return {
      error: true,
      message: "User not found"
    }
  } else {

    const correctPassword = await compare(
      currentPassword as string,
      user.password as string
    );

    if (!correctPassword) {
      return {
        error: true,
        message: "Incorrect current password"
      }
    }

    const hashedPassword = await hash(password, 10);

    await db.update(users)
      .set({
        password: hashedPassword
      })
      .where(eq(users.id, parseInt(session.user.id)));

  }
}