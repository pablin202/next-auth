import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { TwoFactorAuthForm } from "./two-factor-auth-form";
import { getUserById } from "./actions";

export default async function MyAccount() {

  const session = await auth();

  const user = await getUserById({ userId: session?.user?.id as string });



  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>
          My Account
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Label>Email Address</Label>
        <div className="text-muted-foreground">
          {session?.user?.email}
        </div>
        <TwoFactorAuthForm
          twoFactorEnabled={user.twoFactorEnabled ?? false} />
      </CardContent>
    </Card>
  );
}
