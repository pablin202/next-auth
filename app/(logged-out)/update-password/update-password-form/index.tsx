"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { passwordMatchSchema } from "@/validation/passwordMatchSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { updatePassword } from "./actions";
import { Link } from "lucide-react";

const formSchema = passwordMatchSchema;

type Props = {
  token: string;
};

export default function UpdatePasswordForm({ token }: Props) {

  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const response = await updatePassword({
      token: token,
      password: data.password,
      confirmPassword: data.confirmPassword
    });

    if (response?.tokenInvalid) {
      window.location.reload();
    }

    if (response?.error) {
      form.setError("root", {
        type: "manual",
        message: response.message,
      });
    } else {
      form.reset();
      toast({
        title: "Password Changed",
        description: "Password changed successfully",
        className: "bg-green-500 text-white",
      });
    }
  }

  return form.formState.isSubmitSuccessful ? (
    <div>
      You password has been updated.{" "}
      <Link className="underline" href="/login">
        Click here to login to your account
      </Link>
    </div>
  ) : (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <fieldset
          disabled={form.formState.isSubmitting}
          className="flex flex-col gap-2"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password Confirm</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {!!form.formState.errors.root?.message && (
            <FormMessage>{form.formState.errors.root?.message}</FormMessage>
          )}
          <Button type="submit">Update Password</Button>
        </fieldset>
      </form>
    </Form>
  );
}