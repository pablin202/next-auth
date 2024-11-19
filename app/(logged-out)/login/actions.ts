"use server";

import { z } from "zod";
import { passwordSchema } from "@/validation/passwordSchema";
import { signIn } from "@/auth";
import { users } from "@/db/schema";
import db from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";

export const login = async ({
  email,
  password,
  token
}: {
  email: string;
  password: string;
  token?: string
}) => {
  const loginSchema = z.object({
    email: z.string().email(),
    password: passwordSchema,
  });

  const loginValidation = loginSchema.safeParse({
    email,
    password,
  });

  if (!loginValidation.success) {
    return {
      error: true,
      message: loginValidation.error.errors[0]?.message ?? "Invalid input",
    };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      token,
      redirect: false,
    });
  } catch {
    return {
      error: true,
      message: "Incorrect user or password",
    };
  }
};

export const preLoginCheck = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (!user) {
    return {
      error: true,
      message: "Incorrect user or password",
    };
  } else {
    const correctPassword = await compare(
      password,
      user.password as string
    );

    if (!correctPassword) {
      return {
        error: true,
        message: "Incorrect user or password",
      };
    }

    return {
      twoFactorEnabled: user.two_factor_enabled,
    }
  }
}