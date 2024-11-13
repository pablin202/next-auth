"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { passwordSchema } from "@/validation/passwordSchema";
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
import { changePasswrod } from "./actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  currentPassword: passwordSchema,
}).and(passwordMatchSchema);

export default function ChangePasswordForm() {

  const router = useRouter();
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const response = await changePasswrod(data);

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
      router.push("/my-account");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <fieldset
          disabled={form.formState.isSubmitting}
          className="flex flex-col gap-2"
        >
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
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
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage></FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Confirm Password</FormLabel>
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

          <Button type="submit">Change Password</Button>
        </fieldset>
      </form>
    </Form>)
}