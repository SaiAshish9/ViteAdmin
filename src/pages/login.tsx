import { useState } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { useToast } from "../hooks/use-toast";
import { auth, googleProvider, isFirebaseConfigured } from "../lib/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

// Form validation schema
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [_, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Initialize form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle form submission
  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    try {
      if (isFirebaseConfigured() && auth) {
        // Use Firebase authentication
        await signInWithEmailAndPassword(auth, data.email, data.password);
        toast({
          title: "Success",
          description: "You have successfully logged in.",
        });
      } else {
        // For demo purposes when Firebase isn't configured
        console.log("Firebase not configured, using demo auth");
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      
      // Store authenticated status
      localStorage.setItem("authenticated", "true");
      
      // Redirect to dashboard
      setLocation("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Handle Google authentication
  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      if (isFirebaseConfigured() && auth) {
        // Use Firebase for Google authentication
        await signInWithPopup(auth, googleProvider);
        toast({
          title: "Success",
          description: "You have successfully logged in with Google.",
        });
      } else {
        // For demo purposes when Firebase isn't configured
        console.log("Firebase not configured, using demo auth");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast({
          title: "Demo mode",
          description: "Google authentication simulation successful.",
        });
      }
      
      // Store authenticated status
      localStorage.setItem("authenticated", "true");
      
      // Redirect to dashboard
      setLocation("/dashboard");
    } catch (error) {
      console.error("Google auth failed:", error);
      toast({
        title: "Google login failed",
        description: "An error occurred during Google authentication.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black/95 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.5 6.5C15.3284 6.5 16 5.82843 16 5C16 4.17157 15.3284 3.5 14.5 3.5C13.6716 3.5 13 4.17157 13 5C13 5.82843 13.6716 6.5 14.5 6.5Z" fill="currentColor"/>
              <path d="M9.5 8C10.3284 8 11 7.32843 11 6.5C11 5.67157 10.3284 5 9.5 5C8.67157 5 8 5.67157 8 6.5C8 7.32843 8.67157 8 9.5 8Z" fill="currentColor"/>
              <path d="M17 9.5C17 10.3284 16.3284 11 15.5 11C14.6716 11 14 10.3284 14 9.5C14 8.67157 14.6716 8 15.5 8C16.3284 8 17 8.67157 17 9.5Z" fill="currentColor"/>
              <path d="M11 12.5C11 13.3284 10.3284 14 9.5 14C8.67157 14 8 13.3284 8 12.5C8 11.6716 8.67157 11 9.5 11C10.3284 11 11 11.6716 11 12.5Z" fill="currentColor"/>
              <path d="M18.5 14C19.3284 14 20 13.3284 20 12.5C20 11.6716 19.3284 11 18.5 11C17.6716 11 17 11.6716 17 12.5C17 13.3284 17.6716 14 18.5 14Z" fill="currentColor"/>
              <path d="M14.5 19C15.3284 19 16 18.3284 16 17.5C16 16.6716 15.3284 16 14.5 16C13.6716 16 13 16.6716 13 17.5C13 18.3284 13.6716 19 14.5 19Z" fill="currentColor"/>
              <path d="M9.5 17C8.67157 17 8 17.6716 8 18.5C8 19.3284 8.67157 20 9.5 20C10.3284 20 11 19.3284 11 18.5C11 17.6716 10.3284 17 9.5 17Z" fill="currentColor"/>
              <path d="M6.5 15C5.67157 15 5 15.6716 5 16.5C5 17.3284 5.67157 18 6.5 18C7.32843 18 8 17.3284 8 16.5C8 15.6716 7.32843 15 6.5 15Z" fill="currentColor"/>
              <path d="M4.5 11C3.67157 11 3 11.6716 3 12.5C3 13.3284 3.67157 14 4.5 14C5.32843 14 6 13.3284 6 12.5C6 11.6716 5.32843 11 4.5 11Z" fill="currentColor"/>
              <path d="M5 8.5C5 7.67157 5.67157 7 6.5 7C7.32843 7 8 7.67157 8 8.5C8 9.32843 7.32843 10 6.5 10C5.67157 10 5 9.32843 5 8.5Z" fill="currentColor"/>
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to ProxyTalk</CardTitle>
          <CardDescription>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            variant="outline" 
            onClick={handleGoogleAuth} 
            disabled={isLoading}
            className="w-full"
          >
            <FcGoogle className="mr-2 h-5 w-5" />
            Sign in with Google
          </Button>
          
          <div className="relative my-4">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-card px-2 text-xs text-muted-foreground">
                OR CONTINUE WITH EMAIL
              </span>
            </div>
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
                      <Input placeholder="mail@example.com" {...field} />
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
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Button
              variant="link"
              className="p-0"
              onClick={() => setLocation("/register")}
              disabled={isLoading}
            >
              Sign up
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}