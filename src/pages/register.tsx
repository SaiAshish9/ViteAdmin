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
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from "firebase/auth";
import { OtpVerification } from "../components/auth/otp-verification";

// Form validation schema
const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const [_, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [registrationData, setRegistrationData] = useState<RegisterFormValues | null>(null);
  const [showOtpVerification, setShowOtpVerification] = useState(false);

  // Initialize form
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle form submission - now triggers OTP verification
  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true);
    try {
      // Store the registration data for later use
      setRegistrationData(data);
      
      // In a real app, we would send an OTP to the user's phone here
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Show OTP verification screen
      setShowOtpVerification(true);
      
      toast({
        title: "Verification Required",
        description: `We've sent a verification code to ${data.phone}`,
      });
    } catch (error: any) {
      console.error("Registration process failed:", error);
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during registration process.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  // Complete registration after OTP verification
  const completeRegistration = async () => {
    if (!registrationData) return;
    
    setIsLoading(true);
    try {
      if (isFirebaseConfigured() && auth) {
        // Use Firebase authentication for registration
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          registrationData.email, 
          registrationData.password
        );
        
        // Update user profile with name
        if (userCredential.user) {
          await updateProfile(userCredential.user, {
            displayName: registrationData.name
          });
        }
        
        toast({
          title: "Account created",
          description: "You have successfully registered.",
        });
      } else {
        // For demo purposes when Firebase isn't configured
        console.log("Firebase not configured, using demo registration");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast({
          title: "Demo mode",
          description: "Registration simulation successful.",
        });
      }
      
      // Store authenticated status
      localStorage.setItem("authenticated", "true");
      
      // Redirect to dashboard
      setLocation("/dashboard");
    } catch (error: any) {
      console.error("Registration failed:", error);
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during registration.",
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
          description: "You have successfully registered with Google.",
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
    } catch (error: any) {
      console.error("Google auth failed:", error);
      toast({
        title: "Google login failed",
        description: error.message || "An error occurred during Google authentication.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black/95 p-4">
      {showOtpVerification && registrationData ? (
        <OtpVerification
          phoneNumber={registrationData.phone}
          onVerificationComplete={completeRegistration}
          onCancel={() => setShowOtpVerification(false)}
        />
      ) : (
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription>
              Sign up to start managing your voice campaigns
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
              Sign up with Google
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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
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
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Sign up"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Button
                variant="link"
                className="p-0"
                onClick={() => setLocation("/login")}
                disabled={isLoading}
              >
                Sign in
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}