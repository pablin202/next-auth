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
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { resetPassword } from "./actions";

const formSchema = z.object({
  email: z.string().email(),
});

export default function PasswordReset(
) {

  const searchParams = useSearchParams()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: decodeURIComponent(searchParams.get("email") ?? ""),
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const response = await resetPassword(data);

    if (response?.error) {
      form.setError("root", {
        type: "manual",
        message: response.message,
      });
      return;
    }
  };

  return (<main className="flex justify-center items-center min-h-screen">
    {form.formState.isSubmitSuccessful ? (
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Email Sent</CardTitle>
        </CardHeader>
        <CardContent>
          If your email address is associated with an account,
          you will receive an email with instructions on how to reset your password.
        </CardContent>
      </Card>
    ) : (
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Password Reset</CardTitle>
          <CardDescription>Enter your email address to reset your password.</CardDescription>
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
                {!!form.formState.errors.root?.message && (
                  <FormMessage>
                    {form.formState.errors.root?.message}
                  </FormMessage>
                )}
                <Button type="submit">Submit</Button>
              </fieldset>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm text-muted-foreground">
          <div className="text-muted-foreground text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
          <div className="text-muted-foreground text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline">
              Register
            </Link>
          </div>
        </CardFooter>
      </Card>
    )}
  </main>);
}