"use server";

import { auth } from "@/auth";
import db from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { authenticator } from "otplib";

export const getTwoFactorAuth = async () => {

  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: true,
      message: "You must be logged in to enable two-factor authentication"
    }
  }

  const [user] = await db.select(
    {
      twoFactorSecret: users.two_factor_secret,
    }
  ).from(users).where(eq(users.id, parseInt(session?.user?.id as string)));

  if (!user) {
    return {
      error: true,
      message: "User not found"
    }
  }

  let tfs = user.twoFactorSecret;

  if (!tfs) {
    tfs = authenticator.generateSecret();

    await db.update(users)
      .set({
        two_factor_secret: tfs
      })
      .where(eq(users.id, parseInt(session.user.id)));
  }

  return {
    twoFactorSecret: authenticator.keyuri(
      session.user.email as string, "NextAuthCourse", tfs)
  }

}

export const activateTwoFactorAuth = async (otp: string) => {

  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: true,
      message: "You must be logged in to enable two-factor authentication"
    }
  }

  const [user] = await db.select(
    {
      twoFactorSecret: users.two_factor_secret,
    }
  ).from(users).where(eq(users.id, parseInt(session?.user?.id as string)));

  if (!user) {
    return {
      error: true,
      message: "User not found"
    }
  }

  if (user.twoFactorSecret) {
    const isValid = authenticator.check(
      otp,
      user.twoFactorSecret
    )

    if (!isValid) {
      return {
        error: true,
        message: "Invalid OTP"
      }
    }

    await db.update(users)
      .set({
        two_factor_enabled: true
      })
      .where(eq(users.id, parseInt(session.user.id)));
  };

}

export const deactivateTwoFactorAuth = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: true,
      message: "You must be logged in to enable two-factor authentication"
    }
  }

  await db.update(users)
    .set({
      two_factor_enabled: false
    })
    .where(eq(users.id, parseInt(session.user.id)));

}
