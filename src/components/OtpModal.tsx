import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck } from "lucide-react";

interface OtpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerify: (otp: string) => Promise<boolean> | void;
  onResend?: () => void;
  title?: string;
  description?: string;
  loading?: boolean;
}

// OTP verification modal with 6-digit input
const OtpModal = ({
  open,
  onOpenChange,
  onVerify,
  onResend,
  title = "Verify OTP",
  description = "Enter the 6-digit code sent to your email",
  loading: externalLoading,
}: OtpModalProps) => {
  const [otp, setOtp] = useState("");
  const [internalLoading, setInternalLoading] = useState(false);

  const isLoading = externalLoading ?? internalLoading;

  const handleVerify = async () => {
    if (otp.length < 6) return;
    setInternalLoading(true);
    await onVerify(otp);
    setInternalLoading(false);
    setOtp("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <ShieldCheck className="w-7 h-7 text-primary" />
          </div>
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6 py-4">
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <Button onClick={handleVerify} disabled={otp.length < 6 || isLoading} className="w-full">
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Verifying...</> : "Verify"}
          </Button>
          {onResend && (
            <button type="button" onClick={onResend} className="text-sm text-primary hover:underline">
              Resend OTP
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OtpModal;
