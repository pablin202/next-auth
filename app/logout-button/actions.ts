"use server";

import { signOut } from "@/auth";

export const logout = async () => {
  try {
    await signOut();
  } catch {
    return {
      error: true,
      message: "An error occurred while logging out the user",
    };
  }
};
