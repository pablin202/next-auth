"use server";

import db from "@/db/drizzle";
import { passwordMatchSchema } from "@/validation/passwordMatchSchema";
import { z } from "zod";
import { hash } from "bcryptjs";
import { users } from "../../../db/usersSchema";

export const registerUser = async ({
  email,
  password,
  confirmPassword,
}: {
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  try {
    const newUserSchema = z
      .object({
        email: z.string().email(),
      })
      .and(passwordMatchSchema);

    const newUserValidation = newUserSchema.safeParse({
      email,
      password,
      confirmPassword,
    });

    if (!newUserValidation.success) {
      return {
        error: true,
        message: newUserValidation.error.errors[0]?.message ?? "Invalid input",
      };
    }

    const hashedPassword = await hash(password, 10);

    await db.insert(users).values({
      email,
      password: hashedPassword,
    });
  } catch (error: unknown) {

    interface DatabaseError extends Error {
      code: string;
    }

    if (error instanceof Error && (error as DatabaseError).code === "23505") {
      return {
        error: true,
        message: "User with that email already exists",
      };
    }
    return {
      error: true,
      message: "An error occurred while registering the user",
    };
  }
  return {
    error: false,
    message: "User registered successfully",
  };
};
