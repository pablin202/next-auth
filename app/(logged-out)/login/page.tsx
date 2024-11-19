"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button";
import { passwordSchema } from "@/validation/passwordSchema";
import { login, preLoginCheck } from "./actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React from "react";

const formSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
});

export default function Login() {
  const router = useRouter();
  const [step, setStep] = React.useState(1);
  const [otp, setOtp] = React.useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {

    const preLoginCheckResponse = await preLoginCheck(data);

    if (preLoginCheckResponse?.error) {
      form.setError("root", {
        type: "manual",
        message: preLoginCheckResponse.message,
      });
      return;
    }

    if (preLoginCheckResponse?.twoFactorEnabled) {
      setStep(2);
    } else {

      const response = await login(data);

      if (response?.error) {
        form.setError("root", {
          type: "manual",
          message: response.message,
        });
        return;
      }

      router.push("/my-account");
    }
  };

  const handleSubmitOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await login(
      {
        email: form.getValues("email"),
        password: form.getValues("password"),
        token: otp
      }
    );

    if (response?.error) {
      form.setError("root", {
        type: "manual",
        message: response.message,
      });
      return;
    }

    router.push("/my-account");
  }

  const email = form.getValues("email");

  return (
    <main className="flex justify-center items-center min-h-screen">
      {step === 1 && (
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Login to your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <fieldset
                  disabled={form.formState.isSubmitting}
                  className="flex flex-col gap-2"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage></FormMessage>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" />
                        </FormControl>
                        <FormMessage></FormMessage>
                      </FormItem>
                    )}
                  />
                  {!!form.formState.errors.root?.message && (
                    <FormMessage>
                      {form.formState.errors.root?.message}
                    </FormMessage>
                  )}
                  <Button type="submit">Login</Button>
                </fieldset>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <div className="text-muted-foreground text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="underline">
                Register
              </Link>
            </div>
            <div className="text-muted-foreground text-sm">
              Forgot password?{" "}
              <Link
                href={`/password-reset${email ? `?email=${encodeURIComponent(email)}` : ""
                  }`}
                className="underline"
              >
                Reset my password
              </Link>
            </div>
          </CardFooter>
        </Card>)}
      {step === 2 && (
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>One-Time Passcode</CardTitle>
            <CardDescription>Enter the one-time passcode form NextAuth displayed in yout Google Authenticator app.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-2" onSubmit={handleSubmitOtp}>
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <Button type="submit" disabled={otp.length !== 6}
                className="w-full my-2">Verify OTP
              </Button>
              <Button onClick={() => setStep(1)}
                className="w-full my-2"
                variant="outline">Cancel
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
