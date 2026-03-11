"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/logo";

const formSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

type LoginProps = {
  onSubmitAuth: (email: string, password: string) => Promise<void>;
  loading?: boolean;
  isRegister?: boolean;
  onToggleMode: () => void;
};

const Login = ({ onSubmitAuth, loading = false, isRegister = false, onToggleMode }: LoginProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await onSubmitAuth(data.email, data.password);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-zinc-400">
      <div className="grid h-full w-full p-4 lg:grid-cols-2">
        <div className="m-auto flex w-full max-w-xs flex-col items-center">
          <Logo className="h-30 w-200"/>
          <p className="mt-4 font-semibold text-xl tracking-tight">
            {isRegister ? "Create your account" : "Log in to your account"}
          </p>

          <Form {...form}>
            <form
              className="w-full space-y-8"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full"
                        placeholder="Email"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
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
                      <Input
                        className="w-full"
                        placeholder="Password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="mt-4 w-full" disabled={loading} type="submit">
                {loading ? "Please wait..." : isRegister ? "Create Account" : "Login"}
              </Button>
            </form>
          </Form>

          <div className="mt-5">
            <p className="text-center text-sm">
              {isRegister ? "Already have an account?" : "Don't have an account?"}
              <button
                className="ml-1 text-muted-foreground underline"
                onClick={onToggleMode}
                type="button"
              >
                {isRegister ? "Login" : "Create account"}
              </button>
            </p>
          </div>
        </div>
        <div className="hidden rounded-lg border bg-muted lg:block" />
      </div>
    </div>
  );
};

export default Login;
