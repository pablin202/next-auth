"use server";

import { passwordMatchSchema } from "@/validation/passwordMatchSchema";
import { z } from "zod";

export const registerUser = async ({
  email,
  password,
  confirmPassword,
}: {
  email: string;
  password: string;
  confirmPassword: string;
}) => {
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

  const response = await fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Failed to register");
  }
};
