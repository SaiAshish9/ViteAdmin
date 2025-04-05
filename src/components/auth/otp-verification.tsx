import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { useToast } from "../../hooks/use-toast";

interface OtpVerificationProps {
  phoneNumber: string;
  onVerificationComplete: () => void;
  onCancel: () => void;
}

export const OtpVerification = ({ phoneNumber, onVerificationComplete, onCancel }: OtpVerificationProps) => {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(30);
  const { toast } = useToast();

  // Start resend timer
  const startResendTimer = () => {
    setResendDisabled(true);
    setTimer(30);
    
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle resend OTP
  const handleResendOtp = () => {
    // In a real app, this would trigger a new OTP to be sent
    toast({
      title: "OTP Resent",
      description: `A new verification code has been sent to ${phoneNumber}`,
    });
    
    startResendTimer();
  };

  // Handle skip verification for demo
  const handleSkipVerification = () => {
    toast({
      title: "Verification Skipped",
      description: "For demo purposes, we're skipping verification",
    });
    
    onVerificationComplete();
  };

  // Handle OTP verification
  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit code",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // In a real app, this would verify the OTP with a backend service
      // For demo purposes, we'll use a simple simulation
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          // Simulate successful verification (any OTP is accepted in demo)
          resolve();
        }, 1500);
      });
      
      toast({
        title: "Phone Verified",
        description: "Your phone number has been successfully verified",
      });
      
      onVerificationComplete();
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Failed to verify your phone number. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Verify Your Phone</CardTitle>
        <CardDescription>
          We've sent a verification code to {phoneNumber}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-full flex justify-center mb-4">
            <Button onClick={handleSkipVerification} variant="outline">
              Skip Verification (Demo)
            </Button>
          </div>
          
          <div className="text-xs text-center text-muted-foreground mb-4">
            Enter any 6 digits to simulate verification
          </div>
          
          <div className="flex justify-center gap-2">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i}
                className="w-10 h-10 border rounded flex items-center justify-center text-lg"
              >
                {otp[i] || ''}
              </div>
            ))}
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
              <Button
                key={num}
                variant="outline"
                className="w-12 h-12"
                onClick={() => {
                  if (otp.length < 6) {
                    setOtp(prev => prev + num);
                  }
                }}
              >
                {num}
              </Button>
            ))}
            <Button
              variant="outline"
              className="w-12 h-12"
              onClick={() => setOtp(prev => prev.slice(0, -1))}
            >
              ←
            </Button>
          </div>
          
          <Button 
            onClick={handleVerify} 
            className="w-full mt-4" 
            disabled={isSubmitting || otp.length !== 6}
          >
            {isSubmitting ? "Verifying..." : "Verify Code"}
          </Button>
        </div>
        
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-2">
            Didn't receive a code?
          </div>
          <Button
            variant="link"
            onClick={handleResendOtp}
            disabled={resendDisabled}
            className="text-sm"
          >
            {resendDisabled ? `Resend code in ${timer}s` : "Resend code"}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>
          Go Back
        </Button>
      </CardFooter>
    </Card>
  );
};