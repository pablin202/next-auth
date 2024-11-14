import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import db from "@/db/drizzle";
import { passwordResetTokens } from "@/db/passwordResetTokenSchema";
import { eq } from "drizzle-orm";
import UpdatePasswordForm from "./update-password-form";

// eslint-disable-next-line @next/next/no-async-client-component
export default async function UpdatePassword({ searchParams }: {
  searchParams: {
    token?: string;
  }
}) {

  let tokenIsValid = false;

  const { token } = searchParams;

  console.log(token);

  if (token) {
    const [passwordResetToken] = await db.select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token));

    const now = Date.now();

    if (!!passwordResetToken?.expires_at && passwordResetToken.expires_at.getTime() > now) {
      tokenIsValid = true;
    }
  }

  return (
    <main className="flex justify-center items-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>
            {tokenIsValid
              ? "Update password"
              : "Your password reset link is invalid or has expired"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tokenIsValid ? (
            <UpdatePasswordForm token={token ?? ""} />
          ) : (
            <Link className="underline" href="/password-reset">
              Request another password reset link
            </Link>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
