import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";


const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function Auth() {
  const [isRegister, setIsRegister] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signUp } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const { error } = await (isRegister ? signUp : signIn)(values.email, values.password);

      if (error) {
        throw error;
      }

      if (isRegister) {
        toast({
          title: "Registration Successful",
          description: "Please check your email to confirm your account.",
        });
        setIsRegister(false);
      }
      // No need to navigate here as AuthContext handles it
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Authentication failed",
        variant: "destructive",
      });
      if (isRegister) {
        
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-6 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">
            {isRegister ? "Create an account" : "Welcome back"}
          </h1>
          <p className="text-muted-foreground">
            {isRegister
              ? "Enter your details to create your account"
              : "Enter your credentials to sign in"}
          </p>
        </div>

        
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
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
                        placeholder="Enter your password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Please wait..."
                    : isRegister
                    ? "Create account"
                    : "Sign in"}
                </Button>
              </div>

              <Button
                type="button"
                variant="link"
                className="w-full"
                onClick={() => {
                  setIsRegister(!isRegister);
                  form.reset();
                }}
              >
                {isRegister
                  ? "Already have an account? Sign in"
                  : "Need an account? Register"}
              </Button>
            </form>
          </Form>
      </div>
    </div>
  );
}